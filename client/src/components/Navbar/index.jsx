import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks as baseNavLinks } from "../../constants/navLinks"; // Rename to avoid conflict
import VoiceButton from "../VoiceButton";
import MenuButton from "../MenuButton";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth hook

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth(); // Use useAuth hook for state and logout

  // Dynamically filter navLinks based on user role
  const filteredNavLinks = baseNavLinks.filter(link => {
    // Always show non-delivery specific links (or handle specifically if needed)
    if (link.to === "/orders" || link.to === "/track" || link.to === "/feedback" || link.to === "/voice") {
      return true;
    }
    // Conditionally show delivery links based on role
    if (isAuthenticated) {
      if (link.to === "/delivery/customer" && currentUser?.role === 'customer') {
        return true;
      }
      if (link.to === "/delivery/driver" && currentUser?.role === 'driver') {
        return true;
      }
    }
    return false;
  });

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
          {filteredNavLinks.map((link) => (
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
          {filteredNavLinks.map((link) => (
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
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600">Login</Link>
            )}
          </li>
        </ul>
      </div>
      {/* Profile dropdown if logged in */}
      {isAuthenticated && currentUser && ( // Use currentUser from context
        <div className="absolute right-4 top-20 bg-white rounded-lg shadow-lg p-4 z-50 min-w-[220px] border border-gray-200">
          <div className="mb-2 text-base font-semibold text-gray-800">Profile</div>
          <div className="text-sm text-gray-700 mb-1"><b>Role:</b> <span className="capitalize">{currentUser.role}</span></div>
          <div className="text-sm text-gray-700 mb-1"><b>Name:</b> {currentUser.name || '-'}</div>
          <div className="text-sm text-gray-700 mb-1"><b>Email:</b> {currentUser.email}</div>
          <div className="text-sm text-gray-700 mb-1"><b>Username:</b> {currentUser.username}</div>
          <div className="text-sm text-gray-700 mb-3"><b>Phone:</b> {currentUser.phone || '-'}</div>
          <button
            onClick={logout}
            className="w-full mt-2 rounded bg-red-600 text-white py-2 font-semibold hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
