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

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { isDarkMode } = useTheme();

  // Fetch songs from Supabase on component mount
  useEffect(() => {
    const fetchSongs = async () => {
      try {
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
      } catch (err) {
        console.error('Error fetching songs:', err);
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray text-black'}`}>
      <Header />
      <main className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-4 ">
          <SearchBar songs={localSongs} setSearchResults={setSearchResults} />
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Upload Song
          </button>
        </div>
        <SongList 
          tracks={searchResults} 
          onSongClick={handleSongClick}
          onDeleteSong={async (songId) => {
            try {
              // Delete song from Supabase
              const { error } = await supabase
                .from('songs')
                .delete()
                .eq('id', songId.replace('custom-', ''));

              if (error) throw error;

              // Update local state
              const updatedSongs = localSongs.filter(song => song.id !== songId);
              setLocalSongs(updatedSongs);
              setSearchResults(updatedSongs);
            } catch (err) {
              console.error('Delete error:', err);
            }
          }}
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