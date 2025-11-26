"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Menu, X, Code2, LogOut } from "lucide-react"
import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut(auth)
    router.push("/")
  }

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#github", label: "Activity" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Eacaw
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all duration-300"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/50">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white transition-colors px-2 py-1"
                >
                  {link.label}
                </a>
              ))}
              {user ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium text-center"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg border border-purple-500/50 text-purple-400 text-center"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
