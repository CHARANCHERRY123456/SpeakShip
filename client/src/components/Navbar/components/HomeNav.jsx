import { FaInfoCircle, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export const HomeNav = ({ onClose = () => {} }) => (
  <>
    <Link 
      to="/aboutus" 
      onClick={onClose} 
      className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors"
    >
      <FaInfoCircle className="mr-2" /> About
    </Link>
    <Link 
      to="/contactus" 
      onClick={onClose} 
      className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors"
    >
      <FaEnvelope className="mr-2" /> Contact Us
    </Link>
    <Link 
      to="/login" 
      onClick={onClose} 
      className="flex items-center px-3 py-2 hover:bg-sky-100 rounded-md text-white hover:text-sky-600 transition-colors"
    >
      <FaSignInAlt className="mr-2" /> Login
    </Link>
  </>
);