import React, { useState, useRef, useEffect } from 'react';
import { playSound } from './soundEngine';
import { ALL_EGGS, getFoundEggs, unlockEgg } from './easterEggs';
import { THEMES } from './themes';

export default function TerminalCLI({ onOpenCard, onSetTheme, profile, socials }) {
  const name = profile?.name || 'Vasanth S';
  const headline = profile?.showcaseHeadline || 'full stack engineer building dynamic web applications and scalable systems that hold up in production.';

  const [history, setHistory] = useState([
    { text: `${name} Interactive Terminal [canvas 1.0]`, type: 'system' },
    { text: "Type 'help' for available commands or 'eggs' for achievements.", type: 'system' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = inputVal.trim();
    if (!cmd) return;

    playSound('tick');
    const parts = cmd.split(' ');
    const main = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    const newHistory = [...history, { text: `$ ${cmd}`, type: 'input' }];

    switch (main) {
      case 'help':
        newHistory.push({
          text: `Available commands:
  • help           - show this help screen
  • whoami         - show profile summary
  • ls             - list accessible desktop cards
  • open <card>    - open card (e.g. 'open arcade', 'open toolbox')
  • activity       - view GitHub telemetry & contributions
  • theme <name>   - switch theme (or 'theme list')
  • eggs           - check your found secret easter eggs
  • xyzzy          - mystery portal
  • sudo           - root privileges check
  • clear          - clear console output`,
          type: 'output'
        });
        break;

      case 'whoami':
        newHistory.push({
          text: `${name.toLowerCase()} — ${headline}`,
          type: 'output'
        });
        break;

      case 'ls':
        newHistory.push({
          text: 'Cards available:\n  about, toolbox, experience, projects, arcade, notes, radio, eggs',
          type: 'output'
        });
        break;

      case 'admin':
      case 'cms':
        window.history.pushState({}, '', '?page=admin');
        window.dispatchEvent(new Event('popstate'));
        newHistory.push({
          text: 'Launching Live Portfolio Content Manager (Admin CMS)...',
          type: 'output'
        });
        break;

      case 'activity':
      case 'git':
      case 'github':
        newHistory.push({
          text: `GitHub Activity Telemetry [@vasanth246810]:
  • Total Contributions: 840+ in the past 12 months
  • Status: Active daily engineering streak
  • Profile: https://github.com/vasanth246810
  • Heatmap: Rendered in the Activity section`,
          type: 'output'
        });
        break;

      case 'open':
        if (!arg) {
          newHistory.push({ text: "Usage: open <card_name> (e.g. 'open arcade')", type: 'error' });
        } else {
          newHistory.push({ text: `Opening card '${arg}'...`, type: 'output' });
          if (onOpenCard) onOpenCard(arg);
        }
        break;

      case 'theme':
        if (!arg || arg === 'list') {
          newHistory.push({
            text: `Available themes: ${THEMES.map((t) => t.id).join(', ')}`,
            type: 'output'
          });
        } else {
          const foundTheme = THEMES.find((t) => t.id === arg);
          if (foundTheme) {
            newHistory.push({ text: `Switched palette theme to: ${foundTheme.name}`, type: 'output' });
            if (onSetTheme) onSetTheme(foundTheme.id);
          } else {
            newHistory.push({ text: `Unknown theme '${arg}'. Type 'theme list' for options.`, type: 'error' });
          }
        }
        break;

      case 'eggs':
        const found = getFoundEggs();
        const eggReport = ALL_EGGS.map(
          (egg) => `  [${found.includes(egg.id) ? 'x' : ' '}] ${egg.title} — ${egg.desc}`
        ).join('\n');
        newHistory.push({
          text: `Secret Easter Eggs (${found.length}/${ALL_EGGS.length} found):\n${eggReport}`,
          type: 'output'
        });
        break;

      case 'xyzzy':
        unlockEgg('xyzzy');
        newHistory.push({
          text: '✨ A hollow voice says "Fool!". You feel a mysterious spark...',
          type: 'output'
        });
        break;

      case 'sudo':
        newHistory.push({ text: 'nice try ;)', type: 'error' });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          text: `Command not found: ${main}. Type 'help' for available commands.`,
          type: 'error'
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div
      style={{
        background: '#11111b',
        color: '#cdd6f4',
        fontFamily: "'Space Grotesk', 'Courier New', monospace",
        fontSize: '12px',
        padding: '10px',
        height: '240px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '4px'
      }}
    >
      <div style={{ flex: 1 }}>
        {history.map((line, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '4px',
              whiteSpace: 'pre-wrap',
              color:
                line.type === 'error'
                  ? '#f38ba8'
                  : line.type === 'input'
                  ? '#fab387'
                  : line.type === 'system'
                  ? '#89b4fa'
                  : '#cdd6f4'
            }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
        <span style={{ color: '#a6e3a1', fontWeight: 700 }}>$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
          placeholder="type help, ls, open..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontFamily: 'inherit',
            fontSize: '12px'
          }}
        />
      </div>
    </div>
  );
}
