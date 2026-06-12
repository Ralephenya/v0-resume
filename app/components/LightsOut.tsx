"use client"

import { useEffect, useState } from "react"
import { profile } from "../data/portfolio"

/**
 * F1 "lights out" start gantry. Five red lights illuminate in sequence,
 * then all go out and the board flips to GREEN = available for work.
 * Replays on demand (click) for the easter-egg crowd.
 */
export default function LightsOut() {
  // lit = how many of the 5 red lights are on (0..5); -1 = lights out / GO
  const [lit, setLit] = useState(0)
  const [go, setGo] = useState(false)

  const runSequence = () => {
    setGo(false)
    setLit(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= 5; i++) {
      timers.push(setTimeout(() => setLit(i), i * 450))
    }
    // hold all five, then lights out -> GO
    timers.push(
      setTimeout(() => {
        setLit(-1)
        setGo(true)
      }, 5 * 450 + 700),
    )
    return timers
  }

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setLit(-1)
      setGo(true)
      return
    }
    const timers = runSequence()
    return () => timers.forEach(clearTimeout)
  }, [])

  const available = profile.available

  return (
    <div className="inline-flex flex-col items-center gap-4">
      {/* Light gantry */}
      <button
        onClick={() => runSequence()}
        aria-label="Replay start lights"
        className="group flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-sm transition-transform hover:scale-[1.02]"
      >
        {[1, 2, 3, 4, 5].map((i) => {
          const on = lit === -1 ? false : i <= lit
          return (
            <span key={i} className="flex flex-col gap-1.5">
              <Dot on={on} />
              <Dot on={on} />
            </span>
          )
        })}
      </button>

      {/* Status board */}
      <div
        className={`pit-board flex items-center gap-3 rounded-full px-5 py-2.5 font-mono text-sm font-bold uppercase tracking-wider transition-all duration-500 ${
          available
            ? go
              ? "border border-green-400/60 bg-green-500/15 text-green-300 shadow-[0_0_25px_rgba(34,197,94,0.45)]"
              : "border border-white/10 bg-black/60 text-gray-400"
            : "border border-red-500/40 bg-red-500/10 text-red-300"
        }`}
      >
        <span
          className={`relative flex h-3 w-3 ${available && go ? "" : "opacity-60"}`}
        >
          {available && go && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex h-3 w-3 rounded-full ${
              available ? "bg-green-400" : "bg-red-500"
            }`}
          />
        </span>
        {available
          ? go
            ? "Lights out — open for work"
            : "Standing by…"
          : "Not currently available"}
      </div>
    </div>
  )
}

function Dot({ on }: { on: boolean }) {
  return (
    <span
      className={`h-5 w-5 rounded-full border transition-all duration-200 ${
        on
          ? "border-red-400 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]"
          : "border-white/10 bg-neutral-800"
      }`}
    />
  )
}
