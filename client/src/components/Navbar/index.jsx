import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { NavLogo } from "./components/NavLogo";
import { HomeNav } from "./components/HomeNav";
import { CustomerNav } from "./components/CustomerNav";
import { DriverNav } from "./components/DriverNav";
import { MobileMenu } from "./components/MobileMenu";
import VoiceButton from "../VoiceButton";
import MenuButton from "../MenuButton";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-500 to-blue-800 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 md:py-3">
        <NavLogo />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <HomeNav />
          ) : currentUser?.role === 'customer' ? (
            <CustomerNav />
          ) : (
            <DriverNav />
          )}
        </div>

        <div className="flex items-center gap-2">
          <VoiceButton />
          <MenuButton onClick={() => setMenuOpen(!menuOpen)} />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={menuOpen} 
        isAuthenticated={isAuthenticated} 
        userRole={currentUser?.role} 
        onClose={() => setMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;