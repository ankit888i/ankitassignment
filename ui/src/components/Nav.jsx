import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Auth from "./Auth";

function Nav() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [navContent, setNavContent] = useState(null);

  useEffect(() => {
    const updateRole = () => {
      const currentRole = localStorage.getItem("role");
      setUserRole(currentRole);
    };

    const intervalId = setInterval(updateRole, 500);

    updateRole();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const currentRole = localStorage.getItem("role");
      setUserRole(currentRole);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (userRole === "admin") {
      setNavContent(
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center ">
              <img
                src="/public/h_logohq.svg"
                alt="HustleNest"
                className="h-10"
              />
              <span className="text-lg font-semibold text-gray-800">
                <Link to="/admin">HustleNest</Link>
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <Link to="/logout">
                <button
                  type="button"
                  className="px-3 py-2 text-sm tracking-widest font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-700  focus:outline-none   "
                >
                  logout
                </button>
              </Link>
            </div>
          </div>
        </header>
      );
    } else if (userRole === "user") {
      setNavContent(
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center ">
              <img
                src="/public/h_logohq.svg"
                alt="HustleNest"
                className="h-10"
              />
              <span className="text-lg font-semibold text-gray-800">
                <Link to="/user">HustleNest</Link>
              </span>
            </div>
            <nav className="space-x-6">
              <span className="text-gray-600 hover:text-gray-800">
                <Link to="/user">Home</Link>
              </span>
              <span className="text-gray-600 hover:text-gray-800">
                <Link to="/user/credits">Dashboard</Link>
              </span>

              <span className="text-gray-600 hover:text-gray-800">
                <Link to="/user/profile">My Profile</Link>
              </span>
            </nav>
            <div className="flex items-center space-x-6">
              <Link to="/logout">
                <button
                  type="button"
                  className="px-3 py-2 text-sm tracking-widest font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-700  focus:outline-none   "
                >
                  logout
                </button>
              </Link>
            </div>
          </div>
        </header>
      );
    } else {
      setNavContent(
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center ">
              <img
                src="/public/h_logohq.svg"
                alt="HustleNest"
                className="h-10"
              />
              <span className="text-lg font-semibold text-gray-800">
                <Link to="/">HustleNest</Link>
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <Link to="/register">
                <button
                  type="button"
                  className="px-3 py-2 text-sm tracking-widest font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-700  focus:outline-none   "
                >
                  Login/Signup
                </button>
              </Link>
            </div>
          </div>
        </header>
      );
    }
  }, [userRole]);

  return (
    <>
      <Auth />
      <div>{navContent}</div>
    </>
  );
}

export default Nav;
