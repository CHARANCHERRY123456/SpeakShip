// features/core/components/LoadingSpinner.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const dotVariants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.15,
      },
    },
  },
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="flex space-x-2 mb-4">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-4 w-4 rounded-full bg-sky-500 shadow-md"
          variants={dotVariants}
          animate="animate"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
    <div className="text-lg font-bold text-sky-600 tracking-widest flex items-center gap-2 select-none">
      <span className="animate-pulse">S</span>
      <span className="animate-bounce [animation-delay:.1s]">p</span>
      <span className="animate-bounce [animation-delay:.2s]">e</span>
      <span className="animate-bounce [animation-delay:.3s]">a</span>
      <span className="animate-bounce [animation-delay:.4s]">k</span>
      <span className="animate-pulse [animation-delay:.5s]">S</span>
      <span className="animate-bounce [animation-delay:.6s]">h</span>
      <span className="animate-bounce [animation-delay:.7s]">i</span>
      <span className="animate-bounce [animation-delay:.8s]">p</span>
      <span className="ml-2 animate-pulse text-gray-400">•</span>
    </div>
  </div>
);

export default LoadingSpinner;
