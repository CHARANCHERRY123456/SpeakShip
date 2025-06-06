import React from "react";

const VoiceButton = ({ onClick }) => (
  <button
    className="ml-2 md:ml-4 p-2 rounded-full bg-sky-100 hover:bg-sky-200 shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 flex items-center justify-center w-10 h-10"
    aria-label="Voice Command"
    onClick={onClick}
  >
    Voice
  </button>
);

export default VoiceButton;
