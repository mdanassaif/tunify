'use client';

import React, { useState } from 'react';
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
  onSongUpload,
}) => {
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [canUpload, setCanUpload] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'youtube'>('file');

  const UPLOAD_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 'f512db5188msh3cb65e2d58aba6cp19f253jsn712920efafe7';

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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validateInputs = () => {
    if (!title.trim()) {
      setError('Song title is required');
      return false;
    }
    if (!artist.trim()) {
      setError('Artist name is required');
      return false;
    }
    if (uploadMethod === 'file') {
      if (!coverFile || !audioFile) {
        setError('Please select both cover and audio files');
        return false;
      }
      if (!coverFile.type.startsWith('image/')) {
        setError('Cover file must be an image');
        return false;
      }
      if (audioFile.type !== 'audio/mpeg') {
        setError('Audio file must be an MP3');
        return false;
      }
      const MAX_COVER_SIZE = 10 * 1024 * 1024;
      const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
      if (coverFile.size > MAX_COVER_SIZE) {
        setError('Cover image must be less than 10MB');
        return false;
      }
      if (audioFile.size > MAX_AUDIO_SIZE) {
        setError('Audio file must be less than 50MB');
        return false;
      }
    } else if (uploadMethod === 'youtube') {
      if (!youtubeUrl.trim() || !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(youtubeUrl)) {
        setError('Please enter a valid YouTube URL');
        return false;
      }
      if (!coverFile) {
        setError('Please select a cover image for the YouTube song');
        return false;
      }
    }
    return true;
  };

  const pollAudioStatus = async (id: string): Promise<string> => {
    const maxAttempts = 30; // ~1 minute with 2-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`https://youtube-to-mp315.p.rapidapi.com/status/${id}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': 'youtube-to-mp315.p.rapidapi.com',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to check audio status');

      if (data.status === 'AVAILABLE') {
        return data.downloadUrl;
      } else if (data.status === 'CONVERSION_ERROR') {
        throw new Error('YouTube conversion failed');
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
    }

    throw new Error('YouTube conversion timed out');
  };

  const handleFileUpload = async () => {
    if (!validateInputs()) return null;

    setIsUploading(true);
    try {
      // Upload cover image to Supabase
      const coverFileName = `${uuidv4()}-cover.${coverFile!.name.split('.').pop()}`;
      const { error: coverUploadError } = await supabase.storage
        .from('song-covers')
        .upload(coverFileName, coverFile!, { cacheControl: '3600', upsert: false });
      if (coverUploadError) throw new Error(`Cover upload failed: ${coverUploadError.message}`);
      const coverUrl = supabase.storage.from('song-covers').getPublicUrl(coverFileName).data.publicUrl;

      let audioUrl = '';
      if (uploadMethod === 'file') {
        const audioFileName = `${uuidv4()}-audio.${audioFile!.name.split('.').pop()}`;
        const { error: audioUploadError } = await supabase.storage
          .from('song-audios')
          .upload(audioFileName, audioFile!, { cacheControl: '3600', upsert: false });
        if (audioUploadError) throw new Error(`Audio upload failed: ${audioUploadError.message}`);
        audioUrl = supabase.storage.from('song-audios').getPublicUrl(audioFileName).data.publicUrl;
      } else if (uploadMethod === 'youtube') {
        const response = await fetch(
          `https://youtube-to-mp315.p.rapidapi.com/download?url=${encodeURIComponent(youtubeUrl)}&format=mp3`,
          {
            method: 'POST',
            headers: {
              'X-RapidAPI-Host': 'youtube-to-mp315.p.rapidapi.com',
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to initiate YouTube conversion');

        let downloadUrl: string;
        if (data.status === 'AVAILABLE') {
          downloadUrl = data.downloadUrl;
        } else if (data.status === 'CONVERTING') {
          downloadUrl = await pollAudioStatus(data.id);
        } else {
          throw new Error(`YouTube conversion failed: ${data.status}`);
        }

        const proxyResponse = await fetch('/api/proxy-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: downloadUrl }),
        });

        if (!proxyResponse.ok) {
          const errorData = await proxyResponse.json();
          throw new Error(`Proxy fetch failed: ${errorData.error}`);
        }

        const audioBlob = await proxyResponse.blob();
        const audioFileName = `${uuidv4()}-audio.mp3`;
        const { error: audioUploadError } = await supabase.storage
          .from('song-audios')
          .upload(audioFileName, audioBlob, { cacheControl: '3600', upsert: false });
        if (audioUploadError) throw new Error(`Audio upload failed: ${audioUploadError.message}`);
        audioUrl = supabase.storage.from('song-audios').getPublicUrl(audioFileName).data.publicUrl;
      }

      return { coverUrl, audioUrl };
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpload) {
      setError('Please wait before uploading another song');
      return;
    }

    setError('');
    const uploadedFiles = await handleFileUpload();
    if (!uploadedFiles) return;

    try {
      const { error } = await supabase
        .from('songs')
        .insert([{ title, artist, cover_url: uploadedFiles.coverUrl, audio_url: uploadedFiles.audioUrl }])
        .select();
      if (error) throw new Error(`Database insert failed: ${error.message}`);

      setCanUpload(false);
      startCountdown(UPLOAD_TIMEOUT);
      onSongUpload({
        title,
        artist,
        coverUrl: uploadedFiles.coverUrl,
        audioUrl: uploadedFiles.audioUrl,
      });

      setTitle('');
      setArtist('');
      setCoverFile(null);
      setAudioFile(null);
      setYoutubeUrl('');
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError(`Failed to save song: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}
        >
          Upload a Song
        </h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setUploadMethod('file')}
            className={`px-3 py-1 rounded-md ${
              uploadMethod === 'file'
                ? 'bg-green-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload Files
          </button>
          <button
            onClick={() => setUploadMethod('youtube')}
            className={`px-3 py-1 rounded-md ${
              uploadMethod === 'youtube'
                ? 'bg-green-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            YouTube Link
          </button>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-2 rounded-md mb-4">{error}</div>
        )}
        {!canUpload && (
          <div className="bg-yellow-500 text-white p-2 rounded-md mb-4">
            Next upload in: {formatTime(remainingTime)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Song Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 rounded-md border2 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-black'
              }`}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Artist Name</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)} // Fixed: now updates artist state
              className={`w-full p-2 rounded-md border2 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-black'
              }`}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'
              }`}
              required
            />
          </div>
          {uploadMethod === 'file' ? (
            <div>
              <label className="block mb-1 text-sm font-medium">Audio File (MP3)</label>
              <input
                type="file"
                accept="audio/mpeg"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className={`w-full p-2 rounded-md ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'
                }`}
                required
              />
            </div>
          ) : (
            <div>
              <label className="block mb-1 text-sm font-medium">YouTube URL</label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full p-2 rounded-md border2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-black'
                }`}
                required
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                isDarkMode
                  ? 'bg-gray-600 hover:bg-gray-500'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !canUpload}
              className={`px-4 py-2 rounded-md ${
                isUploading || !canUpload
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isUploading ? 'Uploading...' : !canUpload ? `Wait ${formatTime(remainingTime)}` : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongUploadModal;