"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

const roles = ["Full Stack Developer", "UI/UX Enthusiast", "Open Source Contributor", "Problem Solver"]

export function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isNameHovered, setIsNameHovered] = useState(false)

  useEffect(() => {
    const role = roles[currentRole]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < role.length) {
            setDisplayText(role.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentRole((prev) => (prev + 1) % roles.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-slate-300">Available for freelance work</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-white">{"Hi, I'm "}</span>
          <span
            className="relative inline-flex cursor-pointer"
            style={{ width: "4.5ch" }}
            onMouseEnter={() => setIsNameHovered(true)}
            onMouseLeave={() => setIsNameHovered(false)}
          >
            {/* Dave text - fades out on hover */}
            <span
              className={`bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 ${
                isNameHovered ? "opacity-0 blur-sm scale-95" : "opacity-100 blur-0 scale-100"
              }`}
            >
              Dave
            </span>
            {/* Eacaw text - fades in on hover, positioned absolutely */}
            <span
              className={`absolute left-0 top-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 whitespace-nowrap ${
                isNameHovered ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-95"
              }`}
            >
              Eacaw
            </span>
          </span>
        </h1>

        {/* Typing Effect */}
        <div className="h-12 mb-8">
          <p className="text-2xl sm:text-3xl text-slate-400">
            <span>{displayText}</span>
            <span className="inline-block w-0.5 h-8 bg-purple-500 ml-1 animate-pulse" />
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          I craft digital experiences that blend beautiful design with powerful functionality. Let's build something
          amazing together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">View My Work</span>
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-xl font-semibold border-2 border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  )
}
