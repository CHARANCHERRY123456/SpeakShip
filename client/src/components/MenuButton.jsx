import React from "react";

const MenuButton = ({ onClick }) => (
  <button
    className="md:hidden ml-2 p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
    aria-label="Toggle menu"
    onClick={onClick}
  >
    Menu
  </button>
);

export default MenuButton;
