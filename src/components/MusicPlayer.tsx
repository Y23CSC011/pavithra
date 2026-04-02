import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Neon Dreams", artist: "AI Synth Alpha", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Cybernetic Pulse", artist: "AI Synth Beta", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Digital Horizon", artist: "AI Synth Gamma", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="bg-black border-2 border-[#ff00c1] p-4 shadow-[0_0_15px_#ff00c1] w-full font-digital uppercase relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00fff9] animate-pulse"></div>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-[#00fff9] shrink-0 shadow-[0_0_10px_#00fff9]">
            <Music className={`w-6 h-6 text-[#00fff9] drop-shadow-[0_0_5px_currentColor] ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[#ff00c1] font-bold text-xl truncate w-32 sm:w-40 drop-shadow-[0_0_5px_#ff00c1] glitch-text" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
            <p className="text-[#00fff9] text-lg truncate drop-shadow-[0_0_2px_#00fff9]">ID: {currentTrack.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={playPrev} className="p-2 text-[#ff00c1] hover:text-white hover:bg-[#ff00c1] border border-transparent hover:border-[#ff00c1] transition-all shadow-[0_0_5px_#ff00c1]">
            <SkipBack className="w-6 h-6 drop-shadow-[0_0_5px_currentColor]" />
          </button>
          <button 
            onClick={togglePlay} 
            className="p-3 bg-black text-[#00fff9] border-2 border-[#00fff9] hover:bg-[#00fff9] hover:text-black shadow-[0_0_10px_#00fff9] transition-all"
          >
            {isPlaying ? <Pause className="w-8 h-8 drop-shadow-[0_0_5px_currentColor]" /> : <Play className="w-8 h-8 ml-1 drop-shadow-[0_0_5px_currentColor]" />}
          </button>
          <button onClick={playNext} className="p-2 text-[#ff00c1] hover:text-white hover:bg-[#ff00c1] border border-transparent hover:border-[#ff00c1] transition-all shadow-[0_0_5px_#ff00c1]">
            <SkipForward className="w-6 h-6 drop-shadow-[0_0_5px_currentColor]" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-3 bg-black border border-[#00fff9] cursor-pointer overflow-hidden mb-4 relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-[#ff00c1] shadow-[0_0_10px_#ff00c1] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 pointer-events-none"></div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#00fff9] hover:text-[#ff00c1] transition-colors drop-shadow-[0_0_5px_currentColor]">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-32 h-2 bg-black border border-[#00fff9] appearance-none cursor-pointer accent-[#ff00c1]"
          style={{ boxShadow: '0 0 5px #00fff9' }}
        />
      </div>
    </div>
  );
}
