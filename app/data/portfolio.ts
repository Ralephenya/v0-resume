// Single source of truth for all portfolio content.
// Keep this in sync with the CV (public/Steve-Ralephenya-CV.pdf).

import {
  Code,
  Globe,
  Server,
  Cloud,
  Database,
  Brain,
  Link as LinkIcon,
  MessageSquare,
  Wrench,
  Briefcase,
  Cpu,
} from "lucide-react"

export const profile = {
  name: "Steve Junior Ralephenya",
  firstName: "Steve",
  title: "Full Stack .NET Developer | AI Integration | AWS Certified",
  tagline:
    "I build enterprise-grade .NET systems and bring AI agents into the development lifecycle — precision and speed, lights out.",
  location: "Johannesburg, South Africa",
  email: "bikoralephenya@gmail.com",
  phone: "+27 81 672 1671",
  site: "https://cloudwithsteve.online",
  available: true,
  availableFor: "Full Stack .NET / AI Integration roles",
  resume: "/Steve-Ralephenya-CV.pdf",
  about:
    "Results-driven Full Stack Developer with 4+ years building enterprise-grade .NET solutions. I specialise in C#, ASP.NET, Blazor and Angular with hands-on AWS cloud experience (Certified Developer – Associate, DVA-C02). I'm passionate about AI integration — backed by 6 Anthropic certifications covering Claude, agents, subagents and MCP — and have a proven track record delivering across conveyancing, insurance, fintech and e-commerce.",
}

export const socials = {
  github: "https://github.com/Ralephenya",
  linkedin: "https://www.linkedin.com/in/steve-ralephenya-8ab052197/",
  youtube: "https://youtube.com/@neutral3731",
  email: "mailto:bikoralephenya@gmail.com",
}

// Experience — newest first. Each entry is a "corner" on the race-lap timeline.
export const experience = [
  {
    year: "2026",
    span: "Feb 2026 – Present",
    title: "Full Stack Developer",
    company: "Mphoti Consulting",
    location: "Johannesburg, South Africa",
    current: true,
    summary:
      "Modernising a legacy ASPX conveyancing platform while driving a parallel Blazor WebAssembly migration and the team's AI adoption roadmap.",
    highlights: [
      "Maintaining and extending a legacy ASPX conveyancing system (ASP.NET, SQL Server) alongside a parallel Blazor WebAssembly migration.",
      "Shaping architecture in sprint planning — component structure, routing strategy and API gateway configuration (Ocelot).",
      "Refactored SLA tracking and workflow logic with clean C# patterns, improving testability and reducing coupling across service layers.",
      "Contributed to .NET Aspire orchestration so the full multi-service stack runs locally with minimal setup.",
      "Built core features in a React Native (Expo) app during a company hackathon.",
      "Architected the internal AI adoption roadmap — evaluating LLMs (Claude) and AI-native IDEs (Windsurf) and running regular Tech Talks.",
    ],
    stack: ["Blazor WASM", ".NET Aspire", "Ocelot", "ASP.NET", "SQL Server", "Claude / MCP"],
  },
  {
    year: "2025",
    span: "Feb 2025 – Jan 2026",
    title: "Software Engineer",
    company: "Bsure Insurance Advisors",
    location: "Johannesburg, South Africa",
    current: false,
    summary:
      "Integrated third-party insurance systems and built a centralised WhatsApp messaging platform for advisor teams.",
    highlights: [
      "Integrated Discovery's insurance system via REST API — authentication, data mapping and error handling across third-party endpoints.",
      "Designed and built a Twilio WhatsApp integration with the Front platform (C#, Web API), centralising customer conversations into a shared team inbox with assignment and routing logic.",
      "Owned front-end architecture decisions on an internal Angular portal — component-based patterns and reusable service layers.",
      "Mentored junior developers through structured code reviews; managed SQL Server schemas, queries and stored procedures.",
    ],
    stack: ["C#", "Web API", "Angular", "Twilio", "SQL Server", "REST"],
  },
  {
    year: "2023",
    span: "Apr 2023 – Jan 2025",
    title: "Junior → Intermediate Full Stack Developer",
    company: "Warp Development",
    location: "Pretoria, South Africa",
    current: false,
    summary:
      "Grew from junior to lead contributor on OrderEazi — an order & inventory platform — owning integrations across ERP and courier services.",
    highlights: [
      "Contributed to front-end and back-end architecture on OrderEazi (C#, ASP.NET MVC, Angular, SQL Server) — component design, API contracts and database schema.",
      "Integrated ERP systems (Sage, Xero, Palladium) and courier services (ShipLogic, Skynet) via REST APIs with auth, payload mapping and retry logic.",
      "Built a generic Meta WhatsApp template engine for dynamic message composition from the backend.",
      "Stepped up as lead Angular developer when a key developer left — maintaining sprint delivery and onboarding a replacement.",
    ],
    stack: ["C#", "ASP.NET MVC", "Angular", "Meta WhatsApp", "ERP", "SQL Server"],
  },
  {
    year: "2022",
    span: "Feb 2022 – Mar 2023",
    title: "Junior Software Developer",
    company: "Livex Software",
    location: "Pretoria, South Africa",
    current: false,
    summary:
      "Delivered inventory, student-administration and billing systems on ASP.NET Core, from responsive UI to database optimisation.",
    highlights: [
      "Built inventory management, student administration and client billing systems (ASP.NET Core, MVC, SQL).",
      "Designed responsive UIs with HTML, CSS, JavaScript and Bootstrap.",
      "Integrated APIs and optimised databases (stored procedures) to improve usability and responsiveness.",
      "Resolved critical UAT bugs and liaised between clients and dev teams.",
    ],
    stack: ["ASP.NET Core", "MVC", "SQL", "JavaScript", "Bootstrap"],
  },
]

// Headline projects — sanitized for public. Edit blurbs / links freely.
export const projects = [
  {
    name: "TaxMate AI",
    category: "AI",
    blurb:
      "An AI-powered South African tax assistant that reads payslips, IRP5/IT3(a) certificates and SARS documents, then explains source codes, PAYE, deductions and credits in plain language — grounded in the Income Tax Act.",
    stack: ["Claude API", "MCP", "C#", "RAG", "SARS"],
    url: "#",
    featured: true,
  },
  {
    name: "Blazor WebAssembly Migration",
    category: "Web",
    blurb:
      "Leading the migration of a legacy ASPX conveyancing platform to Blazor WebAssembly — component architecture, Ocelot API gateway and .NET Aspire orchestration so the whole multi-service stack spins up locally.",
    stack: ["Blazor WASM", ".NET Aspire", "Ocelot", "Clean Architecture"],
    url: "#",
    featured: true,
  },
  {
    name: "Claude / MCP Integrations",
    category: "AI",
    blurb:
      "Custom Model Context Protocol servers and Claude-powered agents wired into real developer workflows — from codebase-aware assistants to domain tools that automate repetitive engineering tasks.",
    stack: ["Claude API", "MCP", "Subagents", "Agent Skills"],
    url: "https://github.com/Ralephenya",
    featured: true,
  },
  {
    name: "Twilio WhatsApp Team Inbox",
    category: "Integrations",
    blurb:
      "A Twilio + Front WhatsApp integration that centralises all customer conversations into a shared team inbox with assignment and routing logic for insurance advisors.",
    stack: ["C#", "Web API", "Twilio", "Front"],
    url: "#",
    featured: false,
  },
  {
    name: "ERP & Courier Integrations",
    category: "Integrations",
    blurb:
      "REST integrations with Sage, Xero and Palladium (ERP) plus ShipLogic and Skynet (courier) for OrderEazi — auth, payload mapping, retry logic and a required-boxes shipment algorithm.",
    stack: ["C#", "REST", "Sage", "Xero", "ShipLogic"],
    url: "#",
    featured: false,
  },
  {
    name: "Meta WhatsApp Template Engine",
    category: "Integrations",
    blurb:
      "A generic, dynamic template engine over Meta's WhatsApp API — fills values into pre-built templates and sends seamless messages from the backend.",
    stack: ["C#", "Meta API", "WhatsApp"],
    url: "#",
    featured: false,
  },
]

export const projectFilters = ["All", "AI", "Web", "Integrations"] as const

// Skills grouped like a pit-wall telemetry board.
export const skillCategories: Record<
  string,
  { name: string; level: number; icon: any }[]
> = {
  "Languages & Frameworks": [
    { name: "C# / ASP.NET Core", level: 90, icon: Code },
    { name: "Blazor (WASM & Server)", level: 82, icon: Globe },
    { name: "Angular", level: 78, icon: Globe },
    { name: "TypeScript / JavaScript", level: 75, icon: Code },
    { name: "React / React Native", level: 65, icon: Globe },
    { name: "Node.js", level: 68, icon: Server },
  ],
  "Architecture & APIs": [
    { name: "REST APIs", level: 88, icon: LinkIcon },
    { name: "Microservices", level: 75, icon: Cpu },
    { name: "API Gateway (Ocelot / YARP)", level: 78, icon: Server },
    { name: ".NET Aspire", level: 72, icon: Server },
    { name: "GraphQL", level: 60, icon: LinkIcon },
    { name: "Clean Architecture / DDD", level: 80, icon: Wrench },
  ],
  "AI Integration": [
    { name: "Claude API", level: 85, icon: Brain },
    { name: "MCP (Model Context Protocol)", level: 82, icon: Brain },
    { name: "AI Agents & Subagents", level: 80, icon: Brain },
    { name: "RAG", level: 65, icon: Database },
  ],
  "Cloud & DevOps": [
    { name: "AWS (DVA-C02 Certified)", level: 80, icon: Cloud },
    { name: "Docker", level: 72, icon: Cpu },
    { name: "CI/CD", level: 70, icon: Wrench },
    { name: "Git / Bitbucket", level: 85, icon: Code },
    { name: "Azure Blob Storage", level: 55, icon: Cloud },
  ],
  "Data & Integrations": [
    { name: "SQL Server", level: 88, icon: Database },
    { name: "Entity Framework / Dapper", level: 82, icon: Database },
    { name: "MySQL", level: 75, icon: Database },
    { name: "Twilio / Meta WhatsApp", level: 78, icon: MessageSquare },
    { name: "ERP (Sage / Xero / Palladium)", level: 68, icon: Briefcase },
  ],
}

// Certifications — the "trophy wall".
export const certifications = [
  {
    name: "AWS Certified Developer – Associate",
    code: "DVA-C02",
    issuer: "Amazon Web Services",
    date: "Mar 2026",
    tier: "gold",
  },
  { name: "Claude 101", issuer: "Anthropic", date: "Apr 2026", tier: "anthropic" },
  { name: "Claude Code 101", issuer: "Anthropic", date: "Apr 2026", tier: "anthropic" },
  { name: "Claude Code in Action", issuer: "Anthropic", date: "Apr 2026", tier: "anthropic" },
  { name: "Intro to Agent Skills", issuer: "Anthropic", date: "Apr 2026", tier: "anthropic" },
  { name: "Intro to Subagents", issuer: "Anthropic", date: "Apr 2026", tier: "anthropic" },
  { name: "Intro to Claude Cowork", issuer: "Anthropic", date: "Apr 2026", tier: "anthropic" },
  {
    name: "Master the Mainframe – Level 3",
    issuer: "IBM",
    date: "Jan 2021",
    tier: "silver",
  },
]

// Demo videos — fill `id` with the YouTube video ID (the part after watch?v=).
// Leave `id` empty to show a "coming soon" placeholder card.
export const demoVideos = [
  {
    id: "uW0aeDnCZ4Y",
    title: "I Connected Claude AI to PayFast Using MCP",
    description: "Building a Model Context Protocol server that lets Claude drive real PayFast payments.",
  },
  {
    id: "YWMAUDTTT2o",
    title: "How I Run My Website for Free (Mostly) With AWS",
    description: "The S3 + CloudFront static-hosting setup behind this very portfolio.",
  },
  {
    id: "",
    title: "More demos incoming",
    description: "AI agents, subagents and MCP builds — recording soon. Subscribe on YouTube.",
  },
]

export const testimonials = [
  {
    name: "Riaan Grobler",
    role: "Senior Developer, Warp Development",
    quote:
      "When Steve first joined Warp Development I had my doubts — but he quickly proved me wrong. He's incredibly dedicated, first in and last to leave, and consistently delivers high-quality work with a fantastic attitude. A true team player and a valuable asset.",
  },
  {
    name: "Gareth Short",
    role: "Project Manager & Database Analytics, Bsure Insurance Advisors",
    quote:
      "Steve has a rare talent. He's incredibly focused and driven, yet always makes time to help others. Punctual, organised and emotionally intelligent — he became the go-to person for the team, and his collaborative approach is a breath of fresh air.",
  },
]
