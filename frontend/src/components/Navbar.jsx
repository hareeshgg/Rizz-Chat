import { Link } from "react-router-dom";
import { Settings, User, Menu, Heart, LogIn } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        {/* Mobile dropdown */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <Menu className="h-5 w-5" />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[11] mt-3 w-52 p-2 shadow-lg">
            {!authUser ? (
              <li>
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/home" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Messages
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Search
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Notifications
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                </li>

              </>
            )}
          </ul>
        </div>

        <Link to="/" className="btn btn-ghost text-xl">
          Rizz Chat
        </Link>
      </div>

      {/* Desktop navigation */}
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-vertical px-1">
          {!authUser ? (
            <li>
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                <span className="hidden xl:inline">Login</span>
              </Link>
            </li>
          ) : (
            <div className="flex flex-row">

              <li>
                <Link to="/home" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Messages
                </Link>
              </li>
              <li>
                <Link to="/search" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Search
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Notifications
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </Link>
              </li>

            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
