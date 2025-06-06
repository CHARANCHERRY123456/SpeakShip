import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/orders", label: "Orders" },
  { to: "/track", label: "Track Delivery" },
  { to: "/feedback", label: "Feedback" },
  { to: "/voice", label: "Voice Command" },
  { to: "/login", label: "Login" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 shadow-md backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 md:py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center text-xl font-bold text-sky-600 hover:text-sky-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded">
            {/* <span className="mr-2">🚚</span> */}
            QuickDeliver <span className="ml-1 text-sky-400 font-semibold">Lite</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${location.pathname === link.to ? "bg-sky-100 text-sky-700" : "text-slate-700 hover:bg-sky-50 hover:text-sky-600"}`}
              >
                {/* {link.icon} */}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Audio Button (always visible) */}
        <button
          className="ml-2 md:ml-4 p-2 rounded-full bg-sky-100 hover:bg-sky-200 shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 flex items-center justify-center w-10 h-10"
          aria-label="Voice Command"
        >
          {/* <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg> */}
          Voice
        </button>
        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden ml-2 p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {/* <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg> */}
          Menu
        </button>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out bg-white/95 shadow ${menuOpen ? "max-h-96 py-2" : "max-h-0 overflow-hidden py-0"}`}
        style={{ transitionProperty: 'max-height, padding' }}
      >
        <ul className="flex flex-col gap-1 px-4">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${location.pathname === link.to ? "bg-sky-100 text-sky-700" : "text-slate-700 hover:bg-sky-50 hover:text-sky-600"}`}
                onClick={() => setMenuOpen(false)}
              >
                {/* {link.icon} */}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
