import { NextResponse } from "next/server"

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
    if (!(imageValue instanceof Blob)) {
      return NextResponse.json({ error: "Missing image file" }, { status: 400 })
    }

    const imageFile =
      imageValue instanceof File
        ? imageValue
        : new File([imageValue], "upload.png", {
            type: imageValue.type || "application/octet-stream",
          })

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image is too large (max 10MB)." }, { status: 413 })
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
          return NextResponse.json(
            { error: "Task succeeded but no image URL was returned", taskId },
            { status: 502 },
          )
        }

        return NextResponse.json({ taskId, resultUrls })
      }
    }

    return NextResponse.json(
      { error: "Generation timed out, please try again", taskId },
      { status: 504 },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
