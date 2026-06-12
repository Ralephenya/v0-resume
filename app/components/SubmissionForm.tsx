"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"

interface SubmissionFormProps {
  onSuccess: (url: string) => void
  onStepChange: (step: number) => void
}

/**
 * Interactive walkthrough of Steve's real CI/CD pipeline. A visitor drops in an
 * image URL and watches the deployment stages play out — mirroring the actual
 * GitHub → CodeBuild → S3 → CloudFront flow behind this site. The preview link
 * is generated client-side so the demo costs nothing to run.
 */
export default function SubmissionForm({ onSuccess, onStepChange }: SubmissionFormProps) {
  const [pictureUrl, setPictureUrl] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const runPipeline = async () => {
    const stages = [
      { step: 1, delay: 700 },
      { step: 2, delay: 1100 },
      { step: 3, delay: 1500 },
      { step: 4, delay: 1500 },
      { step: 5, delay: 900 },
    ]
    for (const { step, delay } of stages) {
      onStepChange(step)
      await new Promise((r) => setTimeout(r, delay))
    }
    const slug = Math.random().toString(36).slice(2, 8)
    onSuccess(
      `https://preview-${slug}.cloudwithsteve.online/?img=${encodeURIComponent(pictureUrl)}`,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!pictureUrl.trim()) return setError("Picture URL is required")
    if (!/^https?:\/\/.+/.test(pictureUrl))
      return setError("Enter a valid URL starting with http:// or https://")
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Enter a valid email address")

    setIsSubmitting(true)
    try {
      await runPipeline()
    } catch {
      setError("Deployment failed. Please try again.")
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
          placeholder="https://example.com/image.jpg"
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
          disabled={isSubmitting}
          className="border-gray-700 bg-gray-800 py-3 text-white placeholder-gray-500 focus:border-red-500 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500">
          Used to build a preview page so you can watch the deploy produce a live URL.
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
        <p className="text-xs text-gray-500">Get notified when the preview is ready.</p>
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
