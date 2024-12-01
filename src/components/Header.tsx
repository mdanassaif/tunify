import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../app/globals.css'
import Modal from '../components/ModalBox';
import { TunifyLogo } from './icons/TunifyLogo';
import { LightModeIcon, DarkModeIcon } from './icons/ThemeModeIcon';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleThemeToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className={`
      flex justify-between items-center p-5 
      ${isDarkMode 
        ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-black' 
        : 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300'
      } 
      transition-all duration-300
    `}>
      {/* Tunify Logo with Hover Effect */}
      <div 
  className="relative cursor-pointer"
  onClick={() => setShowModal(true)}
>
  <TunifyLogo
    className={`
      ${isDarkMode ? 'text-green-400' : 'text-green-600'}
      transition-colors duration-300
    `}
  />
  <span className="absolute -top-2 -right-2 
    bg-white text-green-900 text-[.5rem] 
    rounded-full w-5 h-5 
    flex items-center justify-center">
    Free
  </span>
</div>

      {/* Theme Toggle Button with Advanced Animation */}
      <button
        onClick={handleThemeToggle}
        aria-label="Toggle Theme"
        className={`
          p-2 rounded-full 
          focus:outline-none 
          transition-all duration-300
          ${isDarkMode 
            ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
            : 'hover:bg-gray-100 text-gray-600 hover:text-black'
          }
        `}
      >
        {isDarkMode ? (
          <DarkModeIcon className="w-7 h-7" />
        ) : (
          <LightModeIcon className="w-7 h-7" />
        )}
      </button>

      {/* Modal Rendering */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Header;