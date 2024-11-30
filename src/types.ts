// In types.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;  
  audioUrl: string;  
}

export interface onSongUpload{
  title: string;
    artist: string;
    coverFile: File | null;
    audioFile: File | null;
    

}