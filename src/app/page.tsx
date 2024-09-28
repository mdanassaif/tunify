'use client'

import React, { useState } from 'react';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Player from '../components/Player';
import SongList from '../components/SongList';
import { Song } from '../types';
import { songs } from '../musicData';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [searchResults, setSearchResults] = useState<Song[]>(songs);
  const { isDarkMode } = useTheme();

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray text-black'}`}>


      <Header />
      <main className="max-w-6xl mx-auto p-8">
        <SearchBar songs={songs} setSearchResults={setSearchResults} />
        <SongList tracks={searchResults} onSongClick={handleSongClick} />
      </main>
      <Player song={currentSong} />
    </div>
  );
}
