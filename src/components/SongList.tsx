'use client'

import React, { useState } from 'react';
import { Song } from '../types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface SongListProps {
  tracks: Song[];
  onSongClick: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({ tracks, onSongClick }) => {
  const { isDarkMode } = useTheme();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const handleClick = (song: Song) => {
    setCurrentSong(song);
    onSongClick(song);
  };

  return (
    <motion.div
      className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-32"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          opacity: 0,
          y: 20,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.2,
            when: "beforeChildren",
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {tracks.map((track) => (
        <motion.div
          key={track.id}
          className={`p-4 rounded-lg flex items-center space-x-4 cursor-pointer transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} ${currentSong && currentSong.id === track.id ? 'active-song' : ''}`}
          onClick={() => handleClick(track)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}

        >


          <Image src={track.coverUrl} alt={track.title} width={64} height={64} className="h-16 w-16 rounded-lg" />
          <div>
            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{track.title}</p>
            <p className={`${currentSong && currentSong.id === track.id ? 'text-gray-900' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{track.artist}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SongList;
