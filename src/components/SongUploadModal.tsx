'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface SongUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSongUpload: (newSong: {
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl: string;
  }) => void;
}

const SongUploadModal: React.FC<SongUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSongUpload 
}) => {
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  // New state for upload timeout
  const [canUpload, setCanUpload] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Check if there's a previous upload timestamp
    const lastUploadTime = localStorage.getItem('lastSongUploadTime');
    
    if (lastUploadTime) {
      const timeSinceLastUpload = Date.now() - parseInt(lastUploadTime);
      const UPLOAD_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
      
      if (timeSinceLastUpload < UPLOAD_TIMEOUT) {
        setCanUpload(false);
        startCountdown(UPLOAD_TIMEOUT - timeSinceLastUpload);
      }
    }
  }, []);

  const startCountdown = (remainingMs: number) => {
    setRemainingTime(Math.ceil(remainingMs / 1000));
    
    const countdownInterval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCanUpload(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validateFiles = () => {
    // Validate file types and sizes
    if (!coverFile || !audioFile) {
      setError('Please select both cover and audio files');
      return false;
    }

    // Validate image file
    if (!coverFile.type.startsWith('image/')) {
      setError('Cover file must be an image');
      return false;
    }

    // Validate audio file
    if (audioFile.type !== 'audio/mpeg') {
      setError('Audio file must be an MP3');
      return false;
    }

    // File size checks (optional)
    const MAX_COVER_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB

    if (coverFile.size > MAX_COVER_SIZE) {
      setError('Cover image must be less than 10MB');
      return false;
    }

    if (audioFile.size > MAX_AUDIO_SIZE) {
      setError('Audio file must be less than 50MB');
      return false;
    }

    return true;
  };

  const handleFileUpload = async () => {
    if (!validateFiles()) return null;
  
    try {
      // Generate unique filenames with extensions
      const coverFileName = `${uuidv4()}-cover.${coverFile!.name.split('.').pop()}`;
      const audioFileName = `${uuidv4()}-audio.${audioFile!.name.split('.').pop()}`;
  
      // Upload cover image
      const { data: coverUploadData, error: coverUploadError } = await supabase.storage
        .from('song-covers')
        .upload(coverFileName, coverFile!, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (coverUploadError) throw coverUploadError;
  
      // Construct public URL for cover
      const coverUrl = supabase.storage.from('song-covers').getPublicUrl(coverFileName).data.publicUrl;
  
      // Upload audio file
      const { data: audioUploadData, error: audioUploadError } = await supabase.storage
        .from('song-audios')
        .upload(audioFileName, audioFile!, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (audioUploadError) throw audioUploadError;
  
      // Construct public URL for audio
      const audioUrl = supabase.storage.from('song-audios').getPublicUrl(audioFileName).data.publicUrl;
  
      return {
        coverUrl,
        audioUrl
      };
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check upload timeout
    if (!canUpload) {
      setError('Please wait before uploading another song');
      return;
    }

    setError('');
    setIsUploading(true);

    // Validate inputs
    if (!title.trim()) {
      setError('Please enter a song title');
      setIsUploading(false);
      return;
    }

    if (!artist.trim()) {
      setError('Please enter the artist name');
      setIsUploading(false);
      return;
    }

    try {
      // Upload files to Supabase
      const uploadedFiles = await handleFileUpload();
      
      if (!uploadedFiles) {
        setIsUploading(false);
        return;
      }

      // Save song metadata to Supabase
      const { data, error } = await supabase
        .from('songs')
        .insert([{
          title,
          artist,
          cover_url: uploadedFiles.coverUrl,
          audio_url: uploadedFiles.audioUrl
        }])
        .select();

      if (error) throw error;

      // Set last upload time
      localStorage.setItem('lastSongUploadTime', Date.now().toString());
      setCanUpload(false);
      startCountdown(60 * 60 * 1000);

      // Call parent component's upload handler
      onSongUpload({
        title,
        artist,
        coverUrl: uploadedFiles.coverUrl,
        audioUrl: uploadedFiles.audioUrl
      });

      // Reset form
      setTitle('');
      setArtist('');
      setCoverFile(null);
      setAudioFile(null);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to upload song');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-96 p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl font-bold mb-4">Upload New Song</h2>
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">
            {error}
          </div>
        )}
        {!canUpload && (
          <div className="bg-yellow-500 text-white p-2 rounded mb-4">
            Next upload available in: {formatTime(remainingTime)}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Song Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Artist Name</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Audio File (MP3)</label>
            <input
              type="file"
              accept="audio/mp3"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !canUpload}
              className={`px-4 py-2 rounded ${
                !canUpload 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : (isUploading 
                    ? 'bg-gray-400' 
                    : 'bg-green-500 text-white hover:bg-green-600')
              }`}
            >
              {!canUpload 
                ? `Wait ${formatTime(remainingTime)}` 
                : (isUploading ? 'Uploading...' : 'Upload Song')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongUploadModal;