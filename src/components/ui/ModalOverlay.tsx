import { motion } from "framer-motion";
import { backdropVariants } from "./modal-variants";

export function ModalOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      aria-hidden="true"
      data-modal-backdrop=""
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
      className="absolute inset-0 bg-black/40"
    />
  );
}
