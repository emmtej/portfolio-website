import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Project, ProjectCard, ProjectModal } from "./ProjectUI";

const PROJECTS: Project[] = [
  {
    id: "invoice",
    title: "InVoice",
    shortDesc: "A modern, streamlined invoicing application designed for freelancers and small businesses.",
    fullDesc: "InVoice is a comprehensive invoicing solution built to simplify the financial workflow of independent professionals. It provides a clean, intuitive interface for creating, managing, and tracking invoices, ensuring that you get paid on time without the administrative headache.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    features: [
      "Intuitive dashboard for tracking pending and completed payments",
      "Professional PDF generation for clean, branded invoices",
      "Robust client management system to keep all contacts in one place",
      "Automated email reminders for overdue payments",
      "Secure data handling with modern authentication patterns",
    ],
    link: "https://invoice-demo.example.com",
    github: "https://github.com/example/invoice",
  },
];

export function DevelopmentTab() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <h2 className="uppercase font-semibold tracking-[0.1em] text-text-main/80 text-xs mb-6">
          Projects
        </h2>
        
        <div className="grid grid-cols-1 gap-10">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
