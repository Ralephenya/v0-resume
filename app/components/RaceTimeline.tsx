"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { experience } from "../data/portfolio"

/**
 * Career as a race lap. A winding SVG circuit runs down the page; each job is a
 * numbered corner. A glowing rider-dot drives along the racing line as you
 * scroll the section into view.
 */
export default function RaceTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [progress, setProgress] = useState(0) // 0..1 along the track
  const [point, setPoint] = useState({ x: 60, y: 0 })
  const [len, setLen] = useState(0)

  // Corners from oldest -> newest so the lap reads bottom-to-top chronologically.
  const corners = [...experience].reverse()

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength())
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when section top hits 80% of viewport, 1 when bottom reaches 20%
      const total = rect.height + vh * 0.6
      const seen = vh * 0.8 - rect.top
      const p = Math.max(0, Math.min(1, seen / total))
      setProgress(p)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  useEffect(() => {
    if (pathRef.current && len) {
      const pt = pathRef.current.getPointAtLength(progress * len)
      setPoint({ x: pt.x, y: pt.y })
    }
  }, [progress, len])

  const rows = corners.length
  const rowH = 200
  const height = rows * rowH
  // Build a gentle S-curve track through evenly spaced corner nodes.
  const nodes = corners.map((_, i) => ({
    x: i % 2 === 0 ? 60 : 120,
    y: i * rowH + 80,
  }))
  const path =
    `M 60 0 ` +
    nodes
      .map((n, i) => {
        const prev = i === 0 ? { x: 60, y: 0 } : nodes[i - 1]
        const midY = (prev.y + n.y) / 2
        return `C ${prev.x} ${midY}, ${n.x} ${midY}, ${n.x} ${n.y}`
      })
      .join(" ") +
    ` C ${nodes[nodes.length - 1].x} ${height - 40}, 90 ${height - 20}, 90 ${height}`

  return (
    <div ref={sectionRef} className="relative">
      <div className="flex">
        {/* Track rail */}
        <div className="relative w-[180px] shrink-0">
          <svg
            viewBox={`0 0 180 ${height}`}
            width="180"
            height={height}
            className="overflow-visible"
            preserveAspectRatio="none"
          >
            {/* kerb / track base */}
            <path
              d={path}
              fill="none"
              stroke="#1f2937"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* centre racing line dashes */}
            <path
              d={path}
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              strokeDasharray="6 10"
            />
            {/* driven portion */}
            <path
              ref={pathRef}
              d={path}
              fill="none"
              stroke="url(#trackGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={len - progress * len}
              style={{ filter: "drop-shadow(0 0 6px rgba(229,9,20,0.6))" }}
            />
            <defs>
              <linearGradient id="trackGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#e50914" />
              </linearGradient>
            </defs>

            {/* corner nodes */}
            {nodes.map((n, i) => (
              <g key={i}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="14"
                  fill="#0a0a0a"
                  stroke={corners[i].current ? "#22c55e" : "#e50914"}
                  strokeWidth="3"
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  className="fill-white font-mono"
                  fontSize="13"
                  fontWeight="700"
                >
                  {i + 1}
                </text>
              </g>
            ))}

            {/* rider */}
            <g
              style={{
                transform: `translate(${point.x}px, ${point.y}px)`,
                transition: "transform 0.1s linear",
              }}
            >
              <circle r="9" fill="#fff" />
              <circle r="9" fill="none" stroke="#22c55e" strokeWidth="3">
                <animate
                  attributeName="r"
                  values="9;13;9"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>
        </div>

        {/* Corner cards */}
        <div className="flex-1 space-y-0">
          {corners.map((job, i) => (
            <div
              key={i}
              style={{ minHeight: rowH }}
              className="flex flex-col justify-center py-4"
            >
              <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-5 transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(229,9,20,0.15)]">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-red-500">
                      Corner {i + 1} · {job.span}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white">
                      {job.title}
                    </h3>
                  </div>
                  {job.current && (
                    <span className="rounded-full border border-green-400/50 bg-green-500/10 px-3 py-1 font-mono text-xs font-bold text-green-300">
                      ON TRACK
                    </span>
                  )}
                </div>
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-300">
                  <span className="font-semibold text-white">{job.company}</span>
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-gray-400">{job.location}</span>
                </div>
                <p className="mb-3 text-sm text-gray-400">{job.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {job.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-gray-700 bg-gray-800/60 px-2 py-0.5 text-xs text-gray-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
