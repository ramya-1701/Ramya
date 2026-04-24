import { useCallback, useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ 
  onScoreUpdate, 
  onHighScoreUpdate 
}: { 
  onScoreUpdate: (s: number) => void; 
  onHighScoreUpdate: (s: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    onScoreUpdate(0);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const intervalId = setInterval(() => {
      setSnake(currentSnake => {
        const head = { x: currentSnake[0].x + direction.x, y: currentSnake[0].y + direction.y };

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPaused(true);
          return currentSnake;
        }

        // Self collision
        if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setIsPaused(true);
          return currentSnake;
        }

        const newSnake = [head, ...currentSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => {
            const newScore = prev + 10;
            onScoreUpdate(newScore);
            return newScore;
          });
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood, onScoreUpdate]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      onHighScoreUpdate(score);
    }
  }, [score, highScore, onHighScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#22d3ee' : 'rgba(34, 211, 238, 0.6)';
      ctx.shadowBlur = index === 0 ? 10 : 0;
      ctx.shadowColor = '#22d3ee';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      ctx.shadowBlur = 0;
    });

    // Draw Food
    ctx.fillStyle = '#ec4899';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ec4899';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="relative w-[520px] h-[480px] bg-black border-2 border-neon-blue/20 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black shadow-2xl"
        />
        
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-display neon-text-pink mb-6">TERMINATED</h2>
                <button
                  onClick={resetGame}
                  className="px-10 py-4 bg-neon-pink text-white font-bold rounded-full hover:scale-105 transition-all shadow-neon-pink uppercase tracking-widest text-sm"
                >
                  Reboot System
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsPaused(false)}
                className="px-10 py-4 bg-neon-blue text-black font-bold rounded-full hover:scale-105 transition-all shadow-neon-blue uppercase tracking-widest text-sm"
              >
                Initiate Sequence
              </button>
            )}
          </div>
        )}

        {/* HUD Elements */}
        <div className="absolute bottom-4 left-4 flex gap-3">
          <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] text-gray-400 uppercase font-mono">Manual_Link</span>
          <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] text-gray-400 uppercase font-mono">60_FPS</span>
        </div>
      </div>
      
      {/* Controls Legend */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
        <span>[Arrow Keys] to modulate direction</span>
      </div>
    </div>
  );
}
