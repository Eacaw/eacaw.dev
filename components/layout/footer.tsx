import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react"

export function Footer() {
  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
  ]

  return (
    <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-purple-500 fill-purple-500 animate-pulse" />
            <span>using Next.js & Firebase</span>
          </div>

          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
