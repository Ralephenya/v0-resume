"use client"

import { Check } from "lucide-react"

interface ProgressTrackerProps {
  step: number
}

const STAGES = [
  "Validating image",
  "Generating preview page",
  "Publishing to S3",
  "Serving via CloudFront",
  "Preview is live",
]

export default function ProgressTracker({ step }: ProgressTrackerProps) {
  return (
    <div className="mx-auto max-w-md space-y-3 text-left">
      {STAGES.map((label, index) => {
        const done = index < step
        const active = index === step - 1
        return (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold transition-all duration-300 ${
                done
                  ? "bg-green-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                  : active
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-gray-800 text-gray-500"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span
              className={`text-sm transition-colors ${
                done ? "text-green-300" : active ? "text-white" : "text-gray-500"
              }`}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
