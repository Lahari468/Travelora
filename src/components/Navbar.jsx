import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Package,
  Calendar,
  Heart,
  Hotel,
  Plane,
  TicketPercent,
  TramFront,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center group">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 group-hover:bg-indigo-700 transition">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-extrabold tracking-wide text-gray-800">
                Travelora
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6">

            {!user && (
              <Link
                to="/"
                className={`text-sm font-medium ${
                  isActive('/') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Home
              </Link>
            )}

            {user && (
              <Link
                to="/dashboard"
                className={`flex items-center text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <TramFront className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            )}

            {user && (
              <>
                <NavLink to="/hotels" icon={Hotel} label="Hotels" isActive={isActive} />
                <NavLink to="/trips" icon={Plane} label="Trips" isActive={isActive} />
                <NavLink to="/plans" icon={Package} label="Plans" isActive={isActive} />
                <NavLink to="/bookmarks" icon={Heart} label="Bookmarks" isActive={isActive} />
                <NavLink to="/bookings" icon={TicketPercent} label="Bookings" isActive={isActive} />
                <NavLink to="/profile" icon={User} label="Profile" isActive={isActive} />

                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-red-500 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            )}

            {!user && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">

            {!user && (
              <Link to="/" className="block px-3 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            )}

            {user && (
              <>
                <MobileLink to="/dashboard" label="Dashboard" setIsMenuOpen={setIsMenuOpen} />
                <MobileLink to="/hotels" label="Hotels" setIsMenuOpen={setIsMenuOpen} />
                <MobileLink to="/trips" label="Trips" setIsMenuOpen={setIsMenuOpen} />
                <MobileLink to="/plans" label="Plans" setIsMenuOpen={setIsMenuOpen} />
                <MobileLink to="/bookmarks" label="Bookmarks" setIsMenuOpen={setIsMenuOpen} />
                <MobileLink to="/bookings" label="Bookings" setIsMenuOpen={setIsMenuOpen} />
                <MobileLink to="/profile" label="Profile" setIsMenuOpen={setIsMenuOpen} />

                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Logout
                </button>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="block px-3 py-2 text-gray-700 w-full text-left"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center text-sm font-medium ${
      isActive(to) ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
    }`}
  >
    <Icon className="h-4 w-4 mr-1" />
    {label}
  </Link>
);

const MobileLink = ({ to, label, setIsMenuOpen }) => (
  <Link
    to={to}
    className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
    onClick={() => setIsMenuOpen(false)}
  >
    {label}
  </Link>
);

export default Navbar;
