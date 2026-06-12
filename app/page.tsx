"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Github,
  Linkedin,
  Mail,
  Youtube,
  ExternalLink,
  Download,
  MapPin,
  Quote,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Award,
  PlayCircle,
  ArrowRight,
  Rocket,
  GitBranch,
} from "lucide-react"

import LightsOut from "./components/LightsOut"
import TelemetryGauges from "./components/TelemetryGauges"
import RaceTimeline from "./components/RaceTimeline"
import PitCrewChat from "./components/PitCrewChat"
import SubmissionForm from "./components/SubmissionForm"
import ProgressTracker from "./components/ProgressTracker"
import {
  profile,
  socials,
  projects,
  projectFilters,
  skillCategories,
  certifications,
  demoVideos,
  testimonials,
} from "./data/portfolio"

const NAV = [
  { id: "stats", label: "Telemetry" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "pipeline", label: "Pipeline" },
  { id: "certs", label: "Trophies" },
  { id: "videos", label: "Demos" },
  { id: "contact", label: "Contact" },
]

export default function Portfolio() {
  const backgroundImage =
    process.env.NEXT_PUBLIC_BACKGROUND_IMAGE || "/landing-page-image.jpg"

  const [scrollY, setScrollY] = useState(0)
  const [typed, setTyped] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [currentT, setCurrentT] = useState(0)
  const [pipelineStep, setPipelineStep] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fullText = profile.tagline

  // Typewriter tagline
  useEffect(() => {
    if (typed.length < fullText.length) {
      const t = setTimeout(() => setTyped(fullText.slice(0, typed.length + 1)), 35)
      return () => clearTimeout(t)
    }
  }, [typed, fullText])

  // Parallax + nav RPM
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("animate-in")),
      { threshold: 0.12 },
    )
    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Testimonial rotation
  useEffect(() => {
    const i = setInterval(() => setCurrentT((p) => (p + 1) % testimonials.length), 6000)
    return () => clearInterval(i)
  }, [])

  // "rr" easter egg — rev the engine
  useEffect(() => {
    let seq = ""
    const onKey = (e: KeyboardEvent) => {
      seq = (seq + e.key.toLowerCase()).slice(-6)
      if (seq.includes("rr")) {
        document.body.classList.add("rev-animation")
        setTimeout(() => document.body.classList.remove("rev-animation"), 2000)
        seq = ""
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const featuredCerts = certifications.filter((c) => c.tier === "gold" || c.tier === "silver")
  const anthropicCerts = certifications.filter((c) => c.tier === "anthropic")

  return (
    <div className="min-h-screen bg-black text-white">
      <PitCrewChat />

      {/* ===== NAV ===== */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-gray-800/80 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="#hero" className="font-display text-lg font-black tracking-tight">
            <span className="text-white">SR</span>
            <span className="text-red-500">.</span>
          </a>
          <div className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="text-sm text-gray-400 transition-colors hover:text-red-400"
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-gray-500 sm:inline">
              RPM <span className="text-red-500">{Math.min(Math.floor(scrollY / 8), 14000).toLocaleString()}</span>
            </span>
            <a href="#contact">
              <Button
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              >
                Hire Me
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section
        id="hero"
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div className="particles-bg" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.45)), url('${backgroundImage}')`,
            transform: `translateY(${scrollY * 0.25}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-red-950/50" />
        <div className="carbon-fiber absolute inset-0 opacity-[0.06]" />

        <div className="relative z-20 mx-auto max-w-5xl px-6 pt-28 text-center">
          <div className="mb-6 flex justify-center">
            <LightsOut />
          </div>

          <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-red-500">
            {profile.location}
          </p>
          <h1 className="mb-4 font-display text-5xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            <span className="block hero-gradient-text">{profile.firstName.toUpperCase()}</span>
            <span className="block hero-red-text">RALEPHENYA</span>
          </h1>
          <p className="mx-auto mb-6 max-w-3xl font-display text-base font-bold uppercase tracking-wide text-gray-200 md:text-xl">
            {profile.title}
          </p>
          <p className="mx-auto mb-10 min-h-[3.5rem] max-w-2xl text-base text-gray-300 md:text-lg">
            {typed}
            <span className="animate-pulse text-red-500">|</span>
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#projects">
              <Button
                size="lg"
                className="hero-button-primary px-8 py-6 text-lg text-white"
              >
                View My Work <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href={profile.resume} download>
              <Button
                size="lg"
                variant="outline"
                className="hero-button-secondary px-8 py-6 text-lg text-blue-300"
              >
                <Download className="mr-2 h-5 w-5" /> Download CV
              </Button>
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-5">
            <SocialIcon href={socials.github} label="GitHub"><Github className="h-5 w-5" /></SocialIcon>
            <SocialIcon href={socials.linkedin} label="LinkedIn"><Linkedin className="h-5 w-5" /></SocialIcon>
            <SocialIcon href={socials.youtube} label="YouTube"><Youtube className="h-5 w-5" /></SocialIcon>
            <SocialIcon href={socials.email} label="Email"><Mail className="h-5 w-5" /></SocialIcon>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
          <span className="font-mono text-xs uppercase tracking-widest">Scroll to launch</span>
        </div>
      </section>

      {/* ===== TELEMETRY (GitHub stats) ===== */}
      <Section id="stats" title="Live Telemetry" subtitle="Real GitHub activity, on the dials">
        <TelemetryGauges />
      </Section>

      {/* ===== ABOUT ===== */}
      <Section id="about" title="The Driver" subtitle="Who's behind the visor" bg="muted">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="relative mx-auto max-w-xs">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-red-600/40 to-blue-600/40 blur-lg" />
            <img
              src="/steve.JPG"
              alt={profile.name}
              className="relative w-full rounded-2xl border border-gray-800 object-cover"
            />
          </div>
          <div>
            <p className="text-lg leading-relaxed text-gray-300">{profile.about}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat value="4+" label="Years" />
              <Stat value="7" label="Certs" />
              <Stat value="4" label="Companies" />
              <Stat value="DVA-C02" label="AWS" />
            </div>
          </div>
        </div>
      </Section>

      {/* ===== SKILLS ===== */}
      <Section id="skills" title="Pit-Wall Skills" subtitle="Telemetry across the stack">
        <div className="space-y-10">
          {Object.entries(skillCategories).map(([cat, skills]) => (
            <div key={cat}>
              <h3 className="mb-5 font-display text-xl font-bold text-red-500">{cat}</h3>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => {
                  const Icon = skill.icon
                  return (
                    <div
                      key={skill.name}
                      className="skill-card space-y-3 rounded-lg border border-gray-800 bg-black/50 p-4 transition-all hover:border-red-500/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2.5 font-semibold text-white">
                          <Icon className="h-5 w-5 text-blue-400" />
                          {skill.name}
                        </span>
                        <span className="font-mono text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="rev-gauge">
                        <div className="rev-fill" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== PROJECTS ===== */}
      <Section id="projects" title="The Grid" subtitle="Selected work, sanitized for the public" bg="muted">
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {projectFilters.map((f) => (
            <Badge
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                activeFilter === f
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-600 bg-transparent text-gray-300 hover:border-red-500 hover:text-red-400"
              }`}
            >
              {f}
            </Badge>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card
              key={p.name}
              className="project-card group border-gray-800 bg-gradient-to-br from-gray-900 to-black transition-all hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]"
            >
              <CardContent className="p-6">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
                  {p.url !== "#" ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5 text-gray-500 transition-colors group-hover:text-blue-400" />
                    </a>
                  ) : (
                    <Badge className="border-gray-700 bg-gray-800 text-[10px] text-gray-400">
                      {p.category}
                    </Badge>
                  )}
                </div>
                <p className="mb-4 text-sm text-gray-400">{p.blurb}</p>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-gray-700 bg-gray-800/60 px-2 py-0.5 text-xs text-gray-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== JOURNEY (race lap) ===== */}
      <Section id="journey" title="The Lap" subtitle="Four corners, one career line">
        <RaceTimeline />
      </Section>

      {/* ===== CI/CD PIPELINE DEMO ===== */}
      <Section
        id="pipeline"
        title="Pit Lane"
        subtitle="Watch my CI/CD pipeline run — the same flow that deploys this site"
      >
        <div className="mx-auto mb-10 max-w-3xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <GitBranch className="h-7 w-7 text-blue-400" />
            <p className="text-center text-gray-400">
              Drop in an image URL and watch it move through{" "}
              <span className="text-white">GitHub → CodeBuild → S3 → CloudFront</span> — a
              live walkthrough of how I ship to AWS.
            </p>
            <Rocket className="h-7 w-7 text-red-500" />
          </div>

          <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black">
            <CardContent className="p-6 md:p-8">
              <SubmissionForm
                onSuccess={(url) => setPreviewUrl(url)}
                onStepChange={(s) => {
                  setPipelineStep(s)
                  if (s === 1) setPreviewUrl(null)
                }}
              />

              {pipelineStep > 0 && (
                <div className="mt-8 border-t border-gray-800 pt-8">
                  <ProgressTracker step={pipelineStep} />
                </div>
              )}

              {previewUrl && (
                <div className="mt-8 rounded-lg border-2 border-green-500/70 bg-green-500/10 p-6 text-center">
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                    <h3 className="font-display text-xl font-bold text-green-400">
                      Deployment Successful
                    </h3>
                  </div>
                  <p className="mb-4 text-sm text-gray-300">
                    Your ephemeral preview environment is live (demo link):
                  </p>
                  <code className="inline-block break-all rounded bg-black/60 px-4 py-2 font-mono text-sm text-green-300">
                    {previewUrl}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ===== CERTIFICATIONS (trophy wall) ===== */}
      <Section id="certs" title="Trophy Wall" subtitle="Silverware on the shelf" bg="muted">
        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          {featuredCerts.map((c) => (
            <div
              key={c.name}
              className="trophy-card flex items-center gap-4 rounded-xl border border-yellow-600/30 bg-gradient-to-br from-yellow-950/30 to-black p-5"
            >
              <Trophy className="h-10 w-10 shrink-0 text-yellow-500" />
              <div>
                <div className="font-display font-bold text-white">{c.name}</div>
                <div className="text-sm text-gray-400">
                  {c.issuer} · {c.date}
                  {"code" in c && (c as any).code ? ` · ${(c as any).code}` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
        <h3 className="mb-4 text-center font-mono text-sm uppercase tracking-widest text-red-500">
          6× Anthropic Certifications
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {anthropicCerts.map((c) => (
            <div
              key={c.name}
              className="trophy-card flex items-center gap-3 rounded-lg border border-gray-800 bg-black/50 p-4 transition-all hover:border-red-500/50"
            >
              <Award className="h-7 w-7 shrink-0 text-red-400" />
              <div>
                <div className="font-semibold text-white">{c.name}</div>
                <div className="text-xs text-gray-500">{c.issuer} · {c.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== DEMO VIDEOS ===== */}
      <Section id="videos" title="Onboard Camera" subtitle="AI & MCP demos, straight from the cockpit">
        <div className="grid gap-6 md:grid-cols-3">
          {demoVideos.map((v, i) => (
            <Card key={i} className="overflow-hidden border-gray-800 bg-gray-900">
              <div className="relative aspect-video w-full bg-black">
                {v.id ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500 transition-colors hover:text-red-400"
                  >
                    <PlayCircle className="h-12 w-12" />
                    <span className="font-mono text-xs uppercase tracking-widest">Recording soon</span>
                  </a>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-display font-bold text-white">{v.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{v.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href={socials.youtube} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              <Youtube className="mr-2 h-5 w-5" /> Visit @neutral3731
            </Button>
          </a>
        </div>
      </Section>

      {/* ===== TESTIMONIALS ===== */}
      <Section id="testimonials" title="Race Engineers" subtitle="What the crew says" bg="muted">
        <div className="mx-auto max-w-3xl">
          <Card className="border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 testimonial-card">
            <CardContent className="p-8 text-center">
              <Quote className="mx-auto mb-6 h-10 w-10 text-red-500" />
              <blockquote className="mb-6 text-lg text-gray-200 md:text-xl">
                "{testimonials[currentT].quote}"
              </blockquote>
              <div className="font-semibold text-white">{testimonials[currentT].name}</div>
              <div className="text-sm text-gray-400">{testimonials[currentT].role}</div>
            </CardContent>
          </Card>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="border-gray-600 bg-transparent text-gray-300 hover:border-red-500 hover:text-red-400"
              onClick={() => setCurrentT((p) => (p - 1 + testimonials.length) % testimonials.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-gray-600 bg-transparent text-gray-300 hover:border-blue-500 hover:text-blue-400"
              onClick={() => setCurrentT((p) => (p + 1) % testimonials.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>

      {/* ===== CONTACT ===== */}
      <ContactSection />

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-800 bg-black px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <SocialIcon href={socials.github} label="GitHub"><Github className="h-5 w-5" /></SocialIcon>
            <SocialIcon href={socials.linkedin} label="LinkedIn"><Linkedin className="h-5 w-5" /></SocialIcon>
            <SocialIcon href={socials.youtube} label="YouTube"><Youtube className="h-5 w-5" /></SocialIcon>
            <SocialIcon href={socials.email} label="Email"><Mail className="h-5 w-5" /></SocialIcon>
            <a href={profile.resume} download className="ml-2">
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:border-red-500 hover:text-red-400">
                <Download className="mr-2 h-4 w-4" /> CV
              </Button>
            </a>
          </div>
          <p className="text-center font-mono text-sm text-gray-500">
            © {new Date().getFullYear()} {profile.name} — Engineered with precision &amp; speed
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ---------- small presentational helpers ---------- */

function Section({
  id,
  title,
  subtitle,
  children,
  bg,
}: {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
  bg?: "muted"
}) {
  return (
    <section
      id={id}
      data-reveal
      className={`px-6 py-20 ${bg === "muted" ? "bg-gray-950" : "bg-black"}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-black text-white md:text-5xl">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-400">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all hover:scale-110 hover:border-red-500 hover:text-red-400"
    >
      {children}
    </a>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-black/50 p-4 text-center">
      <div className="font-display text-2xl font-bold text-red-500">{value}</div>
      <div className="text-xs uppercase tracking-wider text-gray-400">{label}</div>
    </div>
  )
}

function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      // FormSubmit — free form-to-email, delivers to profile.email. No API key.
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `🏁 Portfolio enquiry from ${name || "a visitor"}`,
          _template: "table",
        }),
      })
      if (!res.ok) throw new Error("send failed")
      setStatus("sent")
      setName("")
      setEmail("")
      setMessage("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" data-reveal className="bg-black px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-black text-white md:text-5xl">Lights Out</h2>
          <p className="mt-3 text-gray-400">
            Open for {profile.availableFor}. Let's talk.
          </p>
        </div>
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black contact-card">
          <CardContent className="p-8">
            <form onSubmit={send} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-red-500"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <Textarea
                required
                rows={5}
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-red-500"
              />
              <Button
                type="submit"
                disabled={status === "sending"}
                className="engine-start-button w-full bg-red-600 py-6 text-lg text-white hover:bg-red-700 neon-glow-red disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : status === "sent" ? "Message Sent ✓" : "Send Message"}
              </Button>
              {status === "sent" && (
                <p className="text-center text-sm text-green-400">
                  🏁 Got it — your message is on its way. I'll be in touch soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-center text-sm text-red-400">
                  Something went wrong. Email me directly at{" "}
                  <a href={socials.email} className="underline">{profile.email}</a>.
                </p>
              )}
            </form>
            <p className="mt-5 text-center text-sm text-gray-500">
              Or email directly:{" "}
              <a href={socials.email} className="text-red-400 hover:underline">
                {profile.email}
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
