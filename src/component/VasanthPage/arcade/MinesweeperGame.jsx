import React, { useState, useEffect } from 'react';
import { playSound } from '../soundEngine';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

function generateBoard() {
  const board = Array(ROWS).fill(null).map(() =>
    Array(COLS).fill(null).map(() => ({
      hasMine: false,
      revealed: false,
      flagged: false,
      neighborCount: 0
    }))
  );

  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].hasMine) {
      board[r][c].hasMine = true;
      placed++;
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].hasMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].hasMine) {
            count++;
          }
        }
      }
      board[r][c].neighborCount = count;
    }
  }

  return board;
}

export default function MinesweeperGame() {
  const [board, setBoard] = useState(generateBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(MINES);

  const resetGame = () => {
    setBoard(generateBoard());
    setGameOver(false);
    setWon(false);
    setFlagsLeft(MINES);
    playSound('click');
  };

  const revealCell = (r, c) => {
    if (gameOver || won || board[r][c].revealed || board[r][c].flagged) return;

    if (board[r][c].hasMine) {
      // Game over
      playSound('fail');
      setGameOver(true);
      const newBoard = board.map((row) =>
        row.map((cell) => (cell.hasMine ? { ...cell, revealed: true } : cell))
      );
      setBoard(newBoard);
      return;
    }

    playSound('tick');
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    // Flood fill
    const flood = (cr, cc) => {
      if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS || newBoard[cr][cc].revealed || newBoard[cr][cc].flagged) return;
      newBoard[cr][cc].revealed = true;
      if (newBoard[cr][cc].neighborCount === 0 && !newBoard[cr][cc].hasMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            flood(cr + dr, cc + dc);
          }
        }
      }
    };

    flood(r, c);
    setBoard(newBoard);

    // Check win condition
    let unrevealedSafe = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!newBoard[i][j].hasMine && !newBoard[i][j].revealed) unrevealedSafe++;
      }
    }
    if (unrevealedSafe === 0) {
      setWon(true);
      playSound('score');
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || won || board[r][c].revealed) return;

    playSound('tick');
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const isFlagged = newBoard[r][c].flagged;

    if (!isFlagged && flagsLeft > 0) {
      newBoard[r][c].flagged = true;
      setFlagsLeft((prev) => prev - 1);
    } else if (isFlagged) {
      newBoard[r][c].flagged = false;
      setFlagsLeft((prev) => prev + 1);
    }
    setBoard(newBoard);
  };

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '270px', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
        <span>🚩 Mines: <b style={{ color: 'var(--accent)' }}>{flagsLeft}</b></span>
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
          {gameOver ? '😵 Retry' : won ? '😎 Won!' : '🙂 Reset'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 28px)`,
          gridTemplateRows: `repeat(${ROWS}, 28px)`,
          gap: '2px',
          background: 'var(--border)',
          padding: '2px',
          borderRadius: '4px'
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            let bg = cell.revealed ? 'var(--canvas-base)' : 'var(--surface)';
            let content = '';
            if (cell.revealed) {
              if (cell.hasMine) content = '💣';
              else if (cell.neighborCount > 0) content = cell.neighborCount;
            } else if (cell.flagged) {
              content = '🚩';
            }

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
                style={{
                  width: '28px',
                  height: '28px',
                  background: bg,
                  color: cell.neighborCount === 1 ? '#89b4fa' : cell.neighborCount === 2 ? '#a6e3a1' : '#f38ba8',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: cell.revealed ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {content}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
