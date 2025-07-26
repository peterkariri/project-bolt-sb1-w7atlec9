import React from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'prime', icon: Zap, label: 'Prime' },
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-lg p-1 border border-prime-500/30">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === value
              ? 'bg-prime-500 text-black shadow-lg shadow-prime-500/50'
              : 'text-prime-300 hover:text-prime-400 hover:bg-prime-500/20'
          }`}
          title={`Switch to ${label} theme`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;