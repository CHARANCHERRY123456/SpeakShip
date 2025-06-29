import React from "react";
import { Menu as MenuIcon } from "lucide-react";

const MenuButton = ({ onClick }) => (
  <button
    className="md:hidden ml-2 p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
    aria-label="Toggle menu"
    onClick={onClick}
  >
    <MenuIcon className="w-6 h-6" />
  </button>
);

export default MenuButton;
