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
          <span className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src={currentUser.photoUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-white"
              style={{ aspectRatio: '1/1', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </span>
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-lg sm:text-xl">
            {getFirstLetter(currentUser?.name || currentUser?.username)}
          </div>
        )}
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