"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"

interface SubmissionFormProps {
  onSuccess: (url: string) => void
  onStepChange: (step: number) => void
}

const ENDPOINT =
  process.env.NEXT_PUBLIC_PREVIEW_ENDPOINT ||
  "https://vns647rbgryezj5j4apaln2dmy0dexzg.lambda-url.af-south-1.on.aws/"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Real CI/CD demo. Submitting an image triggers a GitHub Actions build that
 * deploys a full copy of the site (with the visitor's hero) to its own bucket.
 * We poll a status file the workflow updates, so the stages shown are real.
 */
export default function SubmissionForm({ onSuccess, onStepChange }: SubmissionFormProps) {
  const [pictureUrl, setPictureUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const cancelled = useRef(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!pictureUrl.trim()) return setError("Image URL is required")
    if (!/^https?:\/\/.+/.test(pictureUrl))
      return setError("Enter a valid URL starting with http:// or https://")

    setIsSubmitting(true)
    cancelled.current = false
    onStepChange(1)

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: pictureUrl.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Couldn't start the build.")

      // Poll the status file the workflow updates (up to ~7 minutes).
      const statusUrl = data.statusUrl as string
      const fallbackUrl = data.previewUrl as string
      const deadline = Date.now() + 7 * 60 * 1000

      while (!cancelled.current && Date.now() < deadline) {
        await delay(4000)
        let st: any = null
        try {
          const r = await fetch(`${statusUrl}?t=${Date.now()}`, { cache: "no-store" })
          if (r.ok) st = await r.json()
        } catch {
          /* keep polling */
        }
        if (!st) continue

        if (typeof st.step === "number" && st.step > 0) onStepChange(st.step)

        if (st.status === "live") {
          onStepChange(5)
          await delay(300)
          onSuccess(st.url || fallbackUrl)
          return
        }
        if (st.status === "failed" || st.step === -1) {
          throw new Error(st.message || "The build failed. Please try again.")
        }
      }
      throw new Error("Build is taking longer than expected — please try again.")
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
          A public image URL — we'll build a full copy of this site with it as the hero,
          on its own live URL. Takes ~2–3 minutes (a real build!).
        </p>
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
            BUILDING…
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
