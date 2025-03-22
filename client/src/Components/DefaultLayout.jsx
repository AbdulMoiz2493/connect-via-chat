import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";

export default function DefaultLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = async () => {
    let confirmLogout = confirm("Are you sure you want to log out?");

    if (!confirmLogout) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 400) {
        const error = await response.json();
        toast.error(`${error.message}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
        return;
      }

      const data = await response.json();
      toast.success(`${data.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      navigate("/");
      dispatch(logout());
    } catch (err) {
      console.log(err);
      toast.error(`Server Error - Please Try again later.`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  // Navigation items array for easier management
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/profile", label: "Profile" },
    { to: "/chat", label: "Chat" },
  ];

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-gray-900/95 shadow-lg backdrop-blur-sm" : "bg-gray-900"
        }`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center group">
            <h1 className="text-3xl font-bold relative">
              <span className="absolute inset-0 bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent transition-opacity duration-1000 ease-in-out opacity-100 group-hover:opacity-0">
                Connect
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-white bg-clip-text text-transparent transition-opacity duration-1000 ease-in-out opacity-0 group-hover:opacity-100">
                Connect
              </span>
              <span className="invisible">Connect</span>
            </h1>
          </Link>

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Toggle menu</span>
            <div className="relative w-6 h-5">
              <span
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${
                  isOpen ? "rotate-45 top-2" : "rotate-0 top-0"
                }`}
              ></span>
              <span
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                } top-2`}
              ></span>
              <span
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${
                  isOpen ? "-rotate-45 top-2" : "rotate-0 top-4"
                }`}
              ></span>
            </div>
          </button>

          <div
            className={`${
              isOpen ? "block" : "hidden"
            } w-full md:block md:w-auto transition-all duration-300 ease-in-out`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-6 md:mt-0 md:border-0 bg-gray-800 md:bg-transparent border-gray-700">
              {navItems.map((item) => (
                <li key={item.to} className="relative">
                  <Link
                    to={item.to}
                    className={`block py-2 px-3 md:px-1 transition-all duration-200 ease-in-out text-white hover:text-blue-400 md:hover:bg-transparent ${
                      location.pathname === item.to
                        ? 'md:after:content-[""] md:after:absolute md:after:w-full md:after:h-0.5 md:after:bg-blue-500 md:after:bottom-0 md:after:left-0'
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <div className="flex flex-col md:flex-row mt-3 md:mt-0 md:ml-6 gap-2 pl-10">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogOut}
                    className="text-base bg-gray-700 text-white rounded-md px-4 py-2 hover:bg-gray-600 transition-all duration-300 font-medium"
                  >
                    LOG OUT
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md px-4 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-medium text-center"
                    >
                      LOGIN
                    </Link>
                    <Link
                      to="/signup"
                      className="text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md px-4 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-medium text-center"
                    >
                      SIGN UP
                    </Link>
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed navbar */}
      <div className="pt-0">
        <ToastContainer />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}
