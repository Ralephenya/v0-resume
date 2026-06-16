"use client"

import { useEffect, useRef, useState } from "react"
import { MessageSquare, X, Send, Sparkles } from "lucide-react"
import {
  profile,
  experience,
  skillCategories,
  certifications,
  projects,
} from "../data/portfolio"

type Msg = { role: "user" | "bot"; text: string }

// Optional: set NEXT_PUBLIC_CHAT_ENDPOINT to a Claude-backed Lambda/API for real AI.
const ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT

const SUGGESTIONS = [
  "What's Steve's current role?",
  "Does he know Blazor?",
  "Tell me about his AI work",
  "Is he available for hire?",
  "What are his certifications?",
]

export default function PitCrewChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: `🏁 Pit Crew here. Ask me anything about ${profile.firstName}'s experience, stack, projects or availability.`,
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open, thinking])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q) return
    setMessages((m) => [...m, { role: "user", text: q }])
    setInput("")
    setThinking(true)

    try {
      let answer: string
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q }),
        })
        const data = await res.json()
        answer = data.reply || data.message || localAnswer(q)
      } else {
        await new Promise((r) => setTimeout(r, 450)) // tiny "thinking" beat
        answer = localAnswer(q)
      }
      setMessages((m) => [...m, { role: "bot", text: answer }])
    } catch {
      setMessages((m) => [...m, { role: "bot", text: localAnswer(q) }])
    } finally {
      setThinking(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Pit Crew AI chat"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-transform hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-800 bg-black/95 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-2 border-b border-gray-800 bg-gradient-to-r from-red-900/40 to-blue-900/30 px-4 py-3">
            <Sparkles className="h-5 w-5 text-red-400" />
            <div>
              <div className="font-display text-sm font-bold text-white">Pit Crew AI</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                {ENDPOINT ? "Powered by Ollama" : "Ask about Steve"}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gray-800 px-3 py-2 text-sm text-gray-400">
                  <span className="inline-flex gap-1">
                    <Dot /> <Dot /> <Dot />
                  </span>
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300 transition-colors hover:border-red-500 hover:text-red-400"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-gray-800 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Steve…"
              className="flex-1 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function Dot() {
  return <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-500" />
}

/**
 * Local knowledge engine — answers from the portfolio data so the chat works
 * with zero backend. Replaced by real Claude responses when NEXT_PUBLIC_CHAT_ENDPOINT is set.
 */
function localAnswer(qRaw: string): string {
  const q = qRaw.toLowerCase()
  const current = experience.find((e) => e.current)

  const has = (...kw: string[]) => kw.some((k) => q.includes(k))

  if (has("available", "hire", "open for work", "looking", "job")) {
    return `Yes — ${profile.firstName} is currently open for work (${profile.availableFor}). Reach him at ${profile.email} or hit the "Hire Me" button up top. 🟢`
  }
  if (has("current", "now", "doing now", "right now", "present role", "where does he work")) {
    return `Right now he's ${current?.title} at ${current?.company} (${current?.span}) — ${current?.summary}`
  }
  if (has("certif", "aws", "anthropic", "claude cert", "dva")) {
    return (
      "Certifications:\n" +
      certifications.map((c) => `• ${c.name}${"code" in c && (c as any).code ? ` (${(c as any).code})` : ""} — ${c.issuer}, ${c.date}`).join("\n")
    )
  }
  if (has("ai", "claude", "mcp", "agent", "llm")) {
    return `AI is a big focus. He holds 6 Anthropic certifications (Claude, Claude Code, Agent Skills, Subagents, Cowork) and builds with the Claude API, MCP servers and agents/subagents. He also architected his team's internal AI adoption roadmap.`
  }
  if (has("blazor")) {
    return `Yes — Blazor (both WebAssembly and Server) is core to his stack. At Mphoti Consulting he's leading a Blazor WASM migration of a legacy conveyancing platform, with Ocelot and .NET Aspire.`
  }
  if (has("aspire", "ocelot", "gateway", "microservice", "architecture")) {
    return `He works with .NET Aspire orchestration, Ocelot / YARP API gateways, microservices and Clean Architecture / DDD — currently applied on the conveyancing platform migration at Mphoti Consulting.`
  }
  if (has(".net", "c#", "asp", "backend")) {
    return `${profile.firstName} is a Full Stack .NET Developer with 4+ years in C# / ASP.NET Core, Blazor, Web API, Entity Framework / Dapper and SQL Server.`
  }
  if (has("angular", "frontend", "react", "typescript", "front end", "front-end")) {
    return `On the front end he's strongest in Angular (led Angular work at Bsure and Warp), with TypeScript, plus React / React Native and Blazor for UI.`
  }
  if (has("experience", "background", "history", "worked", "career")) {
    return (
      "Career so far:\n" +
      experience.map((e) => `• ${e.span} — ${e.title}, ${e.company}`).join("\n")
    )
  }
  if (has("project", "built", "portfolio")) {
    return (
      "Headline projects:\n" +
      projects.filter((p) => p.featured).map((p) => `• ${p.name} — ${p.blurb}`).join("\n")
    )
  }
  if (has("skill", "stack", "tech", "know")) {
    return (
      "Core stack: " +
      Object.values(skillCategories)
        .flat()
        .slice(0, 10)
        .map((s) => s.name)
        .join(", ") +
      " — and more."
    )
  }
  if (has("contact", "email", "reach", "linkedin", "github", "youtube")) {
    return `Email: ${profile.email}\nLinkedIn & GitHub links are in the header and footer, and demos are on YouTube (@neutral3731).`
  }
  if (has("aws", "cloud", "devops")) {
    return `AWS Certified Developer – Associate (DVA-C02). He works with S3, CloudFront, Lambda, Docker and CI/CD pipelines.`
  }
  if (has("hello", "hi", "hey", "yo")) {
    return `Hey! 👋 Ask me about ${profile.firstName}'s stack, experience, AI work, certifications or whether he's available.`
  }

  return `Good question — ${profile.firstName} is a Full Stack .NET Developer (C#, ASP.NET, Blazor, Angular) and AWS-certified with deep AI-integration experience. Try asking about his current role, his AI/Claude work, Blazor, certifications, or availability.`
}
