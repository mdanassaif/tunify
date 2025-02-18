'use client'

import React, { useState } from 'react';
import { Song } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  songs: Song[];
  setSearchResults: React.Dispatch<React.SetStateAction<Song[]>>;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  songs, 
  setSearchResults, 
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { isDarkMode } = useTheme();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);

    // Filter songs = starting of artist or song
    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().startsWith(query) || song.artist.toLowerCase().startsWith(query)
    );

    setSearchResults(filteredSongs);  
  };

  return (
    <div className={className}>
      <input
        type="text"
        placeholder="Search songs, artists..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={`
          w-full 
          p-2 
          rounded-lg 
          outline-none 
          transition-colors 
          duration-300 
          focus:ring-2 
          ${isDarkMode 
            ? 'bg-gray-800 text-white placeholder-gray-500 focus:ring-blue-500' 
            : 'bg-gray-200 text-black placeholder-gray-600 focus:ring-blue-300'
          }`}
      />
    </div>
  );
};

export default SearchBar;