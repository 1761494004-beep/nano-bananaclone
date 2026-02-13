import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"
import { CREDITS_PER_GENERATION } from "@/lib/credits"
import { createAdminClient } from "@/lib/supabase/admin"

const KIE_API_BASE_URL = "https://api.kie.ai"
const KIE_UPLOAD_BASE_URL = "https://kieai.redpandaai.co"
const MODEL = "gpt-image/1.5-image-to-image"

type KieApiResponse<T> = {
  code: number
  message?: string
  data?: T
}

type KieUploadResponse = {
  success: boolean
  code?: number
  data?: {
    fileName: string
    filePath?: string
    // docs use downloadUrl; some older examples use fileUrl
    downloadUrl?: string
    fileUrl?: string
    fileSize: number
    mimeType?: string
  }
  msg?: string
  message?: string
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function normalizeApiKey(value: string) {
  // Users sometimes paste keys with trailing punctuation, e.g. "...,，"
  return value.trim().replace(/[，,]+$/g, "")
}

function safeFileName(name: string) {
  return name.replace(/[^\w.\-]+/g, "-").slice(0, 120) || "upload.png"
}

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`Unexpected non-JSON response (${res.status}): ${text.slice(0, 200)}`)
  }
}

export const runtime = "nodejs"

export async function POST(req: Request) {
  const creditsCost = CREDITS_PER_GENERATION
  let deducted = false
  let creditsBefore: number | null = null
  let userId: string | null = null

  async function refundCreditsIfNeeded() {
    if (!deducted || creditsBefore === null || !userId) return
    try {
      const supabaseAdmin = createAdminClient()
      await supabaseAdmin
        .from("user_credits")
        .upsert(
          { user_id: userId, credits: creditsBefore, updated_at: new Date().toISOString() },
          { onConflict: "user_id" },
        )
    } catch {
      // Best-effort refund. Avoid masking the original error response.
    }
  }

  try {
    const apiKey = normalizeApiKey(getRequiredEnv("KIE_API_KEY"))

    const form = await req.formData()
    const promptValue = form.get("prompt")
    const imageValue = form.get("image")
    const aspectRatioValue = form.get("aspect_ratio")
    const qualityValue = form.get("quality")

    const prompt = typeof promptValue === "string" ? promptValue.trim() : ""
    const aspect_ratio = typeof aspectRatioValue === "string" ? aspectRatioValue : "3:2"
    const quality = typeof qualityValue === "string" ? qualityValue : "medium"

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }
    if (!(imageValue instanceof File)) {
      return NextResponse.json({ error: "Missing image file" }, { status: 400 })
    }

    const imageFile = imageValue

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image is too large (max 10MB)." }, { status: 413 })
    }

    // Credits: when Supabase is configured, require sign-in and deduct credits per generation.
    if (isSupabaseConfigured()) {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      userId = data.user?.id ?? null

      if (!userId) {
        return NextResponse.json({ error: "Please sign in before generating images." }, { status: 401 })
      }

      let supabaseAdmin: ReturnType<typeof createAdminClient>
      try {
        supabaseAdmin = createAdminClient()
      } catch (err) {
        return NextResponse.json(
          { error: err instanceof Error ? err.message : "Credits system is not configured." },
          { status: 500 },
        )
      }

      const { data: row, error: creditsErr } = await supabaseAdmin
        .from("user_credits")
        .select("credits")
        .eq("user_id", userId)
        .maybeSingle()

      if (creditsErr) {
        return NextResponse.json({ error: creditsErr.message }, { status: 500 })
      }

      const currentCredits = row?.credits ?? 0
      creditsBefore = currentCredits
      if (currentCredits < creditsCost) {
        return NextResponse.json(
          { error: `Insufficient credits. Need ${creditsCost} credits per generation.` },
          { status: 402 },
        )
      }

      const nextCredits = currentCredits - creditsCost
      const { error: deductErr } = await supabaseAdmin
        .from("user_credits")
        .upsert(
          { user_id: userId, credits: nextCredits, updated_at: new Date().toISOString() },
          { onConflict: "user_id" },
        )

      if (deductErr) {
        return NextResponse.json({ error: deductErr.message }, { status: 500 })
      }

      deducted = true
    }

    // 1) Upload the image to get a public URL (required by the KIE gpt-image job API).
    const uploadForm = new FormData()
    uploadForm.append("file", imageFile, safeFileName(imageFile.name))
    uploadForm.append("fileName", `${Date.now()}-${safeFileName(imageFile.name)}`)
    uploadForm.append("uploadPath", "images/user-uploads")

    const uploadRes = await fetch(`${KIE_UPLOAD_BASE_URL}/api/file-stream-upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: uploadForm,
    })

    const uploadJson = await readJson<KieUploadResponse>(uploadRes)
    const uploadedUrl = uploadJson.data?.downloadUrl ?? uploadJson.data?.fileUrl
    if (!uploadRes.ok || !uploadJson.success || !uploadedUrl) {
      await refundCreditsIfNeeded()
      return NextResponse.json(
        {
          error:
            uploadJson.msg ||
            uploadJson.message ||
            `Image upload failed (status ${uploadRes.status})`,
        },
        { status: 502 },
      )
    }

    // 2) Create the image-to-image generation task.
    const createRes = await fetch(`${KIE_API_BASE_URL}/api/v1/jobs/createTask`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        input: {
          input_urls: [uploadedUrl],
          prompt,
          aspect_ratio,
          quality,
        },
      }),
    })

    const createJson = await readJson<KieApiResponse<{ taskId: string }>>(createRes)
    const taskId = createJson.data?.taskId
    if (!createRes.ok || createJson.code !== 200 || !taskId) {
      await refundCreditsIfNeeded()
      return NextResponse.json(
        { error: createJson.message || "Failed to create generation task" },
        { status: 502 },
      )
    }

    // 3) Poll until the task completes (or time out).
    const timeoutMs = 3 * 60 * 1000
    const start = Date.now()
    let delayMs = 1200

    while (Date.now() - start < timeoutMs) {
      await sleep(delayMs)
      delayMs = Math.min(Math.round(delayMs * 1.35), 8000)

      const recordRes = await fetch(
        `${KIE_API_BASE_URL}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      )

      const recordJson = await readJson<
        KieApiResponse<{
          state: string
          resultJson?: string
          failMsg?: string
          failCode?: string
        }>
      >(recordRes)

      if (!recordRes.ok || recordJson.code !== 200 || !recordJson.data) {
        continue
      }

      if (recordJson.data.state === "fail") {
        await refundCreditsIfNeeded()
        return NextResponse.json(
          { error: recordJson.data.failMsg || "Generation failed", taskId },
          { status: 502 },
        )
      }

      if (recordJson.data.state === "success") {
        const resultRaw = recordJson.data.resultJson || "{}"
        let resultUrls: string[] = []
        try {
          const parsed = JSON.parse(resultRaw) as { resultUrls?: string[] }
          resultUrls = Array.isArray(parsed.resultUrls) ? parsed.resultUrls : []
        } catch {
          // ignore
        }

        if (!resultUrls.length) {
          await refundCreditsIfNeeded()
          return NextResponse.json(
            { error: "Task succeeded but no image URL was returned", taskId },
            { status: 502 },
          )
        }

        const creditsRemaining =
          isSupabaseConfigured() && deducted && creditsBefore !== null ? creditsBefore - creditsCost : null
        return NextResponse.json({ taskId, resultUrls, creditsRemaining })
      }
    }

    await refundCreditsIfNeeded()
    return NextResponse.json(
      { error: "Generation timed out, please try again", taskId },
      { status: 504 },
    )
  } catch (err) {
    await refundCreditsIfNeeded()
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
