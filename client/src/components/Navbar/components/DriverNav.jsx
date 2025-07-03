import { 
  FaTruck, 
  FaBoxOpen, 
  FaStar, 
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const DriverNav = ({ onClose = () => {} }) => {
  const { logout, currentUser } = useAuth();
  
  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <>
      {/* Regular Navigation Links */}
      <Link 
        to="/delivery/driver" 
        onClick={onClose} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaTruck className="mr-2" /> <span className="whitespace-nowrap">Delivery Status</span>
      </Link>
      <Link 
        to="/orders/driver" 
        onClick={onClose} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaBoxOpen className="mr-2" /> <span className="whitespace-nowrap">Orders</span>
      </Link>
      <Link 
        to="/reviews" 
        onClick={onClose} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaStar className="mr-2" /> <span className="whitespace-nowrap">Reviews</span>
      </Link>
      
      {/* Profile Link - Directly clickable to profile */}
      <Link 
        to="/profile" 
        onClick={onClose}
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        {currentUser?.photoUrl ? (
          <img
            src={currentUser.photoUrl}
            alt="Profile"
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white mr-2 flex-shrink-0"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">
            {getFirstLetter(currentUser?.name || currentUser?.username)}
          </div>
        )}
        <span className="truncate max-w-[100px] sm:max-w-[150px]">
          {currentUser?.name || currentUser?.username}
        </span>
      </Link>

      {/* Logout Button - Now separate since dropdown is removed */}
      <button 
        onClick={() => { logout(); onClose(); }}
        className="flex items-center px-3 py-2 hover:bg-red-100 rounded-md text-white hover:text-red-600 transition-colors w-full text-sm sm:text-base mt-1"
      >
        <FaSignOutAlt className="mr-2" /> <span className="whitespace-nowrap">Logout</span>
      </button>
    </>
  );
};