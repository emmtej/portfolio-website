import { motion } from "framer-motion";
import { useState } from "react";
import { Input, TextArea } from "../ui/Input";
import { Text, Title } from "../ui/Text";
import { SOCIALS, SocialLink } from "./ContactSocials";

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
    <div className="space-y-12 lg:space-y-16">
      {/* Header Section - Full Width */}
      <div className="space-y-6 max-w-3xl">
        <Title>Get in touch</Title>
        <Text className="text-sm md:text-base leading-relaxed">
          I'm currently available for freelance work and open to new
          opportunities. If you have a project in mind or just want to say
          hello, feel free to reach out.
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="py-3"
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="py-3"
              />
            </div>

            <TextArea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell me more about your project..."
              className="py-3"
            />

            <motion.button
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="group relative flex items-center justify-center gap-4 w-full md:w-fit px-8 py-4 bg-text-main text-bg-app text-xs font-bold uppercase tracking-[0.2em] overflow-hidden"
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
                width="14"
                height="14"
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
        </div>

        {/* Socials Column */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <Title>Find me on</Title>
          <div className="flex flex-col">
            {SOCIALS.map((social) => (
              <SocialLink
                key={social.label}
                label={social.label}
                href={social.href}
                value={social.value}
                icon={social.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
