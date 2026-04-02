import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 60;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

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
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      const head = snake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return;
      }

      // Check collision with self
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const timeoutId = setTimeout(moveSnake, GAME_SPEED);
    return () => clearTimeout(timeoutId);
  }, [snake, food, isGameOver, isPaused, score, onScoreChange, generateFood]);

  return (
    <div className="relative">
      <div 
        className="grid bg-black border-2 border-[#00fff9] w-[90vw] max-w-[400px] aspect-square"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          
          const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
          const isSnakeHead = snakeIndex === 0;
          const isSnakeBody = snakeIndex > 0;
          const isFood = food.x === x && food.y === y;

          let opacity = 1;
          if (isSnakeBody) {
            opacity = Math.max(0.15, 1 - (snakeIndex / snake.length));
          }

          return (
            <div
              key={index}
              className={`
                w-full h-full border-[1px] border-[#00fff9]/10
                ${isSnakeHead ? 'bg-[#00fff9] shadow-[0_0_15px_#00fff9] z-10' : ''}
                ${isSnakeBody ? 'bg-[#00fff9] shadow-[0_0_10px_#00fff9]' : ''}
                ${isFood ? 'bg-[#ff00c1] shadow-[0_0_15px_#ff00c1] animate-pulse' : ''}
              `}
              style={{ opacity: isSnakeBody ? opacity : 1 }}
            />
          );
        })}
      </div>

      {isGameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-2 border-[#ff00c1]">
          <h2 
            className="text-5xl md:text-6xl font-glitch text-[#ff00c1] drop-shadow-[0_0_15px_#ff00c1] mb-4 glitch-text inline-block uppercase"
            data-text="CRITICAL_ERR"
          >
            CRITICAL_ERR
          </h2>
          <p 
            className="text-3xl font-digital text-[#00fff9] mb-6 glitch-text inline-block uppercase" 
            data-text={`YIELD: ${score}`}
          >
            YIELD: {score}
          </p>
          <button 
            onClick={resetGame}
            className="px-6 py-2 bg-black border-2 border-[#00fff9] text-[#00fff9] font-digital text-3xl hover:bg-[#00fff9] hover:text-black hover:shadow-[0_0_20px_#00fff9] transition-all duration-100 uppercase"
          >
            REBOOT.SEQ
          </button>
        </div>
      )}

      {isPaused && !isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 border-2 border-[#00fff9]">
          <h2 
            className="text-5xl md:text-6xl font-glitch text-[#00fff9] tracking-widest drop-shadow-[0_0_15px_#00fff9] glitch-text inline-block uppercase"
            data-text="SYS.HALT"
          >
            SYS.HALT
          </h2>
        </div>
      )}
    </div>
  );
}
