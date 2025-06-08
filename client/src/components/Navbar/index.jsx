import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Make sure Link is imported
import { navLinks } from "../../constants/navLinks";
import VoiceButton from "../VoiceButton";
import MenuButton from "../MenuButton";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth(); // We no longer need 'login' directly here

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 shadow-md backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 md:py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center text-xl font-bold text-sky-600 hover:text-sky-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded">
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
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {isAuthenticated ? (
              <button onClick={logout} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600">Logout</button>
            ) : (
              // FIX: Use Link to navigate to the login page
              <Link to="/login" className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600">Login</Link>
            )}
          </li>
        </ul>
        {/* Audio Button (always visible) */}
        <VoiceButton />
        {/* Hamburger (Mobile) */}
        <MenuButton onClick={() => setMenuOpen((open) => !open)} />
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
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {isAuthenticated ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600">Logout</button>
            ) : (
              // FIX: Use Link to navigate to the login page for mobile menu as well
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;