"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import ProgressTracker from "./components/ProgressTracker";
import SubmissionForm from "./components/SubmissionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getGitHubStats } from '../services/githubStats';
import { Textarea } from "@/components/ui/textarea"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Star,
  GitFork,
  MapPin,
  Zap,
  Code,
  Database,
  Link,
  Cloud,
  MessageSquare,
  Briefcase,
  Clipboard,
  Cpu,
  Server,
  Globe,
  Wrench,
  Brain,
  Quote,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Activity,
  Calendar,
  TrendingUp,
  Rocket,
} from "lucide-react"

export default function Portfolio() {
  const [step, setStep] = useState(0);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState("hero")
  const [githubProjects, setGithubProjects] = useState([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [lapCounter, setLapCounter] = useState(0)
  const [codingStreak, setCodingStreak] = useState(127)
  const [githubStats, setGithubStats] = useState({
    commits: 0,
    pullRequests: 0,
    issues: 0,
    contributions: 0,
  })
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const heroRef = useRef(null)
  const sectionsRef = useRef([])

  const fullText = "I'm Steve Ralephenya, a software engineer building high-performance solutions with precision and speed."

  useEffect(() => {
    if (isTyping && typedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 50)
      return () => clearTimeout(timer)
    } else if (typedText.length === fullText.length) {
      setIsTyping(false)
    }
  }, [typedText, isTyping, fullText])

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getGitHubStats({
          maxRepositories: 99,
          includePrivateRepos: true,
        });

        console.log(stats);

        setGithubStats({
          commits: stats.data.totalCommits,
          pullRequests: stats.data.totalPullRequests,
          issues: 0,
          contributions: stats.data.totalContributions,
        });
      } catch (error) {
        console.error('Failed to fetch GitHub stats', error);
      }
    }

    fetchStats();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = currentScrollY / documentHeight;

      if(scrollProgress <= 0) {
        setLapCounter(0);
        return;
      }

      setLapCounter(Math.floor(scrollProgress * 10))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in")
            }
          })
        },
        { threshold: 0.1 },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let keySequence = ""
    const handleKeyPress = (e: KeyboardEvent) => {
      keySequence += e.key.toLowerCase()
      if (keySequence.includes("rr")) {
        document.body.classList.add("rev-animation")
        console.log("[v0] 🏍️ VROOOOM! Engine revving!")
        setTimeout(() => {
          document.body.classList.remove("rev-animation")
        }, 2000)
        keySequence = ""
      }
      if (keySequence.length > 10) {
        keySequence = keySequence.slice(-10)
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  const playHoverSound = () => {
    console.log("[v0] 🔧 Gear shift sound!")
  }

  const playHoverSoundAndSendEmail = () => {
    console.log("[v0] 🔧 Gear shift sound!")
  }

  const mockProjects = [
    {
      name: "IdentityServer4 Example",
      description: "A robust authentication and authorization solution built with IdentityServer4 and ASP.NET Core, demonstrating secure user management, OAuth 2.0, and API protection.",
      stargazers_count: null,
      forks_count: null,
      topics: ["csharp", "aspnet", "identityserver4", "security", "authentication"],
      html_url: "https://github.com/Ralephenya/IdentityServer4Example",
      category: "Web",
      language: "C#",
      updated_at: "2024-01-15",
    },
    {
      name: "PerfectPay.App",
      description: "A cross-platform mobile application developed with .NET MAUI, showcasing expertise in mobile UI/UX, data persistence, and C# development.",
      stargazers_count: null,
      forks_count: null,
      topics: ["dotnet-maui", "csharp", "mobile", "xamarin", "app"],
      html_url: "https://github.com/Ralephenya/PerfectPay.App",
      category: "Mobile",
      language: "C#",
      updated_at: "2024-01-10",
    },
    {
      name: "CodeQuotes",
      description: "A mobile application built with .NET MAUI that serves daily coding quotes, demonstrating client-side data handling and a clean, modern user interface.",
      stargazers_count: null,
      forks_count: null,
      topics: ["dotnet-maui", "csharp", "mobile", "api", "quotes"],
      html_url: "https://github.com/Ralephenya/CodeQuotes",
      category: "Mobile",
      language: "C#",
      updated_at: "2024-01-09",
    },
    {
      name: "BreakfastMenu.App",
      description: "A full-stack application for managing a breakfast menu, highlighting skills in a web framework (like ASP.NET Core) and front-end development with .NET.",
      stargazers_count: null,
      forks_count: null,
      topics: ["csharp", "dotnet", "full-stack", "web-dev"],
      html_url: "https://github.com/Ralephenya/BreakfastMenu.App",
      category: "Web",
      language: "C#",
      updated_at: "2024-01-12",
    },
    {
      name: "MauiWeather",
      description: "A weather application developed with .NET MAUI, showcasing integration with external APIs and dynamic UI updates based on real-time data.",
      stargazers_count: null,
      forks_count: null,
      topics: ["dotnet-maui", "csharp", "mobile", "api"],
      html_url: "https://github.com/Ralephenya/MauiWeather",
      category: "Mobile",
      language: "C#",
      updated_at: "2024-01-05",
    },
    {
      name: "Custom .NET Template",
      description: "A personal .NET template project demonstrating an understanding of framework configuration and the ability to customize existing templates to fit a specific style and architecture.",
      stargazers_count: null,
      forks_count: null,
      topics: ["csharp", "dotnet", "templates", "configuration"],
      html_url: "https://github.com/Ralephenya/NET-Template",
      category: "DevOps",
      language: "C#",
      updated_at: "2024-01-14",
    },
    {
      name: "Discovery System Integration",
      description: "Contributed to the successful integration of Discovery's insurance system via API to enable real-time data exchange and enhance client services.",
      stargazers_count: null,
      forks_count: null,
      topics: ["api-integration", "insurance-tech", "csharp", "rest-api"],
      html_url: "#",
      category: "APIs & Integrations",
      language: "C#",
      updated_at: "2025-02-01",
    },
    {
      name: "Twilio WhatsApp Messaging",
      description: "Developed and integrated Twilio for WhatsApp messaging, enabling insurance advisors to manage customer communication and assign messages within the CRM system.",
      stargazers_count: null,
      forks_count: null,
      topics: ["twilio", "whatsapp", "messaging", "crm", "csharp"],
      html_url: "#",
      category: "APIs & Integrations",
      language: "C#",
      updated_at: "2025-03-01",
    },
    {
      name: "OrderEazi ERP & Inventory System",
      description: "Enhanced an order and inventory management system by integrating with ERP solutions like Sage and Xero, optimizing order fulfillment and improving customer-facing features.",
      stargazers_count: null,
      forks_count: null,
      topics: ["erp", "inventory-management", "csharp", "aspnet", "rest-api"],
      html_url: "#",
      category: "Web",
      language: "C#",
      updated_at: "2024-04-01",
    },
    {
      name: "Meta WhatsApp Integration",
      description: "Developed a dynamic and generic template integration with Meta's WhatsApp API, allowing the system to fill in values and send seamless messages based on pre-built templates.",
      stargazers_count: null,
      forks_count: null,
      topics: ["meta-api", "whatsapp", "messaging", "api-integration"],
      html_url: "#",
      category: "APIs & Integrations",
      language: "C#",
      updated_at: "2024-03-01",
    },
    {
      name: "ShipLogic & Skynet Integrations",
      description: "Worked with courier services like ShipLogic and Skynet to provide accurate shipment fees and develop a required-boxes algorithm for shipments, using API integration and JSON/XML.",
      stargazers_count: null,
      forks_count: null,
      topics: ["api-integration", "logistics", "algorithm", "json", "xml"],
      html_url: "#",
      category: "DevOps",
      language: "C#",
      updated_at: "2024-01-01",
    },
  ];

  const skillCategories = {
    "Languages & Frameworks": [
      { name: "C# / ASP.NET", level: 85, icon: Code },
      { name: "Angular", level: 65, icon: Globe },
      { name: "TypeScript", level: 60, icon: Code },
      { name: "React", level: 55, icon: Globe },
      { name: "Vue.js", level: 65, icon: Globe },
      { name: "Node.js", level: 70, icon: Server },
      { name: "JavaScript", level: 78, icon: Code },
      { name: "HTML/CSS", level: 85, icon: Globe },
      { name: "jQuery", level: 80, icon: Code },
    ],
    "APIs & Integrations": [
      { name: "REST APIs", level: 75, icon: Link },
      { name: "SOAP / XML", level: 55, icon: Link },
      { name: "JSON", level: 80, icon: Link },
      { name: "Twilio (WhatsApp)", level: 70, icon: MessageSquare },
      { name: "Meta WhatsApp (Templates)", level: 75, icon: MessageSquare },
      { name: "ERP Integrations (Sage, Xero, Palladium)", level: 65, icon: Briefcase },
    ],
    "Cloud & DevOps": [
      { name: "AWS", level: 60, icon: Cloud },
      { name: "Azure", level: 40, icon: Cloud },
      { name: "Docker", level: 70, icon: Cpu },
      { name: "CI/CD", level: 55, icon: Wrench },
      { name: "Git / Bitbucket", level: 78, icon: Code },
      { name: "Jira / Confluence", level: 75, icon: Wrench },
      { name: "IBM Cloud", level: 45, icon: Cloud },
    ],
    Databases: [
      { name: "SQL Server", level: 85, icon: Database },
      { name: "MySQL", level: 75, icon: Database },
      { name: "Milvus (Vector DB)", level: 30, icon: Database },
    ],
    "AI Integration": [
      { name: "Python (RAG)", level: 45, icon: Brain },
      { name: "NLP", level: 40, icon: Brain },
      { name: "ML.NET / TorchSharp", level: 35, icon: Brain },
    ],
    Practices: [
      { name: "Agile (Scrum)", level: 70, icon: Wrench },
      { name: "Test-Driven Development (TDD)", level: 75, icon: Wrench },
      { name: "Project Management", level: 65, icon: Clipboard },
    ],
  }

  const journey = [
    {
      year: "2022",
      title: "Software Developer",
      company: "Livex Software",
      location: "Pretoria, South Africa",
      description: "Contributed to software projects for inventory management, student administration, and client billing systems using ASP.NET Core and SQL.",
      coordinates: [-25.8241128, 28.3393786],
    },
    {
      year: "2023",
      title: "Junior Full Stack Developer",
      company: "Warp Development",
      location: "Pretoria, South Africa",
      description: "Started as a junior - Enhanced OrderEazi's order and inventory management systems, improving customer-facing features and streamlining internal processes.",
      coordinates: [-25.7479, 28.2293],
    },
    {
      year: "2024",
      title: "Intermediate Full Stack Developer",
      company: "Warp Development",
      location: "Pretoria, South Africa",
      description: "Worked on the OrderEazi system by integrating it with ERP systems like Sage and Xero. Developed a dynamic template integration with Meta's WhatsApp API. Also, worked with courier services like ShipLogic and Skynet to provide accurate shipment fees and consignment.",
      coordinates: [-25.7479, 28.2293],
    },
    {
      year: "2025",
      title: "Full Stack Developer",
      company: "Bsure Insurance Advisors",
      location: "Johannesburg, South Africa",
      description: "Integrated Discovery's insurance system via API and developed a Twilio for WhatsApp messaging solution and built in house software",
      coordinates: [-25.7479, 28.2293],
    },
  ];

  const testimonials = [
    {
      name: "Riaan Grobler",
      role: "Mentor/Senior Developer at Warp Development",
      avatar: "/professional-man-avatar.png",
      quote: "When Steve first joined Warp Development, I had my doubts. But he quickly proved me wrong. He's incredibly dedicated, always the first one in and the last to leave. Steve consistently delivers high-quality work, has a fantastic attitude, and is always eager to take on new challenges. He's a true team player and a valuable asset.",
    },
    {
      name: "Gareth Short",
      role: "Project Manager & Database Analytics at Bsure Insurance Advisors",
      avatar: "/professional-man-avatar.png",
      quote: "Steve has a rare talent. He's incredibly focused and driven, yet he always makes time to help others. He's a fantastic collaborator, always planning ahead and valuing everyone's input. His punctuality, organization, and emotional intelligence make him a great team player. He's become the go-to person for the team, and his collaborative approach is a breath of fresh air.",
    },
  ];

  const [activeFilter, setActiveFilter] = useState("All")

  const filteredProjects = activeFilter === "All" ? mockProjects : mockProjects.filter((project) => project.category === activeFilter)

  useEffect(() => {
    setGithubProjects(mockProjects)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="particles-bg"></div>
          <div className="text-center">
            <div className="tachometer mb-8">
              <div className="tach-needle"></div>
              <div className="tach-numbers">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <span key={num} className="tach-number" style={{ transform: `rotate(${num * 18 - 90}deg)` }}>
                  {num}
                </span>
                ))}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-4">STARTING ENGINE...</div>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-blue-500 rounded-full loading-bar"></div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-black text-white">
        <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="dashboard-indicator">
                  <div className="text-xs text-gray-400">LAP</div>
                  <div className="text-lg font-mono text-red-500">{lapCounter}/10</div>
                </div>
                <div className="dashboard-indicator">
                  <div className="text-xs text-gray-400">STREAK</div>
                  <div className="text-lg font-mono text-blue-400">{codingStreak}d</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-400">
                  RPM: <span className="text-red-500 font-mono">{Math.floor(scrollY / 10)}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="particles-bg"></div>
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url('/pexels-johann-lowen-903019051-19841948.jpg')`,
                transform: `translateY(${scrollY * 0.3}px)`,
              }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-red-900/50"></div>
          <div className="absolute inset-0 carbon-fiber opacity-5"></div>
          <div className="speed-blur-overlay"></div>

          <div className="relative z-20 text-center max-w-6xl mx-auto px-6 pt-32 md:pt-24">
            <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl mb-8 text-white drop-shadow-2xl tracking-tight animate-fade-in leading-tight">
            <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              Engineering at
            </span>
              <span className="block bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] mt-4">
              Full Throttle
            </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-12 drop-shadow-lg min-h-[3rem] font-medium">
              {typedText}
              <span className="animate-pulse text-red-500">|</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#portfolio">
                <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 neon-glow-red transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25"
                    onMouseEnter={playHoverSound}
                >
                  View My Work
                </Button>
              </a>
              <a href="#contact">
                <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 border-2 border-blue-500 text-blue-400 hover:bg-blue-500/20 bg-black/50 neon-glow-blue transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                    onMouseEnter={playHoverSound}
                >
                  Contact Me
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-900" ref={(el) => (sectionsRef.current[0] = el)}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Live GitHub Stats</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              <Card className="bg-black border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{githubStats.commits.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Commits</div>
                </CardContent>
              </Card>
              <Card className="bg-black border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <CardContent className="p-6 text-center">
                  <GitFork className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{githubStats.pullRequests}</div>
                  <div className="text-sm text-gray-400">Pull Requests</div>
                </CardContent>
              </Card>
              <Card className="bg-black border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{codingStreak}</div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-black border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{githubStats.contributions.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Contributions</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ============= CI/CD SECTION ============= */}
        <section className="py-20 px-6 bg-black relative overflow-hidden">
          {/* Particle Background */}
          <div className="particles-bg opacity-30"></div>

          {/* Racing Stripes */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Section Header */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Rocket className="h-12 w-12 text-red-500 animate-pulse" />
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500">
                  Interactive CI/CD Pipeline
                </h2>
                <Rocket className="h-12 w-12 text-blue-500 animate-pulse" />
              </div>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                Submit a picture URL and watch it get deployed through our simulated CI/CD pipeline in real-time.
                Experience the thrill of a full deployment cycle at S1000RR speeds!
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/30 rounded-lg p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-red-400 font-bold text-sm mb-1">Why Picture URL?</h3>
                    <p className="text-gray-400 text-xs">We need a valid image URL to generate your live preview and demonstrate the deployment process.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/30 rounded-lg p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-blue-400 font-bold text-sm mb-1">Why Email?</h3>
                    <p className="text-gray-400 text-xs">Optional - Get notified when your preview is ready and help us prevent spam submissions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Form */}
            <div className="mb-8">
              <SubmissionForm
                  onSuccess={(url) => setLiveUrl(url)}
                  onStepChange={setStep}
              />
            </div>

            {/* Progress Tracker */}
            <ProgressTracker step={step} />

            {/* Success Message */}
            {liveUrl && (
                <div className="mt-12 p-6 bg-gradient-to-r from-green-900/40 to-green-800/30 border-2 border-green-500 rounded-lg shadow-2xl shadow-green-500/30 animate-in">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-2xl font-bold text-green-400">Deployment Successful!</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-gray-300 mb-4">Your ephemeral environment is live and ready to view</p>
                  <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
                  >
                    <ExternalLink className="h-5 w-5" />
                    View Live Preview
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
            )}
          </div>
        </section>
        {/* ============= END CI/CD SECTION ============= */}

        <section className="py-20 px-6 bg-gray-900" ref={(el) => (sectionsRef.current[1] = el)}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-4 text-white">Tech Stack & Skills</h2>
            <p className="text-center text-gray-400 mb-16 text-lg">Performance metrics like motorcycle dials</p>

            {Object.entries(skillCategories).map(([category, skills]) => (
                <div key={category} className="mb-12">
                  <h3 className="text-2xl font-bold mb-6 text-red-500">{category}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, index) => {
                      const Icon = skill.icon
                      return (
                          <div
                              key={index}
                              className="space-y-3 p-4 rounded-lg bg-black/50 border border-gray-800 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 skill-card"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Icon className="h-6 w-6 text-blue-400" />
                                <span className="font-semibold text-lg text-white">{skill.name}</span>
                              </div>
                              <span className="text-sm text-gray-400 font-mono">{skill.level}%</span>
                            </div>
                            <div className="rev-gauge">
                              <div className="rev-fill animated-fill" style={{ width: `${skill.level}%` }}></div>
                            </div>
                          </div>
                      )
                    })}
                  </div>
                </div>
            ))}
          </div>
        </section>

        <section id="portfolio" className="py-20 px-6 bg-black" ref={(el) => (sectionsRef.current[2] = el)}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-4 text-white">Portfolio</h2>
            <p className="text-center text-gray-400 mb-12 text-lg">Dynamic GitHub projects with live filtering</p>

            <div className="flex justify-center mb-12">
              <div className="flex gap-3 flex-wrap justify-center">
                {["All", "Web", "Cloud", "AI"].map((filter) => (
                    <Badge
                        key={filter}
                        variant={activeFilter === filter ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                            activeFilter === filter
                                ? "bg-red-600 text-white border-red-600 neon-glow-red"
                                : "border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
                        }`}
                        onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </Badge>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                  <Card
                      key={index}
                      className="group hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-2 bg-gray-900 border-gray-800 hover:border-red-500/50 project-card"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg text-white">{project.name}</span>
                        <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                      </CardTitle>
                      <CardDescription className="text-base text-gray-300">{project.description}</CardDescription>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                project.language === "C#"
                                    ? "bg-purple-500"
                                    : project.language === "JavaScript"
                                        ? "bg-yellow-500"
                                        : project.language === "TypeScript"
                                            ? "bg-blue-500"
                                            : project.language === "Python"
                                                ? "bg-green-500"
                                                : project.language === "Go"
                                                    ? "bg-cyan-500"
                                                    : "bg-gray-500"
                            }`}
                        ></div>
                        <span>{project.language}</span>
                        <span className="ml-auto">Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-mono text-gray-300">{project.stargazers_count}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitFork className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-mono text-gray-300">{project.forks_count}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.topics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} className="text-xs bg-gray-800 text-gray-300 border-gray-700">
                              {topic}
                            </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-900" ref={(el) => (sectionsRef.current[3] = el)}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-4 text-white">My Journey</h2>
            <p className="text-center text-gray-400 mb-16 text-lg">Racing track timeline with pit stops</p>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-2 bg-gradient-to-b from-red-600 via-blue-500 to-red-600 rounded-full border-4 border-black shadow-lg pit-stop-marker racing-track-line"></div>

              {journey.map((milestone, index) => (
                  <div key={index} className="relative flex items-start mb-16 timeline-item">
                    <div className="absolute left-6 w-8 h-8 bg-gradient-to-r from-red-600 to-blue-500 rounded-full border-4 border-black shadow-lg pit-stop-marker pulse-marker"></div>
                    <div className="ml-20">
                      <Card className="hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 bg-black border-gray-800 hover:border-red-500/50 hover:scale-105">
                        <CardHeader>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <CardTitle className="text-xl text-white">{milestone.title}</CardTitle>
                            <Badge className="font-mono bg-red-600 text-white neon-glow-red">{milestone.year}</Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2 text-base text-gray-300">
                            <span className="font-semibold">{milestone.company}</span>
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span>{milestone.location}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-400 text-base">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-900" ref={(el) => (sectionsRef.current[4] = el)}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Career Map</h2>
            <p className="text-center text-gray-400 mb-16 text-lg">Interactive journey across South Africa</p>

            <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
              <div className="bg-black/50 rounded-lg p-12 mb-8 border border-gray-800">
                <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl mb-4 text-white">Interactive Map Coming Soon</h3>
                <p className="text-gray-400">
                  Click markers to explore my career journey across Johannesburg and Pretoria
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {journey.map((location, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer bg-gray-800 border-gray-700 hover:border-blue-500/50 hover:scale-105"
                    >
                      <CardContent className="p-4 text-center">
                        <MapPin className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                        <h4 className="font-semibold text-white">{location.location}</h4>
                        <p className="text-sm text-gray-400">{location.year}</p>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-900" ref={(el) => (sectionsRef.current[5] = el)}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Hobbies & Interests</h2>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-500/20 rounded-lg racing-stripe-overlay"></div>
                <img
                    src="/superbike-5551086_1280.jpg"
                    alt="Track day motorcycle racing"
                    className="rounded-lg shadow-2xl w-full h-80 object-cover border border-gray-800"
                />
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-red-500">Beyond Code</h3>
                  <p className="text-lg text-gray-300">
                    When I'm not engineering high-performance software, you'll find me pursuing other passions that fuel
                    my creativity and precision.
                  </p>
                </div>
                <div className="grid gap-4">
                  <Card className="p-4 hover:shadow-lg hover:shadow-red-500/20 transition-all bg-black border-gray-800 hover:border-red-500/50 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <Zap className="h-6 w-6 text-red-500" />
                      <div>
                        <h4 className="font-semibold text-white">Motorcycle Racing</h4>
                        <p className="text-sm text-gray-400">Track days and precision riding</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 hover:shadow-lg hover:shadow-red-500/20 transition-all bg-black border-gray-800 hover:border-red-500/50 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="h-6 w-6 text-red-500" />
                      <div>
                        <h4 className="font-semibold text-white">Fitness</h4>
                        <p className="text-sm text-gray-400">Staying in peak physical condition</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-900" ref={(el) => (sectionsRef.current[6] = el)}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Testimonials</h2>

            <div className="relative">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg shadow-red-500/10 testimonial-card">
                <CardContent className="p-8 text-center">
                  <Quote className="h-12 w-12 text-red-500 mx-auto mb-6" />
                  <blockquote className="text-xl md:text-2xl mb-6 text-gray-200">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <img
                        src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                        alt={testimonials[currentTestimonial].name}
                        className="w-12 h-12 rounded-full border-2 border-gray-600"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-gray-400">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4 mt-8">
                <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 bg-transparent hover:scale-110 transition-all"
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    onMouseEnter={playHoverSound}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 bg-transparent hover:scale-110 transition-all"
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                    onMouseEnter={playHoverSound}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 px-6 bg-gray-900" ref={(el) => (sectionsRef.current[7] = el)}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-4 text-white">Start Your Engine</h2>
            <p className="text-center text-gray-400 mb-12 text-lg">Ready to accelerate your project?</p>

            <Card className="bg-black border border-gray-800 shadow-lg shadow-red-500/10 contact-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Let's Build Something Fast</CardTitle>
                <CardDescription className="text-base text-gray-300">
                  Drop me a message and let's discuss your high-performance needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                      placeholder="Your Name"
                      className="text-base py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-all"
                  />
                  <Input
                      placeholder="Your Email"
                      type="email"
                      className="text-base py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <Textarea
                    placeholder="Your Message"
                    rows={5}
                    className="text-base bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-all"
                />
                <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 engine-start-button hover:scale-105 transition-all duration-300 neon-glow-red"
                    onMouseEnter={playHoverSoundAndSendEmail}
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="py-16 px-6 border-t border-gray-800 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <a href="https://github.com/Ralephenya" target="_blank" rel="noopener noreferrer">
                  <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-red-500 text-gray-400 hover:scale-110 transition-all"
                      onMouseEnter={playHoverSound}
                  >
                    <Github className="h-6 w-6" />
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/steve-ralephenya-8ab052197/" target="_blank" rel="noopener noreferrer">
                  <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-blue-400 text-gray-400 hover:scale-110 transition-all"
                      onMouseEnter={playHoverSound}
                  >
                    <Linkedin className="h-6 w-6" />
                  </Button>
                </a>
                <a href="mailto:bikoralephenya@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-red-500 text-gray-400 hover:scale-110 transition-all"
                      onMouseEnter={playHoverSound}
                  >
                    <Mail className="h-6 w-6" />
                  </Button>
                </a>
              </div>
              <p className="text-gray-400 text-center font-mono">© 2025 Steve Ralephenya — Engineered with Precision & Speed</p>
            </div>
          </div>
        </footer>
      </div>
  )
}