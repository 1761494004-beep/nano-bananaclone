"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Upload, Sparkles } from "lucide-react"

export function EditorSection() {
  const [prompt, setPrompt] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrls, setResultUrls] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image is too large (max 10MB).")
        e.target.value = ""
        return
      }
      setSelectedFile(file)
      setResultUrls([])
      setError(null)
    }
  }

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim()
    if (!selectedFile) {
      setError("Please add an image first.")
      return
    }
    if (!trimmedPrompt) {
      setError("Please enter a prompt.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setResultUrls([])

    try {
      const body = new FormData()
      body.append("prompt", trimmedPrompt)
      body.append("image", selectedFile)
      body.append("aspect_ratio", "3:2")
      body.append("quality", "medium")

      const res = await fetch("/api/generate", { method: "POST", body })
      const json = (await res.json()) as
        | { taskId: string; resultUrls: string[] }
        | { error: string }

      if (!res.ok) {
        setError("error" in json ? json.error : "Generation failed.")
        return
      }

      if (!("resultUrls" in json) || !Array.isArray(json.resultUrls) || !json.resultUrls.length) {
        setError("No image returned from API.")
        return
      }

      setResultUrls(json.resultUrls)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="editor" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get Started</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Try the AI Editor - Transform your image with AI-powered editing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🍌</span>
              Upload Image
            </h3>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="space-y-4">
                    <img src={previewUrl} alt="Preview" className="max-h-56 mx-auto rounded-lg" suppressHydrationWarning />
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGenerating}
                      >
                        Add Image
                      </Button>
                      <p className="text-xs text-muted-foreground">{selectedFile?.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Upload an image to edit</p>
                      <p className="text-xs text-muted-foreground">Max 10MB</p>
                    </div>
                    <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                      Add Image
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Main Prompt</label>
                <Textarea
                  placeholder="Describe how you want to transform your image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none"
                  disabled={isGenerating}
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                onClick={handleGenerate}
                disabled={!selectedFile || !prompt.trim() || isGenerating}
              >
                {isGenerating ? <Spinner className="mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isGenerating ? "Generating..." : "Generate Now"}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-8 bg-accent/50">
            <h3 className="text-2xl font-bold mb-6">Output Gallery</h3>
            <div className="aspect-square bg-background rounded-lg flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
              {isGenerating ? (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center gap-2">
                    <Spinner className="size-5" />
                    <p className="text-muted-foreground text-sm">Generating…</p>
                  </div>
                  <p className="text-muted-foreground text-xs mt-2">This can take up to ~2 minutes.</p>
                </div>
              ) : resultUrls[0] ? (
                <img src={resultUrls[0]} alt="Generated result" className="w-full h-full object-contain" suppressHydrationWarning />
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <p className="text-muted-foreground text-sm">Ready for instant generation</p>
                  <p className="text-muted-foreground text-xs mt-2">Add an image and prompt, then click Generate.</p>
                </div>
              )}
            </div>

            {resultUrls.length > 1 ? (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {resultUrls.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setResultUrls([url, ...resultUrls.filter((u) => u !== url)])}
                    className="rounded-md border border-border overflow-hidden hover:border-primary transition-colors"
                  >
                    <img src={url} alt="Result thumbnail" className="w-full h-20 object-cover" suppressHydrationWarning />
                  </button>
                ))}
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </section>
  )
}
