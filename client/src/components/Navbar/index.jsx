import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { navLinks as baseNavLinks } from "../../constants/navLinks";
import VoiceButton from "../VoiceButton";
import MenuButton from "../MenuButton";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // New state for profile dropdown
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, currentUser, logout } = useAuth();

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
    // Hide /profile link from the main navbar if we want to access it via compact profile display
    if (link.to === "/profile") {
        return false;
    }
    return false;
  });

  // Handle click on the compact profile display button (toggles dropdown)
  const handleProfileClick = () => {
    setProfileDropdownOpen(prev => !prev);
  };

  // UPDATED: Handle navigation to the full profile page with toggle logic
  const handleViewProfile = () => {
    setProfileDropdownOpen(false); // Close dropdown
    if (location.pathname === '/profile') {
      // If already on the profile page, navigate to home (or previous page)
      navigate('/'); // You can change '/' to navigate(-1) to go back to the previous page
    } else {
      // If not on the profile page, navigate to it
      navigate('/profile');
    }
  };

  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 shadow-md backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 md:py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center text-2xl font-extrabold text-sky-600 hover:text-sky-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
            aria-label="SpeakShip Home"
          >
            <span className="mr-2 text-3xl" role="img" aria-label="ship">🚢 </span>
            <span>SpeakShip</span>
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
          {/* Compact Profile Display for Desktop (visible only when authenticated) */}
          {isAuthenticated && currentUser && (
            <li className="relative">
              <button
                onClick={handleProfileClick} // This toggles the small dropdown
                className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-full p-1"
              >
                <div className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                  {getFirstLetter(currentUser.name || currentUser.username)}
                </div>
                <span className="text-slate-700 font-medium hidden lg:block">{currentUser.name || currentUser.username}</span>
              </button>
              {profileDropdownOpen && ( // This is the small dropdown that appears
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  <button
                    onClick={handleViewProfile} // This navigates to /profile or toggles away
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    {location.pathname === '/profile' ? 'Close Profile' : 'View Full Profile'} {/* Dynamic text */}
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
        <VoiceButton />
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
          {/* Mobile Profile Link (visible only when authenticated) */}
          {isAuthenticated && currentUser && (
            <li>
              <button
                onClick={() => { handleViewProfile(); setMenuOpen(false); }} // This navigates/toggles and closes mobile menu
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {getFirstLetter(currentUser.name || currentUser.username)}
                </div>
                <span>
                  {currentUser.name || currentUser.username} ({location.pathname === '/profile' ? 'Close Profile' : 'View Profile'}) {/* Dynamic text */}
                </span>
              </button>
            </li>
          )}
          <li>
            {isAuthenticated ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
