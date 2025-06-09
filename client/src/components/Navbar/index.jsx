import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Make sure Link is imported
import { navLinks } from "../../constants/navLinks";
import VoiceButton from "../VoiceButton";
import MenuButton from "../MenuButton";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

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
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600">Login</Link>
            )}
          </li>
        </ul>
      </div>
      {/* Profile dropdown if logged in */}
      {isAuthenticated && user && (
        <div className="absolute right-4 top-20 bg-white rounded-lg shadow-lg p-4 z-50 min-w-[220px] border border-gray-200">
          <div className="mb-2 text-base font-semibold text-gray-800">Profile</div>
          <div className="text-sm text-gray-700 mb-1"><b>Role:</b> <span className="capitalize">{user.role}</span></div>
          <div className="text-sm text-gray-700 mb-1"><b>Name:</b> {user.name || '-'}</div>
          <div className="text-sm text-gray-700 mb-1"><b>Email:</b> {user.email}</div>
          <div className="text-sm text-gray-700 mb-1"><b>Username:</b> {user.username}</div>
          <div className="text-sm text-gray-700 mb-3"><b>Phone:</b> {user.phone || '-'}</div>
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