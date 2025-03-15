'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Player from '../components/Player';
import SongList from '../components/SongList';
import { Song } from '../types';
import { songs } from '../musicData';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';

const Loader = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray text-black'
      }`}
    >
      Tunify Loading Cuteness ...
    </div>
  );
};

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const { data: customSongs, error } = await supabase.from('songs').select('*');
        if (error) throw error;

        const allSongs = [
          ...songs,
          ...(customSongs || []).map((song) => ({
            id: song.id.toString(),
            title: song.title,
            artist: song.artist,
            coverUrl: song.cover_url,
            audioUrl: song.audio_url,
          })),
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

  const handleSongChange = (song: Song | null) => {
    setCurrentSong(song);
  };

  const handleSongUpload = async (newSongData: {
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl: string;
  }) => {
    const newSong: Song = {
      id: `custom-${Date.now()}`,
      title: newSongData.title,
      artist: newSongData.artist,
      coverUrl: newSongData.coverUrl,
      audioUrl: newSongData.audioUrl,
    };

    const updatedSongs = [...localSongs, newSong];
    setLocalSongs(updatedSongs);
    setSearchResults(updatedSongs);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray text-black'}`}>
      <Header onSongUpload={handleSongUpload} />
      <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <SearchBar
          songs={localSongs}
          setSearchResults={setSearchResults}
          className="w-full mb-4" onSongUpload={function (newSongData: { title: string; artist: string; coverUrl: string; audioUrl: string; }): void {
            throw new Error('Function not implemented.');
          } }        />
        <SongList
          tracks={searchResults}
          onSongClick={handleSongClick}
          currentSong={currentSong}
        />
      </main>
      <Player song={currentSong} onSongChange={handleSongChange} tracks={localSongs} />
    </div>
  );
}