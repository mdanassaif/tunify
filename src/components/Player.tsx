import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Song } from '../types';
import { useTheme } from '../context/ThemeContext';
import { songs as tracks } from '../musicData';

interface PlayerProps {
  song: Song | null;
}

const Player: React.FC<PlayerProps> = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isDarkMode } = useTheme();
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (song && audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentSong(song);
      setCurrentSongIndex(tracks.findIndex((t) => t.id === song.id));
    }
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateCurrentTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    audio?.addEventListener('timeupdate', updateCurrentTime);
    return () => {
      audio?.removeEventListener('timeupdate', updateCurrentTime);
    };
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${formattedSeconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleShuffle = () => {
    setIsShuffleActive(!isShuffleActive);
  };

  const handleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
      setIsRepeatActive(!isRepeatActive);
    }
  };

  const handleNext = () => {
    if (audioRef.current) {
      const newIndex = isShuffleActive
        ? Math.floor(Math.random() * tracks.length)
        : (currentSongIndex + 1) % tracks.length;
      setCurrentSong(tracks[newIndex]);
      setCurrentSongIndex(newIndex);
      audioRef.current.src = tracks[newIndex].audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleBack = () => {
    if (audioRef.current && currentTime > 5) {
      audioRef.current.currentTime = 0;
    } else if (audioRef.current) {
      const newIndex = isShuffleActive
        ? Math.floor(Math.random() * tracks.length)
        : (currentSongIndex - 1 + tracks.length) % tracks.length;
      setCurrentSong(tracks[newIndex]);
      setCurrentSongIndex(newIndex);
      audioRef.current.src = tracks[newIndex].audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (playerRef.current) {
      playerRef.current.style.height = isExpanded ? '' : '100vh';
    }
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startHeight = playerRef.current?.offsetHeight ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const newHeight = startHeight + (startY - currentY);
      if (newHeight > 100 && newHeight < window.innerHeight && playerRef.current) {
        playerRef.current.style.height = `${newHeight}px`;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);

      if (playerRef.current) {
        if (playerRef.current.offsetHeight > window.innerHeight / 2) {
          setIsExpanded(true);
          playerRef.current.style.height = '100vh';
        } else {
          setIsExpanded(false);
          playerRef.current.style.height = '';
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  return (
    <div
      ref={playerRef}
      className={`fixed bottom-0 left-0 right-0 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} shadow-md flex items-center justify-center transition-all duration-300 ${isExpanded ? 'h-full' : 'h-30'}`}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {currentSong ? (
        <div className={`flex items-center space-x-4 w-full ${isExpanded ? 'flex-col' : 'flex-row'} max-w-screen-lg mx-auto ${isExpanded ? 'snow-background' : ''}`}>
          {isExpanded && (
            <div className="ripple-background ">
              <div className={`circle xxlarge ${isDarkMode ? 'dark-mode-shade1' : 'shade1'}`}></div>
              <div className={`circle xlarge ${isDarkMode ? 'dark-mode-shade2' : 'shade2'}`}></div>
              <div className={`circle large ${isDarkMode ? 'dark-mode-shade3' : 'shade3'}`}></div>
              <div className={`circle medium ${isDarkMode ? 'dark-mode-shade4' : 'shade4'}`}></div>
              <div className={`circle small ${isDarkMode ? 'dark-mode-shade5' : 'shade5'}`}></div>
            </div>
          )}
          <div className={`flex-shrink-0 ${isExpanded ? 'mb-4' : ''}`}>
            <Image src={currentSong.coverUrl} alt="Song Cover" width={isExpanded ? 350 : 100} height={isExpanded ? 350 : 100} className="rounded-lg border" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${isDarkMode ? 'text-white' : 'text-black'} ${isExpanded ? 'text-3xl' : 'text-lg'} font-bold`}>{currentSong.title}</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${isExpanded ? 'text-xl' : 'text-base'}`}>{currentSong.artist}</p>

            <div className="flex items-center space-x-4 mt-2">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="appearance-none w-full h-1 bg-gray-700 rounded-lg outline-none focus:outline-none transition-all duration-300 ease-in-out"
              />
              <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <button
                className={`focus:outline-none transform transition-transform duration-200 hover:scale-110 ${isRepeatActive ? 'text-green-500' : isDarkMode ? 'text-white' : 'text-black'}`}
                onClick={handleRepeat}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={isExpanded ? 40 : 25} height={isExpanded ? 50 : 25} viewBox="0 0 24 24">
                  <path fill="currentColor" d="m7 22l-4-4l4-4l1.4 1.45L6.85 17H17v-4h2v6H6.85l1.55 1.55L7 22ZM5 11V5h12.15L15.6 3.45L17 2l4 4l-4 4l-1.4-1.45L17.15 7H7v4H5Z" />
                </svg>
              </button>
              <button
                className={`focus:outline-none transform transition-transform duration-200 hover:scale-110 ${isDarkMode ? 'text-white' : 'text-black'}`}
                onClick={handleBack}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={isExpanded ? 40 : 25} height={isExpanded ? 50 : 25} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3.885 21.06a.76.76 0 0 1-.75-.75V3.69a.75.75 0 0 1 1.5 0v16.6a.75.75 0 0 1-.75.77m16.98-15.713v13.25a2.35 2.35 0 0 1-.32 1.13a2.2 2.2 0 0 1-1.89 1.07h-.1a2.089 2.089 0 0 1-1.11-.36l-9.13-6.12a2.25 2.25 0 0 1-.71-.76a2.29 2.29 0 0 1-.27-1a2.18 2.18 0 0 1 .2-1a2.22 2.22 0 0 1 .64-.81l9.14-7.09a2.22 2.22 0 0 1 1.13-.44a2.2 2.2 0 0 1 2.09 1.02c.204.335.318.718.33 1.11" />
                </svg>
              </button>
              <button
                className={`focus:outline-none transform transition-transform duration-200 hover:scale-110 ${isDarkMode ? 'text-white' : 'text-black'}`}
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width={isExpanded ? 40 : 25} height={isExpanded ? 50 : 25} viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 1 1 0-13a6.5 6.5 0 0 1 0 13zM5 5h2v6H5zm4 0h2v6H9z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width={isExpanded ? 40 : 25} height={isExpanded ? 50 : 25} viewBox="0 0 48 48">
                    <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
                      <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
                      <path d="M20 24v-6.928l6 3.464L32 24l-6 3.464l-6 3.464V24Z" />
                    </g>
                  </svg>
                )}
              </button>
              <button
                className={`focus:outline-none transform transition-transform duration-200 hover:scale-110 ${isDarkMode ? 'text-white' : 'text-black'}`}
                onClick={handleNext}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={isExpanded ? 40 : 25} height={isExpanded ? 50 : 25} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20.095 21a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 1.5 0v16.5a.74.74 0 0 1-.75.75m-3.4-9.589a2.25 2.25 0 0 1-.85 1.82l-9.11 7.09c-.326.247-.713.4-1.12.44h-.23a2.142 2.142 0 0 1-1-.22a2.201 2.201 0 0 1-.9-.81a2.17 2.17 0 0 1-.33-1.16V5.421a2.22 2.22 0 0 1 .31-1.12a2.25 2.25 0 0 1 .85-.8a2.18 2.18 0 0 1 2.24.1l9.12 6.08c.29.191.53.448.7.75a2.3 2.3 0 0 1 .32.98" />
                </svg>
              </button>
              <button
               className={`focus:outline-none transform transition-transform duration-200 hover:scale-110 ${isShuffleActive ? 'text-green-500' : isDarkMode ? 'text-white' : 'text-black'}`}
               onClick={handleShuffle}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width={isExpanded ? 40 : 25} height={isExpanded ? 50 : 25} viewBox="0 0 24 24">
                 <path fill="currentColor" d="M14 20v-2h2.6l-3.2-3.2l1.425-1.425L18 16.55V14h2v6h-6Zm-8.6 0L4 18.6L16.6 6H14V4h6v6h-2V7.4L5.4 20Zm3.775-9.425L4 5.4L5.4 4l5.175 5.175l-1.4 1.4Z" />
               </svg>
             </button>
             <div className="flex items-center space-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={isDarkMode ? 'text-white' : 'text-black'}>
                 <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
               </svg>
               <input
                 type="range"
                 min="0"
                 max="1"
                 step="0.01"
                 value={volume}
                 onChange={handleVolumeChange}
                 className="w-10 appearance-none h-1 bg-gray-300 rounded outline-none opacity-70 transition-opacity duration-200 hover:opacity-100"
               />
             </div>
           </div>
         </div>
       </div>
     ) : (
       <p className={`${isDarkMode ? 'text-white' : 'text-black'} text-lg`}>Select a song to see player.</p>
     )}

     <audio ref={audioRef} onEnded={handleNext} />

     <button
       className={`absolute bottom-2 right-2 p-2 ${isDarkMode ? 'text-white' : 'text-black'}`}
       onClick={handleExpand}
     >
       {isExpanded ? (
         <svg xmlns="http://www.w3.org/2000/svg" width={isExpanded ? 20 : 15} height={isExpanded ? 20 : 15} viewBox="0 0 24 24">
           <path fill="currentColor" d="M16.121 6.465L14 4.344V10h5.656l-2.121-2.121l3.172-3.172l-1.414-1.414zM4.707 3.293L3.293 4.707l3.172 3.172L4.344 10H10V4.344L7.879 6.465zM19.656 14H14v5.656l2.121-2.121l3.172 3.172l1.414-1.414l-3.172-3.172zM6.465 16.121l-3.172 3.172l1.414 1.414l3.172-3.172L10 19.656V14H4.344z" />
         </svg>
       ) : (
         <svg xmlns="http://www.w3.org/2000/svg" width={isExpanded ? 20 : 15} height={isExpanded ? 20 : 15} viewBox="0 0 24 24">
           <path fill="currentColor" fillRule="evenodd" d="M6 4.75c-.69 0-1.25.56-1.25 1.25v3a.75.75 0 0 1-1.5 0V6A2.75 2.75 0 0 1 6 3.25h3a.75.75 0 0 1 0 1.5zM14.25 4a.75.75 0 0 1 .75-.75h3A2.75 2.75 0 0 1 20.75 6v3a.75.75 0 0 1-1.5 0V6c0-.69-.56-1.25-1.25-1.25h-3a.75.75 0 0 1-.75-.75M4 14.25a.75.75 0 0 1 .75.75v3c0 .69.56 1.25 1.25 1.25h3a.75.75 0 0 1 0 1.5H6A2.75 2.75 0 0 1 3.25 18v-3a.75.75 0 0 1 .75-.75m16 0a.75.75 0 0 1 .75.75v3A2.75 2.75 0 0 1 18 20.75h-3a.75.75 0 0 1 0-1.5h3c.69 0 1.25-.56 1.25-1.25v-3a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
         </svg>
       )}
     </button>
   </div>
 );
};

export default Player;