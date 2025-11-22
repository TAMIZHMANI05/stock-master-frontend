import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Define navigation items based on role
  const getNavItems = () => {
    if (user?.role === ROLES.INVENTORY_MANAGER) {
      return [
        { name: 'Dashboard', path: '/manager/dashboard' },
        { name: 'Operations', path: '/manager/operations' },
        { name: 'Stock', path: '/manager/stock' },
        { name: 'Move History', path: '/manager/move-history' },
        { name: 'Settings', path: '/manager/settings' },
      ];
    } else if (user?.role === ROLES.WAREHOUSE_STAFF) {
      return [
        { name: 'Dashboard', path: '/staff/inventory' },
        { name: 'Operations', path: '/staff/operations' },
        { name: 'Stock', path: '/staff/stock' },
        { name: 'Move History', path: '/staff/move-history' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#441752]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-white border-b-2 border-white-500'
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Avatar & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none group"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white hidden sm:block">
                  {user?.name || user?.email}
                </span>
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow duration-200 ring-2 ring-gray-800 group-hover:ring-gray-600">
                  {getInitials(user?.name || user?.email)}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center space-x-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
