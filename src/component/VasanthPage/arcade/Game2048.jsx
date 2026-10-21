import React, { useState, useEffect, useCallback } from 'react';
import { playSound } from '../soundEngine';

function getEmptyBoard() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}

function spawnRandom(board) {
  const emptyCoords = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) emptyCoords.push({ r, c });
    }
  }
  if (emptyCoords.length === 0) return board;
  const choice = emptyCoords[Math.floor(Math.random() * emptyCoords.length)];
  const next = board.map((row) => [...row]);
  next[choice.r][choice.c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

export default function Game2048() {
  const [board, setBoard] = useState(() => spawnRandom(spawnRandom(getEmptyBoard())));
  const [score, setScore] = useState(0);

  const resetGame = () => {
    setBoard(spawnRandom(spawnRandom(getEmptyBoard())));
    setScore(0);
    playSound('click');
  };

  const slideAndMerge = useCallback((row, addScore) => {
    let filtered = row.filter((val) => val !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        addScore(filtered[i]);
        filtered[i + 1] = 0;
      }
    }
    filtered = filtered.filter((val) => val !== 0);
    while (filtered.length < 4) {
      filtered.push(0);
    }
    return filtered;
  }, []);

  const move = useCallback(
    (dir) => {
      let gained = 0;
      const addScore = (pts) => {
        gained += pts;
      };

      let newBoard = board.map((r) => [...r]);

      if (dir === 'left') {
        newBoard = newBoard.map((row) => slideAndMerge(row, addScore));
      } else if (dir === 'right') {
        newBoard = newBoard.map((row) => slideAndMerge([...row].reverse(), addScore).reverse());
      } else if (dir === 'up') {
        for (let c = 0; c < 4; c++) {
          const col = [board[0][c], board[1][c], board[2][c], board[3][c]];
          const merged = slideAndMerge(col, addScore);
          for (let r = 0; r < 4; r++) newBoard[r][c] = merged[r];
        }
      } else if (dir === 'down') {
        for (let c = 0; c < 4; c++) {
          const col = [board[3][c], board[2][c], board[1][c], board[0][c]];
          const merged = slideAndMerge(col, addScore);
          for (let r = 0; r < 4; r++) newBoard[3 - r][c] = merged[r];
        }
      }

      // Check if board changed
      let changed = false;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (newBoard[r][c] !== board[r][c]) changed = true;
        }
      }

      if (changed) {
        playSound('tick');
        if (gained > 0) {
          playSound('score');
          setScore((s) => s + gained);
        }
        setBoard(spawnRandom(newBoard));
      }
    },
    [board, slideAndMerge]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
        <span>🎲 Score: <b style={{ color: 'var(--accent)' }}>{score}</b></span>
        <button
          type="button"
          onClick={resetGame}
          style={{
            background: 'var(--canvas-base)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
            padding: '2px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          width: '220px',
          height: '220px',
          background: 'var(--border)',
          borderRadius: '8px',
          padding: '6px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '6px'
        }}
      >
        {board.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                background: val === 0 ? 'var(--canvas-base)' : val >= 128 ? 'var(--accent)' : 'var(--surface)',
                color: val === 0 ? 'transparent' : val >= 128 ? 'var(--accent-ink)' : 'var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: val > 512 ? '13px' : '15px'
              }}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}
      </div>

      <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginTop: '6px' }}>
        Use Arrow Keys to slide & merge tiles
      </div>
    </div>
  );
}
