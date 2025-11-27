import { Code2, Palette, Zap, Coffee, Landmark } from "lucide-react"

const skills = [
  { icon: Code2, title: "Development", description: "Clean, efficient code that scales" },
  { icon: Landmark, title: "Architecture", description: "Designing robust and scalable systems" },
  { icon: Zap, title: "Performance", description: "Lightning-fast user experiences" },
  { icon: Coffee, title: "Dedication", description: "Committed to excellence" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Bio */}
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">
              I'm a passionate full-stack developer with a love for creating innovative digital solutions. With over
              5 years professional experience in the Salesforce ecosystem, I specialize in building scalable web applications using modern technologies.
            </p>
            {/* Tech Stack */}
            <div className="pt-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Professional Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["Salesforce", "Apex", "Lightning Web Components", "SOQL", "Salesforce DX"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-purple-500/50 hover:text-purple-400 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div className="pt-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Personal Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "TypeScript", "Node.js", "Firebase", "Tailwind CSS"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-purple-500/50 hover:text-purple-400 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.title}
                className="group p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-purple-500/30 hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 w-fit mb-4 group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-colors">
                  <skill.icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{skill.title}</h3>
                <p className="text-sm text-slate-400">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
