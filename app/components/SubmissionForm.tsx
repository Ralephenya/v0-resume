"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"

interface SubmissionFormProps {
  onSuccess: (url: string) => void
  onStepChange: (step: number) => void
}

// Real preview-deployer Lambda (Function URL). Override via env if it ever moves.
const ENDPOINT =
  process.env.NEXT_PUBLIC_PREVIEW_ENDPOINT ||
  "https://vns647rbgryezj5j4apaln2dmy0dexzg.lambda-url.af-south-1.on.aws/"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Real CI/CD demo. The visitor submits an image URL; we POST it to a Lambda that
 * publishes a live preview page to S3 (served via CloudFront) and returns the URL.
 * The stage feedback interleaves with the actual network call so it reflects real work.
 */
export default function SubmissionForm({ onSuccess, onStepChange }: SubmissionFormProps) {
  const [pictureUrl, setPictureUrl] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!pictureUrl.trim()) return setError("Image URL is required")
    if (!/^https?:\/\/.+/.test(pictureUrl))
      return setError("Enter a valid URL starting with http:// or https://")
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Enter a valid email address")

    setIsSubmitting(true)
    onStepChange(1) // Validating image

    // Fire the real deploy while the early stages animate.
    const deploy = fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: pictureUrl.trim(), email: email.trim() }),
    })

    try {
      await delay(700)
      onStepChange(2) // Generating preview page
      await delay(700)
      onStepChange(3) // Publishing to S3

      const res = await deploy
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Deployment failed")

      onStepChange(4) // CloudFront serving
      await delay(600)
      onStepChange(5) // Live
      await delay(300)
      onSuccess(data.url)
    } catch (err: any) {
      setError(err?.message || "Deployment failed. Please try again.")
      onStepChange(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      <div className="space-y-2 text-left">
        <label className="block text-sm text-gray-400">
          Image URL <span className="text-red-500">*</span>
        </label>
        <Input
          type="url"
          placeholder="https://example.com/your-image.jpg"
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
          disabled={isSubmitting}
          className="border-gray-700 bg-gray-800 py-3 text-white placeholder-gray-500 focus:border-red-500 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500">
          A public image URL — it becomes the hero of your own live preview page.
        </p>
      </div>

      <div className="space-y-2 text-left">
        <label className="block text-sm text-gray-400">Email (optional)</label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="border-gray-700 bg-gray-800 py-3 text-white placeholder-gray-500 focus:border-blue-500 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500">So I know who took the pipeline for a spin.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/60 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="group w-full bg-gradient-to-r from-red-600 to-red-700 py-5 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:from-red-700 hover:to-red-800 disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            DEPLOYING…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 group-hover:animate-pulse" /> REV THE PIPELINE
          </span>
        )}
      </Button>
    </form>
  )
}
