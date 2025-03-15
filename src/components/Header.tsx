'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../app/globals.css';
import Modal from '../components/ModalBox';
import SongUploadModal from '../components/SongUploadModal';
import { LightModeIcon, DarkModeIcon } from './icons/ThemeModeIcon';
import { UploadIcon } from './icons/UploadIcon';
import { InfoIcon } from './icons/InfoIcon';
import { TunifyLogo } from './icons/TunifyLogo';
interface HeaderProps {
  onSongUpload: (newSongData: {
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl: string;
  }) => void;
}

const Header: React.FC<HeaderProps> = ({ onSongUpload }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <div className="flex justify-between items-center p-4">
      {/* Raw Logo and Name */}
      <div className="flex items-center space-x-2">
      <TunifyLogo className="w-5 h-5" />
        <h1 className={`text-xl font-black tracking-wider ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>
              
          Tunify
        </h1>
      </div>

      {/* Buttons: Minimal and Sharp */}
      <div className="flex items-center space-x-3">
        {/* About Button */}
        <button
          onClick={() => setShowModal(true)}
          aria-label="About"
          className={`p-2 rounded-sm ${
            isDarkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-300'
          } transition-colors duration-150`}
        >
          <InfoIcon className="w-5 h-5" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          aria-label="Toggle Theme"
          className={`p-2 rounded-sm ${
            isDarkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-300'
          } transition-colors duration-150`}
        >
          {isDarkMode ? (
            <DarkModeIcon className="w-5 h-5" />
          ) : (
            <LightModeIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Modals */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
      {isUploadModalOpen && (
        <SongUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSongUpload={onSongUpload}
        />
      )}
    </div>
  );
};

export default Header;