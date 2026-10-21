/**
 * The 9 Easter Eggs Tracker and Persistence
 */

import { playSound } from './soundEngine';

export const ALL_EGGS = [
  { id: 'konami', title: 'Up up down down…', desc: 'Typed the secret Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A' },
  { id: 'terminal', title: 'Found the terminal', desc: 'Unlocked the in-browser canvas CLI' },
  { id: 'xyzzy', title: 'xyzzy', desc: 'Typed the classic adventure game password in terminal' },
  { id: 'deepspace', title: 'Went looking', desc: 'Panned extremely far into empty canvas space' },
  { id: 'completionist', title: 'Opened everything', desc: 'Opened all cards on the desktop simultaneously' },
  { id: 'tidy-freak', title: 'Tried every arrangement', desc: 'Cycled through all 5 desk window layouts' },
  { id: 'nose-to-glass', title: 'Nose against the glass', desc: 'Zoomed into maximum canvas scale (≥ 200%)' },
  { id: 'chameleon', title: 'Wore every theme', desc: 'Switched through multiple distinct palette themes' },
  { id: 'still-here', title: 'Still here?', desc: 'Hung around on the canvas for over 60 seconds' }
];

const STORAGE_KEY = 'canvas.eggs.found';

export const getFoundEggs = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const unlockEgg = (eggId, onEggUnlocked) => {
  if (typeof window === 'undefined') return;
  const current = getFoundEggs();
  if (!current.includes(eggId)) {
    const next = [...current, eggId];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}

    playSound('unlock');

    const eggInfo = ALL_EGGS.find((e) => e.id === eggId);
    if (onEggUnlocked && eggInfo) {
      onEggUnlocked(eggInfo);
    }
  }
};

// Konami Code Sequence: Up, Up, Down, Down, Left, Right, Left, Right, b, a
export const createKonamiListener = (onSuccess) => {
  const sequence = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let index = 0;

  return (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = sequence[index].length === 1 ? sequence[index].toLowerCase() : sequence[index];

    if (key === expected) {
      index++;
      if (index === sequence.length) {
        index = 0;
        onSuccess();
      }
    } else {
      index = 0;
    }
  };
};
