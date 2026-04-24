import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';

interface MusicPlayerProps {
  isPlaying: boolean;
  song: {
    id: string;
    title: string;
    artist: string;
    duration: string;
    color: string;
  };
  progress: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onBack: () => void;
  layout?: 'card' | 'footer';
}

export default function MusicPlayer({ 
  isPlaying, 
  song, 
  progress, 
  onTogglePlay, 
  onNext, 
  onBack,
  layout = 'card'
}: MusicPlayerProps) {
  
  if (layout === 'footer') {
    return (
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-white transition-colors active:scale-90"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          <button 
            onClick={onNext}
            className="text-gray-500 hover:text-white transition-colors active:scale-90"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-w-lg flex items-center gap-4">
          <span className="text-[10px] text-gray-500 font-mono w-8 text-right">
            0:{Math.floor((progress / 100) * 225).toString().padStart(2, '0')}
          </span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-neon-blue shadow-neon-blue"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 font-mono w-8">
            {song.duration}
          </span>
        </div>
      </div>
    );
  }

  // Original card layout (not used in current version of App but kept for completeness/functionality preservation)
  return (
    <div className="w-full glass-morphism rounded-3xl neon-border-pink p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-pink/10 to-transparent pointer-events-none" />
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
          <Play className="w-6 h-6 text-neon-pink" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-display text-white">{song.title}</h3>
          <p className="text-sm text-gray-400">{song.artist}</p>
        </div>
      </div>
    </div>
  );
}
