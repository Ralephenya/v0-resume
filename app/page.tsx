"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Cloud,
  Cpu,
  Server,
  Globe,
  Wrench,
  Brain,
  Quote,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Dumbbell,
} from "lucide-react"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")
  const [githubProjects, setGithubProjects] = useState([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

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

  const mockProjects = [
    {
      name: "enterprise-api-gateway",
      description:
        "High-performance API gateway with rate limiting, authentication, and real-time monitoring built with ASP.NET Core",
      stargazers_count: 234,
      forks_count: 45,
      topics: ["csharp", "aspnet", "api-gateway", "microservices"],
      html_url: "#",
      category: "Web",
    },
    {
      name: "whatsapp-business-integration",
      description: "Scalable WhatsApp Business API integration with dynamic templates and Twilio integration",
      stargazers_count: 189,
      forks_count: 32,
      topics: ["nodejs", "whatsapp", "twilio", "messaging"],
      html_url: "#",
      category: "Web",
    },
    {
      name: "azure-terraform-modules",
      description: "Production-ready Terraform modules for Azure infrastructure with CI/CD pipelines",
      stargazers_count: 156,
      forks_count: 28,
      topics: ["terraform", "azure", "devops", "infrastructure"],
      html_url: "#",
      category: "Cloud",
    },
    {
      name: "rag-nlp-pipeline",
      description: "RAG-based NLP pipeline with Python for intelligent document processing and search",
      stargazers_count: 298,
      forks_count: 67,
      topics: ["python", "nlp", "rag", "ai"],
      html_url: "#",
      category: "AI",
    },
    {
      name: "docker-microservices",
      description: "Containerized microservices architecture with Docker, Kubernetes, and service mesh",
      stargazers_count: 178,
      forks_count: 41,
      topics: ["docker", "kubernetes", "microservices", "devops"],
      html_url: "#",
      category: "Cloud",
    },
    {
      name: "angular-dashboard",
      description: "Real-time analytics dashboard built with Angular, TypeScript, and WebSocket connections",
      stargazers_count: 145,
      forks_count: 29,
      topics: ["angular", "typescript", "dashboard", "websockets"],
      html_url: "#",
      category: "Web",
    },
  ]

  const skillCategories = {
    "Languages & Frameworks": [
      { name: "C# / ASP.NET", level: 95, icon: Code },
      { name: "Angular", level: 92, icon: Globe },
      { name: "TypeScript", level: 90, icon: Code },
      { name: "Vue.js", level: 88, icon: Globe },
      { name: "Node.js", level: 89, icon: Server },
      { name: "JavaScript", level: 93, icon: Code },
      { name: "HTML/CSS", level: 91, icon: Globe },
      { name: "jQuery", level: 85, icon: Code },
    ],
    "Cloud & DevOps": [
      { name: "AWS", level: 91, icon: Cloud },
      { name: "Azure", level: 89, icon: Cloud },
      { name: "Docker", level: 92, icon: Cpu },
      { name: "CI/CD", level: 88, icon: Wrench },
      { name: "Git/Bitbucket", level: 94, icon: Code },
      { name: "Jira/Confluence", level: 86, icon: Wrench },
      { name: "Bash/JCL", level: 83, icon: Code },
      { name: "IBM Cloud", level: 81, icon: Cloud },
    ],
    Databases: [
      { name: "SQL Server", level: 93, icon: Database },
      { name: "MySQL", level: 88, icon: Database },
    ],
    "AI Integration": [
      { name: "Python (RAG)", level: 87, icon: Brain },
      { name: "NLP", level: 84, icon: Brain },
    ],
    Practices: [
      { name: "Agile (Scrum)", level: 92, icon: Wrench },
      { name: "TDD", level: 89, icon: Wrench },
    ],
  }

  const journey = [
    {
      year: "2018",
      title: "Junior Software Developer",
      company: "TechStart Solutions",
      location: "Cape Town, South Africa",
      description: "Started building enterprise web applications with C# and ASP.NET",
      coordinates: [-33.9249, 18.4241],
    },
    {
      year: "2020",
      title: "Full Stack Developer",
      company: "Digital Innovation Labs",
      location: "Johannesburg, South Africa",
      description: "Led development of cloud-native applications with Angular and Azure",
      coordinates: [-26.2041, 28.0473],
    },
    {
      year: "2022",
      title: "Senior Software Engineer",
      company: "Enterprise Solutions Inc",
      location: "Durban, South Africa",
      description: "Architected high-performance APIs and microservices with Docker",
      coordinates: [-29.8587, 31.0218],
    },
    {
      year: "2024",
      title: "Lead Software Engineer",
      company: "CloudTech Innovations",
      location: "Pretoria, South Africa",
      description: "Leading team of 8 engineers on AI-powered enterprise solutions",
      coordinates: [-25.7479, 28.2293],
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO at TechCorp",
      avatar: "/professional-woman-avatar.png",
      quote:
        "Exceptional technical skills and leadership. Delivered our most complex project 2 weeks ahead of schedule.",
    },
    {
      name: "Michael Chen",
      role: "Product Manager at InnovateLabs",
      avatar: "/professional-man-avatar.png",
      quote:
        "Outstanding problem-solving abilities. Transformed our legacy system into a modern, scalable architecture.",
    },
    {
      name: "Lisa Rodriguez",
      role: "Engineering Director at CloudSoft",
      avatar: "/professional-woman-avatar.png",
      quote: "Incredible attention to detail and performance optimization. A true engineering perfectionist.",
    },
  ]

  const [activeFilter, setActiveFilter] = useState("All")

  const filteredProjects =
    activeFilter === "All" ? mockProjects : mockProjects.filter((project) => project.category === activeFilter)

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/motorcycle-rider-helmet.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-red-900/40"></div>
        <div className="absolute inset-0 carbon-fiber opacity-10"></div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <h1 className="font-bold text-6xl md:text-8xl lg:text-9xl mb-8 text-white drop-shadow-2xl tracking-tight">
            Engineering at Full Throttle
          </h1>
          <p className="text-xl md:text-3xl text-gray-300 mb-12 drop-shadow-lg">
            I'm <span className="text-red-500 font-bold neon-text">Your Name</span>, a software engineer building
            high-performance solutions with precision and speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 neon-glow-red">
              View My Work
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent neon-glow-blue"
            >
              Contact Me
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900">
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
                      className="space-y-3 p-4 rounded-lg bg-black/50 border border-gray-800 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-blue-400" />
                          <span className="font-semibold text-lg text-white">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-400 font-mono">{skill.level}%</span>
                      </div>
                      <div className="rev-gauge">
                        <div className="rev-fill" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">Portfolio</h2>
          <p className="text-center text-gray-400 mb-12 text-lg">Projects from GitHub</p>

          <div className="flex justify-center mb-12">
            <div className="flex gap-3 flex-wrap justify-center">
              {["All", "Web", "Cloud", "AI"].map((filter) => (
                <Badge
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                    activeFilter === filter
                      ? "bg-red-600 text-white border-red-600"
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
                className="group hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-2 bg-gray-900 border-gray-800 hover:border-red-500/50"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-white">{project.name}</span>
                    <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  </CardTitle>
                  <CardDescription className="text-base text-gray-300">{project.description}</CardDescription>
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

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">My Journey</h2>
          <p className="text-center text-gray-400 mb-16 text-lg">Racing track timeline</p>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-2 bg-gradient-to-b from-red-600 via-blue-500 to-red-600 rounded-full border-4 border-black shadow-lg pit-stop-marker"></div>

            {journey.map((milestone, index) => (
              <div key={index} className="relative flex items-start mb-16">
                <div className="absolute left-6 w-8 h-8 bg-gradient-to-r from-red-600 to-blue-500 rounded-full border-4 border-black shadow-lg pit-stop-marker"></div>
                <div className="ml-20">
                  <Card className="hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 bg-black border-gray-800 hover:border-red-500/50">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-xl text-white">{milestone.title}</CardTitle>
                        <Badge className="font-mono bg-red-600 text-white">{milestone.year}</Badge>
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

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-white">Career Map</h2>
          <p className="text-center text-gray-400 mb-16 text-lg">Interactive journey across South Africa</p>

          <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
            <div className="bg-black/50 rounded-lg p-12 mb-8 border border-gray-800">
              <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl mb-4 text-white">Interactive Map Coming Soon</h3>
              <p className="text-gray-400">
                Click markers to explore my career journey across Cape Town, Johannesburg, Durban, and Pretoria
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {journey.map((location, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer bg-gray-800 border-gray-700 hover:border-blue-500/50"
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

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-white">Hobbies & Interests</h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-500/20 rounded-lg racing-stripe-overlay"></div>
              <img
                src="/motorcycle-track-day.png"
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
                <Card className="p-4 hover:shadow-lg hover:shadow-red-500/20 transition-all bg-black border-gray-800 hover:border-red-500/50">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-red-500" />
                    <div>
                      <h4 className="font-semibold text-white">Motorcycle Racing</h4>
                      <p className="text-sm text-gray-400">Track days and precision riding</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-lg hover:shadow-blue-500/20 transition-all bg-black border-gray-800 hover:border-blue-500/50">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="h-6 w-6 text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-white">Gaming</h4>
                      <p className="text-sm text-gray-400">Racing sims and competitive gaming</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-lg hover:shadow-red-500/20 transition-all bg-black border-gray-800 hover:border-red-500/50">
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

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-white">Testimonials</h2>

          <div className="relative">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg shadow-red-500/10">
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
                className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 bg-transparent"
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 bg-transparent"
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">Start Your Engine</h2>
          <p className="text-center text-gray-400 mb-12 text-lg">Ready to accelerate your project?</p>

          <Card className="bg-black border border-gray-800 shadow-lg shadow-red-500/10">
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
                  className="text-base py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Input
                  placeholder="Your Email"
                  type="email"
                  className="text-base py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <Textarea
                placeholder="Your Message"
                rows={5}
                className="text-base bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 engine-start-button">
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
              <Button variant="ghost" size="icon" className="hover:text-red-500 text-gray-400">
                <Github className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-blue-400 text-gray-400">
                <Linkedin className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-red-500 text-gray-400">
                <Mail className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-gray-400 text-center font-mono">© 2024 Your Name — Engineered with Precision & Speed</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
