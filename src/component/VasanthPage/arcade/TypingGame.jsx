import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../soundEngine';

const SAMPLE_TEXT = "I build AI stuff and anything else I find interesting, RAG pipelines, multi agent systems, Full Stack apps, and generally anything that looks shiny at 2AM in the morning.";

export default function TypingGame() {
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef(null);

  const resetGame = () => {
    setInput('');
    setStarted(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    playSound('click');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    playSound('tick');
    setInput(val);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === SAMPLE_TEXT[i]) correctChars++;
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    // Calculate WPM
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        const words = val.length / 5;
        setWpm(Math.round(words / elapsedMinutes));
      }
    }

    // Check completion
    if (val.length >= SAMPLE_TEXT.length) {
      setIsCompleted(true);
      playSound('score');
    }
  };

  return (
    <div style={{ padding: '12px', fontFamily: 'inherit', maxWidth: '440px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', fontWeight: 600 }}>
        <span>⚡ WPM: <b style={{ color: 'var(--accent)' }}>{wpm}</b></span>
        <span>🎯 Accuracy: <b style={{ color: 'var(--accent)' }}>{accuracy}%</b></span>
        <button
          type="button"
          onClick={resetGame}
          style={{
            background: 'var(--canvas-base)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
            padding: '2px 8px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          background: 'var(--canvas-base)',
          border: '1.5px solid var(--border)',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '13px',
          lineHeight: '1.5',
          marginBottom: '10px',
          userSelect: 'none'
        }}
      >
        {SAMPLE_TEXT.split('').map((char, index) => {
          let color = 'var(--ink-subtle)';
          if (index < input.length) {
            color = input[index] === char ? '#a6e3a1' : '#f38ba8';
          }
          return (
            <span key={index} style={{ color, textDecoration: index === input.length ? 'underline' : 'none' }}>
              {char}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        disabled={isCompleted}
        value={input}
        onChange={handleChange}
        placeholder={started ? '' : 'Type the text above to test speed...'}
        style={{
          width: '100%',
          background: 'var(--surface)',
          color: 'var(--ink)',
          border: '1.5px solid var(--border)',
          padding: '8px 10px',
          borderRadius: '6px',
          fontSize: '13px',
          outline: 'none'
        }}
      />

      {isCompleted && (
        <div style={{ marginTop: '10px', textAlign: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: '14px' }}>
          🎉 Test Completed! Score: {wpm} WPM ({accuracy}% Accuracy)
        </div>
      )}
    </div>
  );
}
