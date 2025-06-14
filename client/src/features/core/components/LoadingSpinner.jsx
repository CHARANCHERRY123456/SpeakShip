// features/core/components/LoadingSpinner.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12 select-none">
    {/* Animated Ship SVG */}
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-2"
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
    >
      {/* Ship body */}
      <rect x="20" y="32" width="24" height="12" rx="6" fill="#0ea5e9" />
      {/* Ship deck */}
      <rect x="28" y="26" width="8" height="8" rx="2" fill="#38bdf8" />
      {/* Ship mast */}
      <rect x="31" y="14" width="2" height="14" rx="1" fill="#1e293b" />
      {/* Ship flag */}
      <motion.polygon
        points="32,14 32,20 40,17"
        fill="#facc15"
        initial={{ x: 0 }}
        animate={{ x: [0, 2, 0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />
    </motion.svg>
    {/* Animated Waves */}
    <motion.div
      className="flex space-x-1 mb-4"
      initial={{ x: 0 }}
      animate={{ x: [0, 8, 0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-2 w-6 rounded-full bg-sky-300 opacity-70"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </motion.div>
    {/* Animated SpeakShip Text */}
    <div className="text-xl font-extrabold text-sky-600 tracking-widest flex items-center gap-1">
      {"SpeakShip".split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 0 }}
          animate={{ y: [0, -4, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            delay: i * 0.07,
            ease: "easeInOut",
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
    <div className="text-sm text-gray-400 mt-2 tracking-wide">
      Preparing your delivery experience...
    </div>
  </div>
);

export default LoadingSpinner;
