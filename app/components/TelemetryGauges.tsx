"use client"

import { useEffect, useRef, useState } from "react"
import { getGitHubStats } from "../../services/githubStats"
import { Activity, GitPullRequest, Flame, GitCommit } from "lucide-react"

// Sensible fallbacks so the dials never sit at zero if the Lambda is cold/down.
const FALLBACK = {
  commits: 1200,
  pullRequests: 80,
  streak: 90,
  contributions: 600,
}

type Stats = {
  commits: number
  pullRequests: number
  streak: number
  contributions: number
}

export default function TelemetryGauges() {
  const [stats, setStats] = useState<Stats>(FALLBACK)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    getGitHubStats()
      .then((s) => {
        if (cancelled) return
        setStats({
          commits: s.totalCommits || FALLBACK.commits,
          pullRequests: s.totalPullRequests || FALLBACK.pullRequests,
          streak: s.currentStreak || FALLBACK.streak,
          contributions: s.totalContributionDays || FALLBACK.contributions,
        })
        setLive(true)
      })
      .catch(() => {
        /* keep fallbacks; dials still sweep */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Gauge
        icon={GitCommit}
        label="Commits"
        value={stats.commits}
        max={2000}
        color="#e50914"
      />
      <Gauge
        icon={GitPullRequest}
        label="Pull Requests"
        value={stats.pullRequests}
        max={150}
        color="#3b82f6"
      />
      <Gauge
        icon={Flame}
        label="Day Streak"
        value={stats.streak}
        max={200}
        color="#f59e0b"
        suffix="d"
      />
      <Gauge
        icon={Activity}
        label="Active Days"
        value={stats.contributions}
        max={1000}
        color="#22c55e"
      />
      <p className="col-span-2 text-center text-xs text-gray-500 md:col-span-4">
        <span
          className={`mr-2 inline-block h-2 w-2 rounded-full ${
            live ? "bg-green-400" : "bg-yellow-500"
          }`}
        />
        {live ? "Live from GitHub" : "Approximate (live feed warming up)"}
      </p>
    </div>
  )
}

function Gauge({
  icon: Icon,
  label,
  value,
  max,
  color,
  suffix = "",
}: {
  icon: any
  label: string
  value: number
  max: number
  color: string
  suffix?: string
}) {
  const [display, setDisplay] = useState(0)
  const [sweep, setSweep] = useState(0) // 0..1 needle position
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const pct = Math.min(value / max, 1)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true
            animate()
          }
        })
      },
      { threshold: 0.3 },
    )
    obs.observe(node)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const animate = () => {
    const duration = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      setSweep(pct * eased)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  // Semi-circle gauge: -120deg (empty) to +120deg (full)
  const angle = -120 + sweep * 240
  const radius = 52
  const circumference = Math.PI * radius // half circle
  const dash = circumference * sweep

  return (
    <div
      ref={ref}
      className="flex flex-col items-center rounded-xl border border-gray-800 bg-black/60 p-4 transition-colors hover:border-gray-700"
    >
      <svg viewBox="0 0 140 90" className="w-full max-w-[160px]">
        {/* track */}
        <path
          d="M 18 80 A 52 52 0 0 1 122 80"
          fill="none"
          stroke="#1f2937"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* fill */}
        <path
          d="M 18 80 A 52 52 0 0 1 122 80"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
        {/* needle */}
        <line
          x1="70"
          y1="80"
          x2={70 + 44 * Math.cos((angle - 90) * (Math.PI / 180))}
          y2={80 + 44 * Math.sin((angle - 90) * (Math.PI / 180))}
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="70" cy="80" r="4" fill="#fff" />
      </svg>
      <div className="-mt-1 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="font-mono text-2xl font-bold text-white">
          {display.toLocaleString()}
          {suffix}
        </span>
      </div>
      <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
    </div>
  )
}
