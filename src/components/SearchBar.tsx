'use client';

import React, { useState } from 'react';
import { Song } from '../types';
import { useTheme } from '../context/ThemeContext';
import { UploadIcon } from './icons/UploadIcon';
import SongUploadModal from '../components/SongUploadModal';

interface SearchBarProps {
  songs: Song[];
  setSearchResults: React.Dispatch<React.SetStateAction<Song[]>>;
  className?: string;
  onSongUpload: (newSongData: {
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  songs, 
  setSearchResults, 
  className = '',
  onSongUpload
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);

    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().startsWith(query) || song.artist.toLowerCase().startsWith(query)
    );

    setSearchResults(filteredSongs);  
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="text"
        placeholder="Search songs, artists..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={`flex-grow p-2 rounded-lg outline-none transition-colors duration-300 focus:ring-2 ${
          isDarkMode 
            ? 'bg-gray-800 text-white placeholder-gray-500 focus:ring-blue-500' 
            : 'bg-gray-200 text-black placeholder-gray-600 focus:ring-blue-300'
        }`}
      />
      <button
        onClick={() => setIsUploadModalOpen(true)}
        aria-label="Upload Song"
        className={`p-2 rounded-md ${
          isDarkMode ? 'bg-[#88e58b] text-black hover:bg-gray-300' : 'bg-black text-white hover:bg-gray-700 '
        } transition-colors duration-150`}
      >
        <UploadIcon className="w-5 h-5 " />
      </button>

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

export default SearchBar;