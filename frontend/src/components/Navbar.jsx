import { Link, useLocation } from "react-router-dom";
import { House, Search, Heart, LogIn } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const pathName = useLocation().pathname;

  return (
    <>
      {/* Mobile dropdown */}
      <div className="dock bg-neutral text-neutral-content md:hidden">
        <Link to="/" className={pathName === "/" ? "dock-active" : undefined}>
          <House />
          <span className="dock-label">Home</span>
        </Link>

        <Link to="/search" className={pathName === "/search" ? "dock-active" : undefined}>
          <Search />
          <span className="dock-label">Search</span>
        </Link>

        <Link to="/notifications" className={pathName === "/notifications" ? "dock-active" : undefined}>
          <Heart />
          <span className="dock-label">Notifications</span>
        </Link>

        <Link to="/profile" className="avatar placeholder hover:scale-105 transition-transform group">
          <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center font-bold text-sm">
            {authUser?.profilePic ? <img
              id="showImage"
              className="size-8 object-cover rounded-full"
              src={authUser?.profilePic}
              alt="Profile"
            /> : authUser.name.charAt(0).toUpperCase()}
          </div>
        </Link>
      </div>

      {/* Desktop navigation */}
      {!authUser ? (
        <li>
          <Link to="/login" className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            <span className="hidden xl:inline">Login</span>
          </Link>
        </li>
      ) : (
        <div className="fixed left-0 top-0 h-screen w-20 bg-base-100 border-r border-base-300 hidden md:flex flex-col items-center justify-between py-8 px-2 z-50">
          {/* Logo at the Top */}
          <Link to="/" className="flex items-center justify-center p-3 hover:bg-base-200 rounded-xl transition-all group">
            {/* Instagram-style camera logo */}
            <svg className="size-7 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </Link>

          {/* Navigation Items in Middle */}
          <div className="flex flex-col gap-4 w-full items-center">
            <Link to="/" className={`p-3 rounded-xl transition-all group ${pathName === "/" ? "text-base-content/80" : " text-primary bg-primary/10 hover:bg-base-200 hover:text-base-content"}`}>
              <House />
            </Link>

            <Link to="/search" className={`p-3 rounded-xl transition-all group ${pathName === "/search" ? "text-base-content/80" : " text-primary bg-primary/10 hover:bg-base-200 hover:text-base-content"}`}>
              <Search />
            </Link>

            <Link to="/notifications" className={`p-3 rounded-xl transition-all group ${pathName === "/profile" ? "text-base-content/80" : " text-primary bg-primary/10 hover:bg-base-200 hover:text-base-content"}`}>
              <Heart />
            </Link>
          </div>

          {/* User Profile Avatar at Bottom */}
          <Link to="/profile" className="avatar placeholder hover:scale-105 transition-transform group">
            <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center font-bold text-sm">
              {authUser?.profilePic ? <img
                id="showImage"
                className="size-8 object-cover rounded-full"
                src={authUser?.profilePic}
                alt="Profile"
              /> : authUser.name.charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
