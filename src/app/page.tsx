'use client'

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Player from '../components/Player';
import SongList from '../components/SongList';
import SongUploadModal from '../components/SongUploadModal';
import { Song } from '../types';
import { songs } from '../musicData';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';

// Create a simple Loader component
const Loader = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray text-black'}`}>
     Tunify Loading Cuteness ... 
    </div>
  );
};

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  // Fetch songs from Supabase on component mount
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Simulate a minimum loading time to show loader
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Fetch custom songs from Supabase
        const { data: customSongs, error } = await supabase
          .from('songs')
          .select('*');

        if (error) throw error;

        // Combine default and custom songs
        const allSongs = [
          ...songs,
          ...(customSongs || []).map(song => ({
            id: song.id.toString(),
            title: song.title,
            artist: song.artist,
            coverUrl: song.cover_url,
            audioUrl: song.audio_url
          }))
        ];

        setLocalSongs(allSongs);
        setSearchResults(allSongs);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
  };

  const handleSongUpload = async (newSongData: {
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl: string;
  }) => {
    // Update local state with new song
    const newSong: Song = {
      id: `custom-${Date.now()}`,
      title: newSongData.title,
      artist: newSongData.artist,
      coverUrl: newSongData.coverUrl,
      audioUrl: newSongData.audioUrl
    };

    const updatedSongs = [...localSongs, newSong];
    setLocalSongs(updatedSongs);
    setSearchResults(updatedSongs);
  };

  // If loading, show loader
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray text-black'}`}>
      <Header />
      <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <SearchBar 
            songs={localSongs} 
            setSearchResults={setSearchResults} 
            className="w-full sm:w-[70%]" 
          />
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
          >
            Upload Song
          </button>
        </div>
        <SongList 
          tracks={searchResults} 
          onSongClick={handleSongClick}  
        />
      </main>
      <Player song={currentSong} />
      <SongUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSongUpload={handleSongUpload}
      />
    </div>
  );
}