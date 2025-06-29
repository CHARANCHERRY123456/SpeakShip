import { HomeNav } from "./HomeNav";
import { CustomerNav } from "./CustomerNav";
import { DriverNav } from "./DriverNav";

export const MobileMenu = ({ isOpen, isAuthenticated, userRole, onClose }) => {
  return (
    <div
      className={`md:hidden transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-blue-800 overflow-hidden ${
        isOpen ? "max-h-96 py-2" : "max-h-0 py-0"
      }`}
    >
      <div className="flex flex-col gap-1 px-4">
        {!isAuthenticated ? (
          <HomeNav onClose={onClose} />
        ) : userRole === 'customer' ? (
          <CustomerNav onClose={onClose} />
        ) : (
          <DriverNav onClose={onClose} />
        )}
      </div>
    </div>
  );
};