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

export const metadata: Metadata = {
  title: "Engineering at Full Throttle | Software Engineer Portfolio",
  description: "High-performance software engineering with precision and speed. BMW S1000RR inspired portfolio.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
