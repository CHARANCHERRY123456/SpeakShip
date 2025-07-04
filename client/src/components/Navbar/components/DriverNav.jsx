import { 
  FaTruck, 
  FaBoxOpen, 
  FaStar, 
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const DriverNav = ({ onClose = () => {} }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      onClose();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
      
      {/* Profile Link - with username added */}
      <Link 
        to="/profile" 
        onClick={onClose}
        className="flex items-center px-3 py-2  rounded-md text-white   text-sm sm:text-base"
      >
        {currentUser?.photoUrl ? (
          <>
            <span className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
              <img
                src={currentUser.photoUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-white"
                style={{ aspectRatio: '1/1', display: 'block' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </span>
            <span>{currentUser?.name || currentUser?.username}</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-lg sm:text-xl mr-2">
              {getFirstLetter(currentUser?.name || currentUser?.username)}
            </div>
            <span>{currentUser?.name || currentUser?.username}</span>
          </>
        )}
      </Link>

      {/* Logout Button - Now separate since dropdown is removed */}
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center px-3 py-2 hover:bg-red-100 rounded-md text-white hover:text-red-600 transition-colors text-sm sm:text-base mt-2"
      >
        <FaUser className="mr-2" /> 
        <span className="whitespace-nowrap">Logout</span>
      </button>
    
    </>
  );
};