import { Link } from "react-router-dom";

export const NavLogo = () => (
  <div className="flex items-center gap-2">
    <Link
      to="/"
      className="flex items-center text-2xl font-extrabold hover:text-blue-200 transition-colors"
      aria-label="SpeakShip Home"
    >
      <span className="mr-2 text-3xl" role="img" aria-label="ship">🚢 </span>
      <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
        SpeakShip
      </span>
    </Link>
  </div>
);