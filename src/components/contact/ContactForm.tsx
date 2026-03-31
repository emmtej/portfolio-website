import { motion } from "framer-motion";
import { useState } from "react";

// TODO: Implement validation and loading and sent state.
export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="space-y-8">
      <p className="text-sm text-text-muted tracking-tight">
        Have a project in mind or just want to say hi?
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 group">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-text-muted group-hover:text-text-main/60 transition-colors">
              Name
            </p>
            <div className="relative overflow-hidden">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-bg-app border border-border-subtle px-4 py-3.5 text-[14px] text-text-main focus:outline-none focus:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-300 placeholder:text-text-muted/40"
              />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-text-main scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20" />
            </div>
          </div>
          <div className="space-y-3 group">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-text-muted group-hover:text-text-main/60 transition-colors">
              Email
            </p>
            <div className="relative overflow-hidden">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-bg-app border border-border-subtle px-4 py-3.5 text-[14px] text-text-main focus:outline-none focus:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-300 placeholder:text-text-muted/40"
              />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-text-main scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20" />
            </div>
          </div>
        </div>

        <div className="space-y-3 group">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-text-muted group-hover:text-text-main/60 transition-colors">
            Message
          </p>
          <div className="relative overflow-hidden">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="..."
              className="w-full bg-bg-app border border-border-subtle px-4 py-3.5 text-[14px] text-text-main focus:outline-none focus:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-300 placeholder:text-text-muted/40 resize-none"
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-text-main scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20" />
          </div>
        </div>

        <motion.button
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          type="submit"
          className="group relative flex items-center justify-center gap-4 w-full md:w-fit px-12 py-5 bg-text-main text-bg-app text-[11px] font-bold uppercase tracking-[0.3em] overflow-hidden"
        >
          <motion.div
            variants={{
              initial: { y: "100%" },
              hover: { y: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-white/5"
          />

          <span className="relative z-10">Send Message</span>

          <motion.svg
            variants={{
              initial: { x: 0 },
              hover: { x: 5 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </motion.svg>
        </motion.button>
      </form>
    </section>
  );
}
