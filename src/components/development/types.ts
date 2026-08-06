export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  tech: string[];
  features: string[];
  link?: string;
  github?: string;
  preview?: {
    src: string;
    alt: string;
  };
}
