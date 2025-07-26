import React from 'react';
import Navbar from './Navbar';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  const getBackgroundClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900';
      case 'prime':
        return 'bg-gradient-to-br from-black via-gray-900 to-black';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} transition-all duration-300`}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;