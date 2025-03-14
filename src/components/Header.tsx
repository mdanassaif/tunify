'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../app/globals.css';
import Modal from '../components/ModalBox';
import SongUploadModal from '../components/SongUploadModal';
import { Song } from '../types';
import { LightModeIcon, DarkModeIcon } from './icons/ThemeModeIcon';
import { UploadIcon } from './icons/UploadIcon';
import { InfoIcon } from './icons/InfoIcon';

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
    <div
      className={`
        flex justify-between items-center p-4 
        ${isDarkMode ? 'bg-black border-b border-gray-800' : 'bg-gray-100 border-b border-gray-300'}
      `}
    >
      {/* Raw Logo and Name */}
      <div className="flex items-center space-x-2">
        {/* Gritty Vinyl/Beat Logo */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" d="M98.05 18.54c-11.46-.08-23.59 1.28-36.08 3.99L130.1 261.1c-14.2-5.1-31.18-6.2-48.09-3.2c-39.17 6.9-67.15 33.8-62.52 59.8c4.64 26.1 40.14 41.7 79.33 34.7c39.08-6.9 67.08-33.7 62.38-59.8c-22.1-80.8-44.4-163-66.39-244.21c50.69 3.59 72.59 31.58 90.59 60.31c-.5-62.33-37.7-89.81-87.35-90.16zm310.65 30.7c-13.9.1-28.8 2.59-44.1 7.22l87.1 232.44c-14.6-3.9-31.6-3.7-48.3.7c-38.4 10-64.2 39-57.5 64.6c6.7 25.7 43.4 38.3 81.8 28.2c38.5-10 64.2-39 57.5-64.6c-28.6-78.8-57.3-158.9-85.8-238.2c50.8-.5 74.9 25.7 95.2 52.9c-5.2-58.55-40.4-83.61-85.9-83.26zM258.4 163.5l1.8 248.1c-12.3-8.6-28.4-14.3-45.6-15.9c-39.4-3.8-73.7 14.5-76.2 41c-2.5 26.3 27.7 50.8 67.1 54.5c39.7 3.9 73.7-14.5 76.3-40.9c.2-83.8.8-168.9 1.3-253.1c47.9 17 61.6 49.8 71.2 82.4c19.9-74.1-27.9-112.3-95.9-116.1z"/></svg>
        {/* Edgy Name */}
        <h1
          className={`
            text-xl font-black  tracking-wider
            ${isDarkMode ? 'text-white' : 'text-black'}
          `}
        >
          TunIFY
        </h1>
      </div>

      {/* Buttons: Minimal and Sharp */}
      <div className="flex items-center space-x-3">
        {/* Upload Button */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          aria-label="Upload Song"
          className={`
            p-2 rounded-sm 
            ${isDarkMode ? 'bg-white text-black hover:bg-gray-300' : 'bg-black text-white hover:bg-gray-700'}
            transition-colors duration-150
          `}
        >
          <UploadIcon className="w-5 h-5" />
        </button>

        {/* About Button */}
        <button
          onClick={() => setShowModal(true)}
          aria-label="About"
          className={`
            p-2 rounded-sm 
            ${isDarkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-300'}
            transition-colors duration-150
          `}
        >
          <InfoIcon className="w-5 h-5" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          aria-label="Toggle Theme"
          className={`
            p-2 rounded-sm 
            ${isDarkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-300'}
            transition-colors duration-150
          `}
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