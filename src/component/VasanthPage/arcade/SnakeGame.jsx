import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../soundEngine';

const GRID_SIZE = 16;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 }
];
const INITIAL_DIR = { x: 1, y: 0 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 12, y: 8 });
  const [direction, setDirection] = useState(INITIAL_DIR);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dirRef = useRef(INITIAL_DIR);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIR;
    setDirection(INITIAL_DIR);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnFood(INITIAL_SNAKE);
    playSound('click');
  };

  const spawnFood = (currentSnake) => {
    let newFood;
    while (!newFood || currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    }
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      let newDir = null;
      if (e.key === 'ArrowUp' || e.key === 'w') newDir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' || e.key === 's') newDir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' || e.key === 'a') newDir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' || e.key === 'd') newDir = { x: 1, y: 0 };

      if (newDir) {
        // Prevent 180 reverse
        if (newDir.x !== -dirRef.current.x || newDir.y !== -dirRef.current.y) {
          dirRef.current = newDir;
          setDirection(newDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = {
          x: (prev[0].x + dirRef.current.x + GRID_SIZE) % GRID_SIZE,
          y: (prev[0].y + dirRef.current.y + GRID_SIZE) % GRID_SIZE
        };

        // Self-collision
        if (prev.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          playSound('fail');
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          playSound('score');
          spawnFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [food, gameOver, isPaused]);

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '256px', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
        <span>🍎 Score: <b style={{ color: 'var(--accent)' }}>{score}</b></span>
        <div>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            style={{
              background: 'var(--canvas-base)',
              color: 'var(--ink)',
              border: '1px solid var(--border)',
              padding: '2px 6px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '6px'
            }}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            onClick={resetGame}
            style={{
              background: 'var(--canvas-base)',
              color: 'var(--ink)',
              border: '1px solid var(--border)',
              padding: '2px 6px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        style={{
          width: '256px',
          height: '256px',
          background: 'var(--canvas-base)',
          border: '1.5px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          position: 'relative'
        }}
      >
        {snake.map((seg, i) => (
          <div
            key={i}
            style={{
              gridColumnStart: seg.x + 1,
              gridRowStart: seg.y + 1,
              background: i === 0 ? 'var(--accent)' : 'var(--ink-muted)',
              borderRadius: i === 0 ? '4px' : '2px'
            }}
          />
        ))}

        <div
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            background: '#f38ba8',
            borderRadius: '50%'
          }}
        />

        {gameOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Game Over!</div>
            <button
              type="button"
              onClick={resetGame}
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginTop: '6px' }}>
        Use Arrow Keys or WASD to navigate
      </div>
    </div>
  );
}
