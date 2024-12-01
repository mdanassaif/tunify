'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Music, Image, X, Clock } from 'lucide-react';

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

  const FileInput = ({ 
    icon: Icon, 
    label, 
    accept, 
    onChange, 
    fileName 
  }: { 
    icon: React.ElementType, 
    label: string, 
    accept: string, 
    onChange: (file: File | null) => void,
    fileName?: string 
  }) => (
    <div className="mb-4">
      <div className={`
        flex items-center border-2 rounded-lg p-3 transition-all duration-300
        ${isDarkMode 
          ? 'border-gray-600 hover:border-green-500' 
          : 'border-gray-300 hover:border-green-400'
        } ${fileName ? 'border-green-500' : ''}
      `}>
        <Icon className={`mr-3 ${fileName ? 'text-green-500' : 'text-gray-500'}`} />
        <label className="flex-grow cursor-pointer">
          {fileName ? (
            <span className="text-sm text-green-600 truncate">{fileName}</span>
          ) : (
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {label}
            </span>
          )}
          <input
            type="file"
            accept={accept}
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            className="hidden"
            required
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`
        relative w-[500px] p-8 rounded-2xl shadow-2xl transform transition-all duration-300 
        ${isDarkMode 
          ? 'bg-gray-900 text-white border border-gray-700' 
          : 'bg-white text-black border border-gray-200'}
        hover:scale-[1.02]
      `}>
        <button 
          onClick={onClose} 
          className={`
            absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200/20 transition-colors
            ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600'}
          `}
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className={`
            text-3xl font-bold mb-2 
            ${isDarkMode ? 'text-green-300' : 'text-green-600'}
          `}>
            Upload New Song
          </h2>
          <p className={`
            text-sm 
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
          `}>
            Share your favorite music with the world
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-4 flex items-center">
            <span className="ml-2">{error}</span>
          </div>
        )}

        {!canUpload && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-600 p-3 rounded-lg mb-4 flex items-center">
            <Clock className="mr-2" />
            <span>Next upload available in: {formatTime(remainingTime)}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`
              w-full p-3 rounded-lg border-2 transition-all duration-300
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700 focus:border-green-500' 
                : 'bg-gray-50 border-gray-300 focus:border-green-400'}
            `}
            required
          />

          <input
            type="text"
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className={`
              w-full p-3 rounded-lg border-2 transition-all duration-300
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700 focus:border-green-500' 
                : 'bg-gray-50 border-gray-300 focus:border-green-400'}
            `}
            required
          />

          <FileInput 
            icon={Image} 
            label="Choose Cover Image" 
            accept="image/*" 
            onChange={setCoverFile}
            fileName={coverFile?.name}
          />

          <FileInput 
            icon={Music} 
            label="Select MP3 File" 
            accept="audio/mp3" 
            onChange={setAudioFile}
            fileName={audioFile?.name}
          />

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`
                flex-1 p-3 rounded-lg transition-all duration-300
                ${isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'}
              `}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !canUpload}
              className={`
                flex-1 p-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300
                ${!canUpload 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : (isUploading 
                    ? 'bg-green-400' 
                    : 'bg-green-600 text-white hover:bg-green-700')}
              `}
            >
              <Upload size={20} />
              <span>
                {!canUpload 
                  ? `Wait ${formatTime(remainingTime)}` 
                  : (isUploading ? 'Uploading...' : 'Upload Song')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongUploadModal;