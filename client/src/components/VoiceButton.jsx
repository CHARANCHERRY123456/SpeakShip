import React from "react";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";

const VoiceButton = ({ onClick, listening = false }) => (
  <motion.button
    whileTap={{ scale: 0.92 }}
    whileHover={{ scale: 1.08, boxShadow: "0 0 0 6px #38bdf8aa" }}
    animate={
      listening
        ? {
            scale: [1, 1.15, 1],
            boxShadow: [
              "0 0 0 0 #38bdf8",
              "0 0 0 12px #38bdf822",
              "0 0 0 0 #38bdf8",
            ],
          }
        : {}
    }
    transition={{
      duration: 1.2,
      repeat: listening ? Infinity : 0,
      ease: "easeInOut",
    }}
    className={`ml-2 md:ml-4 p-2 rounded-full bg-sky-100 hover:bg-sky-200 shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 flex items-center justify-center w-12 h-12 relative group ${
      listening ? "ring-2 ring-yellow-400" : ""
    }`}
    aria-label={listening ? "Listening..." : "Voice Command"}
    onClick={onClick}
  >
    <Mic
      className={`w-6 h-6 ${
        listening ? "text-yellow-400 animate-pulse" : "text-sky-600"
      }`}
    />
    <span className="sr-only">
      {listening ? "Listening..." : "Voice Command"}
    </span>
    {listening && (
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded shadow-lg"
      >
        Listening...
      </motion.span>
    )}
    <motion.div
      className="absolute inset-0 rounded-full pointer-events-none"
      animate={
        listening
          ? {
              boxShadow: [
                "0 0 0 0 #fde047",
                "0 0 0 16px #fde04722",
                "0 0 0 0 #fde047",
              ],
            }
          : {}
      }
      transition={{
        duration: 1.2,
        repeat: listening ? Infinity : 0,
        ease: "easeInOut",
      }}
    />
  </motion.button>
);

export default VoiceButton;
