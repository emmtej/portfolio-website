import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ProjectCard, ProjectModal, type Project } from "./ProjectUI";

const PROJECTS: Project[] = [
  {
    id: "invoice",
    title: "InVoice",
    shortDesc:
      "A modern, streamlined invoicing application designed for voice actors.",
    fullDesc:
      "InVoice is a voice actor's highly specialized productivity and billing software. It automates the inconvenient process of manual script check by breaking down the dialogue of characters, accurately counting words, and producing neat and professional invoices with itemized detail and at rates customizable. By making a financial document out of a creative one, InVoice enables artists to dedicate less time to paperwork and more time in front of the microphone.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Mantine UI"],
    features: [
      "Used MantineUI components to quickly developt accessible components.",
      "Implemented Zustand to allow the user to use either a single or multiple documents accross different tools seamlessly.",
      "Allowed for the user to quickly set custom rates and save them as preset for re-use.",
      "Let the user export custom invoices in PDF, DOCX, or even simple text for copy-paste sharability.",
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
