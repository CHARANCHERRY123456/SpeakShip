// features/core/components/LoadingSpinner.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
    <motion.div
      className="rounded-full border-8 border-t-8 border-white border-t-yellow-400 shadow-2xl h-24 w-24"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      className="mt-8 text-3xl font-extrabold text-white drop-shadow-lg tracking-wide"
    >
      Loading...
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ delay: 0.7, duration: 1 }}
      className="mt-2 text-lg text-white/80 font-medium"
    >
      Please wait while we prepare your experience
    </motion.div>
  </div>
);

export default LoadingSpinner;
