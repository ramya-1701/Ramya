/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import NeonBackground from './components/NeonBackground';
import { Terminal, Github, Disc, Cpu, Activity, Layout } from 'lucide-react';
import { SONGS } from './constants';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const song = SONGS[currentSongIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSongIndex]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    setProgress(0);
  };
  const handleBack = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setProgress(0);
  };

  return (
    <div className="h-screen w-full bg-sleek-black text-gray-100 flex flex-col font-sans overflow-hidden border border-neon-blue/30 relative">
      <NeonBackground />
      
      {/* Top Navigation / Status Bar */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-sleek-gray z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-blue-600 rounded-md shadow-neon-blue"></div>
          <h1 className="text-xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-blue-400">
            NEON SYNTH-SNAKE
          </h1>
        </div>
        
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Current Score</p>
            <p className="text-2xl font-mono text-neon-blue leading-none">{score.toString().padStart(5, '0')}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">High Score</p>
            <p className="text-2xl font-mono text-neon-pink leading-none">{highScore.toString().padStart(5, '0')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-mono">
            v2.04.1-STABLE
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden z-0">
        {/* Left Sidebar: Playlist */}
        <aside className="w-64 border-r border-white/5 bg-sleek-sidebar flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Disc className="w-4 h-4 text-gray-500" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Playlist</h2>
            </div>
            <div className="space-y-3">
              {SONGS.map((s, idx) => (
                <div 
                  key={s.id}
                  onClick={() => {
                    setCurrentSongIndex(idx);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className={`group cursor-pointer p-3 rounded-lg border transition-all ${
                    currentSongIndex === idx 
                    ? 'bg-neon-blue/10 border-neon-blue/20' 
                    : 'hover:bg-white/5 border-transparent'
                  }`}
                >
                  <p className={`text-sm font-medium ${currentSongIndex === idx ? 'text-neon-blue' : 'text-gray-300'}`}>
                    {s.title}
                  </p>
                  <p className={`text-xs ${currentSongIndex === idx ? 'text-neon-blue/60' : 'text-gray-500'}`}>
                    {s.artist} • {s.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600">
                <span className="text-[10px] font-mono">VIS</span>
              </div>
              <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-neon-blue"
                  animate={{ width: isPlaying ? ['20%', '80%', '40%', '60%'] : '30%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Game Window */}
        <section className="flex-1 flex flex-col bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.05)_0%,_transparent_100%)]">
          <div className="flex-1 flex items-center justify-center p-8">
            <SnakeGame onScoreUpdate={setScore} onHighScoreUpdate={setHighScore} />
          </div>
        </section>

        {/* Right Sidebar: Stats/Visuals */}
        <aside className="w-72 border-l border-white/5 bg-sleek-sidebar flex flex-col p-6">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-4 h-4 text-gray-500" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Game Engine</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] mb-2 uppercase tracking-tight">
                <span className="text-gray-400">Difficulty Level</span>
                <span className="text-neon-pink">Insane</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-neon-pink to-neon-purple"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Multiplier</p>
                <p className="text-xl font-bold text-white font-mono">x4.5</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Lives</p>
                <p className="text-xl font-bold text-white font-mono">03</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-gray-500" />
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Input Log</h3>
              </div>
              <div className="font-mono text-[9px] text-neon-blue/50 space-y-1.5 bg-black/30 p-3 rounded-lg border border-white/5">
                <p className="animate-pulse">{`> Tick: ${Math.floor(Date.now() / 1000).toString().slice(-4)} | Pos: 12,32`}</p>
                <p>{`> Input: IDLE`}</p>
                <p>{`> Collision: FALSE`}</p>
                <p>{`> Audio_Sync: OK`}</p>
                <p className="text-neon-pink/40 animate-pulse">{`> Memory: ${Math.floor(Math.random() * 100)}MB / 512MB`}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-center gap-2 opacity-20 hover:opacity-50 transition-opacity">
            <Layout className="w-3 h-3" />
            <span className="text-[8px] font-mono uppercase tracking-[0.3em]">Neural Interface v2</span>
          </div>
        </aside>
      </main>

      {/* Bottom Bar: Player Controls */}
      <footer className="h-24 border-t border-white/10 bg-sleek-gray flex items-center px-8 gap-8 z-10">
        <div className="w-64 flex items-center gap-4">
          <motion.div 
            key={song.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 bg-neon-blue/20 rounded-lg flex items-center justify-center overflow-hidden border border-neon-blue/30 relative group"
          >
            <Disc className={`w-8 h-8 text-neon-blue/40 ${isPlaying ? "animate-spin" : ""}`} />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1 h-1 bg-neon-blue rounded-full" />
              </div>
            )}
          </motion.div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-white">{song.title}</p>
            <p className="text-xs text-gray-500 truncate">{song.artist}</p>
          </div>
        </div>

        <MusicPlayer 
          isPlaying={isPlaying} 
          song={song} 
          progress={progress}
          onTogglePlay={handleTogglePlay}
          onNext={handleNext}
          onBack={handleBack}
          layout="footer"
        />

        <div className="w-64 flex justify-end items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5 items-end h-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1 rounded-t-sm ${i > 2 ? 'bg-neon-blue' : 'bg-gray-700'}`}
                  animate={{ height: isPlaying ? [4, 12, 6, 16, 4][i] : 4 }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Audio Viz</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
