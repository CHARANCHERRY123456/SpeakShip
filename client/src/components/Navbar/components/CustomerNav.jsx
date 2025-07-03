import { 
  FaBoxOpen, 
  FaShippingFast, 
  FaStar, 
  FaUser
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const CustomerNav = ({ onClose = () => {} }) => {
  const { logout, currentUser } = useAuth();

  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <>
      {/* Navigation Links */}
      <Link 
        to="/orders" 
        onClick={onClose} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaBoxOpen className="mr-2" /> <span className="whitespace-nowrap">My Orders</span>
      </Link>

      <Link 
        to="/delivery/customer" 
        onClick={onClose} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaShippingFast className="mr-2" /> <span className="whitespace-nowrap">My Deliveries</span>
      </Link>

      <Link 
        to="/reviews" 
        onClick={onClose} 
        className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors text-sm sm:text-base"
      >
        <FaStar className="mr-2" /> <span className="whitespace-nowrap">Reviews</span>
      </Link>

      {/* Profile Link - Simple click to go to profile */}
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

  
      <button 
        onClick={() => { logout(); onClose(); }}
        className="flex items-center px-3 py-2 hover:bg-red-100 rounded-md text-white hover:text-red-600 transition-colors w-full text-sm sm:text-base mt-1"
      >
        <FaUser className="mr-2" /> <span className="whitespace-nowrap">Logout</span>
      </button>
    </>
  );
};