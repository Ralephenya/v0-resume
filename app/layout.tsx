import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Inter } from "next/font/google"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
})

const SITE = "https://cloudwithsteve.online"
const DESCRIPTION =
  "Steve Junior Ralephenya — Full Stack .NET Developer, AWS Certified (DVA-C02) and AI integration specialist (Claude, MCP, agents). Open for work. Building enterprise-grade .NET, Blazor and Angular systems."

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Steve Ralephenya | Full Stack .NET Developer · AI Integration · AWS Certified",
  description: DESCRIPTION,
  keywords: [
    "Steve Ralephenya",
    "Full Stack .NET Developer",
    "Blazor",
    "ASP.NET Core",
    "Angular",
    "AWS Certified Developer",
    "DVA-C02",
    "AI Integration",
    "Claude",
    "MCP",
    "South Africa Developer",
  ],
  authors: [{ name: "Steve Junior Ralephenya" }],
  creator: "Steve Junior Ralephenya",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: SITE,
    title: "Steve Ralephenya | Full Stack .NET Developer · AI Integration · AWS Certified",
    description: DESCRIPTION,
    siteName: "Steve Ralephenya — Portfolio",
    images: [{ url: "/steve.JPG", width: 1200, height: 630, alt: "Steve Ralephenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steve Ralephenya | Full Stack .NET Developer",
    description: DESCRIPTION,
    images: ["/steve.JPG"],
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
  --font-serif: ${orbitron.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
