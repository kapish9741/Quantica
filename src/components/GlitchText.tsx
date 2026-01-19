import { motion } from "framer-motion";
interface GlitchTextProps {
  text: string;
  className?: string;
}
const GlitchText = ({ text, className = "" }: GlitchTextProps) => {
  return (
    <motion.span
      className={`glitch relative inline-block ${className}`}
      data-text={text}
      style={{ filter: 'drop-shadow(0 8px 28px rgba(255,255,255,0.28))' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.span>
  );
};
export default GlitchText;
