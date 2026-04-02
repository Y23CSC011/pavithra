import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00fff9] font-digital flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#ff00c1]/50">
      <div className="static-noise"></div>
      <div className="scanlines"></div>

      {/* Header */}
      <header className="z-10 mb-6 text-center flex flex-col items-center">
        <h1 
          className="text-7xl md:text-8xl font-glitch tracking-widest text-[#00fff9] drop-shadow-[0_0_15px_#00fff9] mb-2 glitch-text inline-block uppercase"
          data-text="SYS.SNAKE_EXE"
        >
          SYS.SNAKE_EXE
        </h1>
        <div 
          className="text-4xl md:text-5xl font-digital text-[#ff00c1] drop-shadow-[0_0_8px_#ff00c1] tracking-widest glitch-text inline-block uppercase"
          data-text={`DATA.YIELD: ${score.toString().padStart(4, '0')}`}
        >
          DATA.YIELD: {score.toString().padStart(4, '0')}
        </div>
      </header>

      {/* Game Container */}
      <div className="z-10 border-4 border-[#ff00c1] p-1 shadow-[0_0_20px_#ff00c1] bg-black mb-8 relative">
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-[#00fff9]"></div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-[#00fff9]"></div>
        <SnakeGame onScoreChange={setScore} />
      </div>

      {/* Music Player */}
      <div className="z-10 w-full max-w-md border-2 border-[#00fff9] shadow-[0_0_15px_#00fff9] bg-black p-1">
        <MusicPlayer />
      </div>
      
      {/* Instructions */}
      <div className="z-10 mt-8 text-[#00fff9]/70 text-xl text-center max-w-md font-digital uppercase tracking-widest">
        <p>INPUT.VECTOR: <kbd className="border border-[#ff00c1] px-2 text-[#ff00c1] shadow-[0_0_5px_#ff00c1]">W A S D</kbd></p>
        <p className="mt-2">INTERRUPT: <kbd className="border border-[#ff00c1] px-2 text-[#ff00c1] shadow-[0_0_5px_#ff00c1]">SPACE</kbd></p>
      </div>
    </div>
  );
}
