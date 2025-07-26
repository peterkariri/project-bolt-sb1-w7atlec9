import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Trophy, User, LogOut, Settings, Zap, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 border-gray-700 shadow-xl';
      case 'prime':
        return 'bg-gradient-to-r from-black via-gray-900 to-black border-prime-500 shadow-prime-lg';
      default:
        return 'bg-white border-gray-200 shadow-lg';
    }
  };

  const getTextClasses = () => {
    switch (theme) {
      case 'dark':
        return 'text-white';
      case 'prime':
        return 'text-prime-400';
      default:
        return 'text-gray-900';
    }
  };

  const getLinkClasses = () => {
    switch (theme) {
      case 'dark':
        return 'text-gray-300 hover:text-white';
      case 'prime':
        return 'text-prime-300 hover:text-prime-400';
      default:
        return 'text-gray-700 hover:text-prime-600';
    }
  };

  return (
    <nav className={`${getThemeClasses()} border-b transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Zap className={`h-8 w-8 ${theme === 'prime' ? 'text-prime-400' : 'text-prime-600'}`} />
              {theme === 'prime' && (
                <div className="absolute inset-0 animate-pulse">
                  <Zap className="h-8 w-8 text-prime-300 opacity-50" />
                </div>
              )}
              {theme === 'prime' && (
                <div className="absolute -top-1 -right-1">
                  <Star className="h-3 w-3 text-neon-400 animate-pulse" />
                </div>
              )}
            </div>
            <span className={`text-xl font-bold ${getTextClasses()}`}>
              PRIME BETTING TIPS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ThemeToggle />
            <Link
              to="/predictions"
              className={`${getLinkClasses()} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Today's Tips
            </Link>
            <Link
              to="/multi-bets"
              className={`${getLinkClasses()} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Multi-Bets
            </Link>
            <Link
              to="/jackpot"
              className={`${getLinkClasses()} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Jackpot
            </Link>
            <Link
              to="/odds"
              className={`${getLinkClasses()} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Odds Comparison
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`${getLinkClasses()} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-gradient-to-r from-prime-600 to-prime-700 text-black px-3 py-2 rounded-md text-sm font-medium hover:from-prime-700 hover:to-prime-800 transition-all duration-200 shadow-lg shadow-prime-500/30"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className={`flex items-center space-x-1 ${getLinkClasses()} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </button>
                  <div className={`absolute right-0 mt-2 w-48 ${theme === 'prime' ? 'bg-gray-900 border border-prime-400' : theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
                    <Link
                      to="/profile"
                      className={`flex items-center px-4 py-2 text-sm ${theme === 'prime' ? 'text-prime-200 hover:bg-gray-800' : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`flex items-center w-full px-4 py-2 text-sm ${theme === 'prime' ? 'text-prime-200 hover:bg-gray-800' : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`${getLinkClasses()} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-prime text-black px-4 py-2 rounded-md text-sm font-medium hover:shadow-prime transition-all duration-200 font-bold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${getLinkClasses()} p-2`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-opacity-20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="flex justify-center py-2">
                <ThemeToggle />
              </div>
              <Link
                to="/predictions"
                className={`${getLinkClasses()} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                Today's Tips
              </Link>
              <Link
                to="/multi-bets"
                className={`${getLinkClasses()} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                Multi-Bets
              </Link>
              <Link
                to="/jackpot"
                className={`${getLinkClasses()} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                Jackpot
              </Link>
              <Link
                to="/odds"
                className={`${getLinkClasses()} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                Odds Comparison
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`${getLinkClasses()} block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-prime-400 hover:text-prime-300 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`${getLinkClasses()} block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => setIsOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className={`${getLinkClasses()} block w-full text-left px-3 py-2 rounded-md text-base font-medium`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`${getLinkClasses()} block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-prime text-black block px-3 py-2 rounded-md text-base font-medium hover:shadow-prime transition-all duration-200 font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;