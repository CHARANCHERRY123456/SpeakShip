import { 
  FaBoxOpen, 
  FaShippingFast, 
  FaStar, 
  FaUser, 
  FaSignOutAlt, 
  FaChevronDown 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

export const CustomerNav = ({ onClose = () => {} }) => {
  const { logout, currentUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Navigation Links */}
      <Link 
        to="/orders" 
        onClick={() => { onClose(); setIsProfileOpen(false); }} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaBoxOpen className="mr-2" /> <span className="whitespace-nowrap">My Orders</span>
      </Link>

      <Link 
        to="/delivery/customer" 
        onClick={() => { onClose(); setIsProfileOpen(false); }} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaShippingFast className="mr-2" /> <span className="whitespace-nowrap">My Deliveries</span>
      </Link>

      <Link 
        to="/reviews" 
        onClick={() => { onClose(); setIsProfileOpen(false); }} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaStar className="mr-2" /> <span className="whitespace-nowrap">Reviews</span>
      </Link>

      {/* Profile Dropdown */}
      <div className="relative w-full" ref={dropdownRef}>
        <button 
          onClick={toggleProfile}
          className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors w-full text-sm sm:text-base"
          aria-expanded={isProfileOpen}
          aria-label="User menu"
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">
            {getFirstLetter(currentUser?.name || currentUser?.username)}
          </div>
          <span className="truncate max-w-[100px] sm:max-w-[150px]">
            {currentUser?.name || currentUser?.username}
          </span>
          <FaChevronDown className={`ml-2 transition-transform flex-shrink-0 ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div 
            className="absolute left-0 sm:right-0 mt-2 w-full sm:w-auto sm:min-w-[12rem] bg-white rounded-md shadow-lg z-50 border border-gray-200"
          >
            <Link 
              to="/profile" 
              onClick={() => { onClose(); setIsProfileOpen(false); }}
              className="block px-4 py-2 text-gray-800 hover:bg-sky-50 hover:text-sky-600 flex items-center text-sm sm:text-base"
            >
              <FaUser className="mr-2" /> View Profile
            </Link>
            <button 
              onClick={() => { logout(); onClose(); setIsProfileOpen(false); }}
              className="w-full text-left px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 flex items-center text-sm sm:text-base"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
