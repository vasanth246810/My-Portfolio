import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CanvasOS.css';
import { THEMES, THEME_CSS_VARS } from './themes';
import { playSound, toggleLofi, isSoundEnabled, setSoundMuted } from './soundEngine';
import { ALL_EGGS, getFoundEggs, unlockEgg, createKonamiListener } from './easterEggs';
import TypingGame from './arcade/TypingGame';
import MinesweeperGame from './arcade/MinesweeperGame';
import SnakeGame from './arcade/SnakeGame';
import Game2048 from './arcade/Game2048';
import TerminalCLI from './TerminalCLI';
import {
  SKILL_CATEGORIES as STATIC_SKILL_CATEGORIES,
  EXPERIENCES as STATIC_EXPERIENCES,
  PROJECTS as STATIC_PROJECTS,
  DEFAULT_PROFILE,
  DEFAULT_SOCIALS
} from './vasanthData';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Radio,
  Gamepad2,
  Terminal,
  Grid,
  Search,
  ArrowLeft,
  Award,
  Layers,
  Code2,
  BookOpen,
  Send,
  Activity,
  Clock,
  Cpu,
  HelpCircle,
  Trophy,
  ExternalLink,
  Flame,
  CheckCircle2,
  FileText,
  Sliders,
  Briefcase,
  Mail,
  Palette,
  Github,
  Linkedin
} from 'lucide-react';

const INITIAL_WINDOWS = [
  { id: 'resume', title: 'Résumé', headerBg: '#FDE047', x: 220, y: 150, w: 380, h: 220, open: true, z: 1 },
  { id: 'themes', title: 'Themes', headerBg: '#F5C2E7', x: 630, y: 180, w: 460, h: 420, open: true, z: 2 },
  { id: 'hero', title: 'Profile', headerBg: '#FDE047', x: 120, y: 80, w: 420, h: 360, open: false, z: 3 },
  { id: 'toolbox', title: 'Toolbox · Skills', headerBg: '#99F6E4', x: 570, y: 70, w: 450, h: 420, open: false, z: 4 },
  { id: 'experience', title: 'Experience · Timeline', headerBg: '#FED7AA', x: 140, y: 470, w: 460, h: 400, open: false, z: 5 },
  { id: 'projects', title: 'Selected Work', headerBg: '#BAE6FD', x: 630, y: 520, w: 480, h: 420, open: false, z: 6 },
  { id: 'arcade', title: '🕹️ The Arcade (4 Games)', headerBg: '#BBF7D0', x: 340, y: 180, w: 490, h: 450, open: false, z: 7 },
  { id: 'terminal', title: '💻 The Terminal CLI', headerBg: '#181825', headerColor: '#ffffff', x: 380, y: 240, w: 470, h: 330, open: false, z: 8 },
  { id: 'notes', title: '📝 The Notes Wall', headerBg: '#DDD6FE', x: 480, y: 150, w: 380, h: 420, open: false, z: 9 },
  { id: 'analytics', title: '📊 Live Analytics & Visitors', headerBg: '#A5F3FC', x: 260, y: 160, w: 440, h: 380, open: false, z: 10 },
  { id: 'now', title: '⏳ "Now" Status Page', headerBg: '#FFEDD5', x: 520, y: 200, w: 420, h: 390, open: false, z: 11 },
  { id: 'archive', title: '🔬 Hardware Hacking & MCP', headerBg: '#D9F99D', x: 360, y: 140, w: 500, h: 440, open: false, z: 12 },
  { id: 'deepspace', title: '🌌 Deep Space (?)', headerBg: '#E9D5FF', x: 2200, y: 1600, w: 380, h: 280, open: false, z: 13 },
  { id: 'eggs', title: '🏆 Secret Achievements', headerBg: '#FEF08A', x: 360, y: 120, w: 430, h: 420, open: false, z: 14 }
];

const VISITOR_DAYS = [
  { day: 'D-13', count: 42 },
  { day: 'D-12', count: 58 },
  { day: 'D-11', count: 74 },
  { day: 'D-10', count: 65 },
  { day: 'D-09', count: 89 },
  { day: 'D-08', count: 112 },
  { day: 'D-07', count: 96 },
  { day: 'D-06', count: 134 },
  { day: 'D-05', count: 168 },
  { day: 'D-04', count: 152 },
  { day: 'D-03', count: 189 },
  { day: 'D-02', count: 215 },
  { day: 'Yesterday', count: 247 },
  { day: 'Today', count: 283 }
];

export default function CanvasOS({ onReturnToPortfolio, onSwitchToClassic }) {
  const {
    projects: liveProjects,
    experiences: liveExperiences,
    profile: liveProfile,
    socials: liveSocials,
    skillCategories: liveSkillCategories
  } = usePortfolioData();

  const PROJECTS = liveProjects && liveProjects.length > 0 ? liveProjects : STATIC_PROJECTS;
  const EXPERIENCES = liveExperiences && liveExperiences.length > 0 ? liveExperiences : STATIC_EXPERIENCES;
  const SKILL_CATEGORIES = liveSkillCategories && liveSkillCategories.length > 0 ? liveSkillCategories : STATIC_SKILL_CATEGORIES;
  const profile = liveProfile || DEFAULT_PROFILE;
  const socials = liveSocials || DEFAULT_SOCIALS;

  // Default to Cream light theme matching screenshot
  const [currentTheme, setCurrentTheme] = useState('cream');
  const [camera, setCamera] = useState({ x: 120, y: 60, s: 0.9 });
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState('themes');
  const [highestZ, setHighestZ] = useState(16);
  const [soundOn, setSoundOn] = useState(true);
  const [eggNotification, setEggNotification] = useState(null);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [arcadeTab, setArcadeTab] = useState('typing');
  const [archiveTab, setArchiveTab] = useState('tomato');

  // Top Bar Dropdowns
  const [openDropdown, setOpenDropdown] = useState(null); // 'goto', 'arrange'

  // Sticky notes with honeypot bot trap
  const [stickyNotes, setStickyNotes] = useState([
    { id: 1, author: 'Siddharth', text: 'The canvas UI is unreal! Found the Konami code.' },
    { id: 2, author: 'Kavitha', text: 'Eventifyy ticketing flow is super slick and fast!' },
    { id: 3, author: 'Marcus', text: 'Minesweeper on a portfolio desktop? Next level!' }
  ]);
  const [noteAuthor, setNoteAuthor] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const triedArrangements = useRef(new Set());
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const camStart = useRef({ x: 0, y: 0 });
  const dragTarget = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleEggUnlocked = useCallback((egg) => {
    setEggNotification(egg);
    setTimeout(() => setEggNotification(null), 4500);
  }, []);

  useEffect(() => {
    const konamiListener = createKonamiListener(() => {
      unlockEgg('konami', handleEggUnlocked);
      openWindow('terminal');
    });
    window.addEventListener('keydown', konamiListener);

    const idleTimer = setTimeout(() => {
      unlockEgg('still-here', handleEggUnlocked);
    }, 60000);

    return () => {
      window.removeEventListener('keydown', konamiListener);
      clearTimeout(idleTimer);
    };
  }, [handleEggUnlocked]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
        playSound('open');
      } else if (e.key === 'Escape') {
        if (isCmdOpen) {
          setIsCmdOpen(false);
        } else if (openDropdown) {
          setOpenDropdown(null);
        } else if (activeWindowId) {
          closeWindow(activeWindowId);
        }
      } else if ((e.key === '0' || e.key.toLowerCase() === 'f') && !['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
        fitToView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCmdOpen, openDropdown, activeWindowId]);

  const focusWindow = (id) => {
    setActiveWindowId(id);
    setHighestZ((prev) => {
      const nextZ = prev + 1;
      setWindows((wins) =>
        wins.map((w) => (w.id === id ? { ...w, z: nextZ, open: true } : w))
      );
      return nextZ;
    });
    playSound('click');
  };

  const openWindow = (id) => {
    setWindows((wins) =>
      wins.map((w) => (w.id === id ? { ...w, open: true } : w))
    );
    focusWindow(id);
    playSound('open');

    setTimeout(() => {
      setWindows((currentWins) => {
        if (currentWins.every((w) => w.open)) {
          unlockEgg('completionist', handleEggUnlocked);
        }
        return currentWins;
      });
    }, 100);
  };

  const closeWindow = (id) => {
    setWindows((wins) =>
      wins.map((w) => (w.id === id ? { ...w, open: false } : w))
    );
    playSound('close');
  };

  const toggleWindow = (id) => {
    const win = windows.find((w) => w.id === id);
    if (win && win.open) {
      closeWindow(id);
    } else {
      openWindow(id);
    }
  };

  const flyToCard = (winId) => {
    const card = windows.find((w) => w.id === winId);
    if (!card) return;
    openWindow(winId);

    const targetX = -card.x * camera.s + window.innerWidth / 2 - (card.w * camera.s) / 2;
    const targetY = -card.y * camera.s + window.innerHeight / 2 - (card.h * camera.s) / 2;
    setCamera((prev) => ({ ...prev, x: targetX, y: targetY }));
    playSound('arrange');

    if (winId === 'deepspace') {
      unlockEgg('deepspace', handleEggUnlocked);
    }
  };

  const handleZoom = (delta) => {
    setCamera((prev) => {
      const newScale = Math.min(2.0, Math.max(0.45, prev.s + delta));
      if (newScale >= 1.95) {
        unlockEgg('nose-to-glass', handleEggUnlocked);
      }
      return { ...prev, s: newScale };
    });
    playSound('tick');
  };

  const fitToView = () => {
    setCamera({ x: 80, y: 60, s: 0.85 });
    playSound('arrange');
  };

  const minimiseAll = () => {
    setWindows((wins) => wins.map((w) => ({ ...w, open: false })));
    playSound('minimise');
  };

  // 5 Window Arrangement Routines
  const arrangeWindows = (mode) => {
    setOpenDropdown(null);
    triedArrangements.current.add(mode);
    if (triedArrangements.current.size >= 5) {
      unlockEgg('tidy-freak', handleEggUnlocked);
    }

    playSound('arrange');

    setWindows((prevWins) => {
      const openWins = prevWins.filter((w) => w.open && w.id !== 'deepspace');
      let arranged = [...prevWins];

      if (mode === 'tidy') {
        let startX = 140;
        let startY = 100;
        let count = 0;
        arranged = arranged.map((w) => {
          if (!w.open || w.id === 'deepspace') return w;
          const col = count % 2;
          const row = Math.floor(count / 2);
          count++;
          return { ...w, x: startX + col * 490, y: startY + row * 430 };
        });
      } else if (mode === 'cascade') {
        arranged = arranged.map((w, idx) => {
          if (!w.open || w.id === 'deepspace') return w;
          return { ...w, x: 140 + idx * 45, y: 90 + idx * 40 };
        });
      } else if (mode === 'scatter' || mode === 'random') {
        arranged = arranged.map((w) => {
          if (!w.open || w.id === 'deepspace') return w;
          return {
            ...w,
            x: 80 + Math.random() * 600,
            y: 60 + Math.random() * 400
          };
        });
      } else if (mode === 'ring') {
        const centerX = 550;
        const centerY = 360;
        const radius = 350;
        const count = openWins.length || 1;
        let angleIdx = 0;
        arranged = arranged.map((w) => {
          if (!w.open || w.id === 'deepspace') return w;
          const theta = (angleIdx / count) * 2 * Math.PI;
          angleIdx++;
          return {
            ...w,
            x: Math.round(centerX + radius * Math.cos(theta) - w.w / 2),
            y: Math.round(centerY + radius * Math.sin(theta) - w.h / 2)
          };
        });
      } else if (mode === 'chaos') {
        arranged = arranged.map((w) => {
          if (!w.open || w.id === 'deepspace') return w;
          return {
            ...w,
            x: Math.random() * 750,
            y: Math.random() * 550
          };
        });
      }

      return arranged;
    });
  };

  const onMouseDownBackground = (e) => {
    if (e.target.closest('.canvas-window') || e.target.closest('.canvas-dock') || e.target.closest('.canvas-top-bar') || e.target.closest('.canvas-zoom-pill')) return;
    setOpenDropdown(null);
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    camStart.current = { x: camera.x, y: camera.y };
  };

  const onMouseMove = (e) => {
    if (dragTarget.current) {
      const dx = (e.clientX - dragOffset.current.mouseX) / camera.s;
      const dy = (e.clientY - dragOffset.current.mouseY) / camera.s;
      setWindows((wins) =>
        wins.map((w) =>
          w.id === dragTarget.current
            ? { ...w, x: dragOffset.current.winX + dx, y: dragOffset.current.winY + dy }
            : w
        )
      );
      return;
    }

    if (isPanning.current) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      const nextX = camStart.current.x + dx;
      const nextY = camStart.current.y + dy;

      if (Math.abs(nextX) > 2800 || Math.abs(nextY) > 2800) {
        unlockEgg('deepspace', handleEggUnlocked);
      }

      setCamera((prev) => ({ ...prev, x: nextX, y: nextY }));
    }
  };

  const onMouseUp = () => {
    isPanning.current = false;
    dragTarget.current = null;
  };

  const onWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.06 : 0.06;
      handleZoom(zoomDelta);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (!noteContent.trim()) return;
    const cleanContent = noteContent.trim().slice(0, 180);
    const newNote = {
      id: Date.now(),
      author: noteAuthor.trim() || 'Anonymous',
      text: cleanContent
    };
    setStickyNotes([newNote, ...stickyNotes]);
    setNoteContent('');
    setNoteAuthor('');
    playSound('score');
  };

  const switchTheme = (themeId) => {
    setCurrentTheme(themeId);
    unlockEgg('chameleon', handleEggUnlocked);
    playSound('theme');
  };

  const lightThemes = THEMES.filter((t) => t.mode === 'light');
  const darkThemes = THEMES.filter((t) => t.mode === 'dark');
  const currentThemeVars = THEME_CSS_VARS[currentTheme] || THEME_CSS_VARS['cream'];

  return (
    <div
      className="canvas-os-root"
      style={currentThemeVars}
      onMouseDown={onMouseDownBackground}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
    >
      <div className="canvas-grid-plane" />

      {/* ==========================================================================
          Top Controls Pill Bar (Matching screenshot exactly)
          ========================================================================== */}
      <nav className="canvas-top-bar">
        <button type="button" className="canvas-top-btn" onClick={fitToView}>
          Fit all
        </button>

        <button type="button" className="canvas-top-btn" onClick={minimiseAll}>
          Minimise all
        </button>

        {/* Go to Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="canvas-top-btn"
            onClick={() => setOpenDropdown(openDropdown === 'goto' ? null : 'goto')}
          >
            Go to ▾
          </button>
          {openDropdown === 'goto' && (
            <div className="canvas-top-dropdown">
              {windows.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    flyToCard(w.id);
                    setOpenDropdown(null);
                  }}
                >
                  {w.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" className="canvas-top-btn" onClick={() => arrangeWindows('scatter')}>
          Random
        </button>

        {/* Arrange Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="canvas-top-btn"
            onClick={() => setOpenDropdown(openDropdown === 'arrange' ? null : 'arrange')}
          >
            Arrange ▾
          </button>
          {openDropdown === 'arrange' && (
            <div className="canvas-top-dropdown">
              <button type="button" onClick={() => arrangeWindows('tidy')}>Tidy Rows</button>
              <button type="button" onClick={() => arrangeWindows('cascade')}>Cascade</button>
              <button type="button" onClick={() => arrangeWindows('ring')}>Ring Orbit</button>
              <button type="button" onClick={() => arrangeWindows('scatter')}>Scatter</button>
              <button type="button" onClick={() => arrangeWindows('chaos')}>Chaos</button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="canvas-top-btn"
          onClick={() => flyToCard('themes')}
        >
          ☼ Theme ▾
        </button>

        <button
          type="button"
          className="canvas-top-btn"
          onClick={onSwitchToClassic}
          title="Return to the scrollable classic site"
        >
          The site
        </button>

        {/* Sound Button (Yellow Pill) */}
        <button
          type="button"
          className="canvas-top-btn canvas-sound-btn"
          onClick={() => {
            const next = !soundOn;
            setSoundOn(next);
            setSoundMuted(!next);
            playSound('click');
          }}
          title="Toggle Analog Tape Warmth Procedural Audio"
        >
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>Sound ▾</span>
        </button>

        {/* Exit back to User's React Portfolio */}
        <button
          type="button"
          className="canvas-top-btn"
          onClick={onReturnToPortfolio}
          title="Return to main portfolio"
          style={{ opacity: 0.7 }}
        >
          Exit
        </button>
      </nav>

      {/* Easter Egg Toast Notification */}
      {eggNotification && (
        <div className="canvas-egg-toast">
          <Sparkles size={18} />
          <div>
            <div>Secret Unlocked: {eggNotification.title}</div>
            <div style={{ fontSize: '11px', opacity: 0.85 }}>{eggNotification.desc}</div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          Infinite Canvas Transform Plane
          ========================================================================== */}
      <div
        className="canvas-stage"
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.s})`
        }}
      >
        {/* Center Canvas Hero Watermark */}
        <div className="canvas-center-hero">
          <div className="canvas-center-avatar">{profile?.initials || 'VS'}</div>
          <h1 className="canvas-center-name">{profile?.name || 'Vasanth S'}</h1>
          <div className="canvas-center-sub">
            <span>{(profile?.roles && profile.roles[0]) || 'Full stack engineer'},</span>
            <span className="canvas-center-pill">Web Applications &amp; Systems</span>
          </div>
          <div className="canvas-center-location">{(profile?.location || 'TAMIL NADU, INDIA').toUpperCase()}</div>
        </div>

        {/* Window Cards */}
        {windows.map((win) => {
          if (!win.open) return null;
          const isActive = activeWindowId === win.id;

          return (
            <div
              key={win.id}
              className={`canvas-window ${isActive ? 'active' : ''}`}
              style={{
                left: `${win.x}px`,
                top: `${win.y}px`,
                width: `${win.w}px`,
                zIndex: win.z
              }}
              onMouseDown={() => focusWindow(win.id)}
            >
              {/* Colored Header Strip */}
              <div
                className="canvas-window-header"
                style={{
                  background: win.headerBg || '#FACC00',
                  color: win.headerColor || '#161616'
                }}
                onMouseDown={(e) => {
                  focusWindow(win.id);
                  dragTarget.current = win.id;
                  dragOffset.current = {
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    winX: win.x,
                    winY: win.y
                  };
                }}
              >
                <div className="canvas-window-title">
                  <span style={{ fontSize: '14px' }}>📄</span>
                  <span>{win.title}</span>
                </div>

                <button
                  type="button"
                  className="canvas-win-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(win.id);
                  }}
                  title="Close"
                >
                  ✕
                </button>
              </div>

              {/* Window Content */}
              <div className="canvas-window-body">
                {/* 1. RÉSUMÉ CARD (Matching screenshot) */}
                {win.id === 'resume' && (
                  <div>
                    <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#161616', fontWeight: 500 }}>
                      The whole thing, as a page you can scroll.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
                      <button
                        type="button"
                        onClick={onSwitchToClassic}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#161616',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Open the site →
                      </button>
                      <a
                        href={profile?.resumeUrl || "/Vasanth_Resume.pdf"}
                        download
                        style={{
                          color: '#161616',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'underline'
                        }}
                      >
                        Download PDF ↓
                      </a>
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: 'rgba(22, 22, 22, 0.6)' }}>
                      Server-rendered, and works with JavaScript disabled.
                    </p>
                  </div>
                )}

                {/* 2. THEMES WINDOW CARD (Matching screenshot) */}
                {win.id === 'themes' && (
                  <div>
                    {/* Light 5 */}
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(22, 22, 22, 0.6)', marginBottom: '4px' }}>
                      LIGHT <span style={{ background: 'rgba(22,22,22,0.1)', padding: '1px 5px', borderRadius: '4px' }}>5</span>
                    </div>
                    <div className="theme-card-grid" style={{ marginBottom: '16px' }}>
                      {lightThemes.map((t) => {
                        const isCurrent = currentTheme === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            className={`theme-swatch-btn ${isCurrent ? 'active' : ''}`}
                            onClick={() => switchTheme(t.id)}
                          >
                            <div className="theme-stripes">
                              <div className="theme-stripe" style={{ background: '#F7F5EE' }} />
                              <div className="theme-stripe" style={{ background: '#FFFFFF' }} />
                              <div className="theme-stripe" style={{ background: t.accent }} />
                            </div>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {t.name.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dark 13 */}
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(22, 22, 22, 0.6)', marginBottom: '4px' }}>
                      DARK <span style={{ background: 'rgba(22,22,22,0.1)', padding: '1px 5px', borderRadius: '4px' }}>13</span>
                    </div>
                    <div className="theme-card-grid">
                      {darkThemes.map((t) => {
                        const isCurrent = currentTheme === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            className={`theme-swatch-btn ${isCurrent ? 'active' : ''}`}
                            onClick={() => switchTheme(t.id)}
                          >
                            <div className="theme-stripes">
                              <div className="theme-stripe" style={{ background: '#1A1B26' }} />
                              <div className="theme-stripe" style={{ background: '#24283B' }} />
                              <div className="theme-stripe" style={{ background: t.accent }} />
                            </div>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {t.name.replace('Catppuccin ', '').split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. PROFILE HERO */}
                {win.id === 'hero' && (
                  <div>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
                      <div className="canvas-center-avatar" style={{ margin: 0 }}>{profile?.initials || 'VS'}</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>{profile?.name || 'Vasanth S'}</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#161616', opacity: 0.8 }}>
                          {profile?.location || 'Tamil Nadu, India'} · {(profile?.roles && profile.roles[0]) || 'Full Stack Developer'}
                        </p>
                      </div>
                    </div>
                    <p style={{ lineHeight: 1.5, marginBottom: '12px', fontSize: '13px' }}>
                      {profile?.showcaseHeadline || 'Full-stack engineer building dynamic web applications and scalable systems that hold up in production.'}
                    </p>
                  </div>
                )}

                {/* 4. TOOLBOX */}
                {win.id === 'toolbox' && (
                  <div>
                    {SKILL_CATEGORIES.map((cat) => (
                      <div key={cat.category} style={{ marginBottom: '12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
                          {cat.category}
                        </div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {cat.skills.map((s) => (
                            <span
                              key={s.name}
                              style={{
                                background: 'rgba(22, 22, 22, 0.05)',
                                border: '1px solid #161616',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 500
                              }}
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. EXPERIENCE */}
                {win.id === 'experience' && (
                  <div>
                    {EXPERIENCES.map((exp) => (
                      <div
                        key={exp.id}
                        style={{
                          marginBottom: '10px',
                          padding: '8px',
                          background: 'rgba(22, 22, 22, 0.04)',
                          border: '1.5px solid #161616',
                          borderRadius: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
                          <b>{exp.company}</b>
                          <span>{exp.period}</span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '13px', margin: '2px 0' }}>{exp.role}</div>
                        <p style={{ fontSize: '12px', margin: 0, opacity: 0.85 }}>{exp.lede}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. PROJECTS */}
                {win.id === 'projects' && (
                  <div>
                    {PROJECTS.map((proj) => (
                      <div
                        key={proj.id}
                        style={{
                          marginBottom: '10px',
                          padding: '10px',
                          background: 'rgba(22, 22, 22, 0.04)',
                          border: '1.5px solid #161616',
                          borderRadius: '6px'
                        }}
                      >
                        <div style={{ fontSize: '11px', opacity: 0.7 }}>{proj.no}</div>
                        <h4 style={{ margin: '2px 0', fontSize: '14px' }}>{proj.title}</h4>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{proj.tag}</div>
                        <p style={{ fontSize: '12px', margin: '4px 0 8px', opacity: 0.85 }}>{proj.lede}</p>
                        {proj.award && (
                          <div style={{ fontSize: '11px', fontWeight: 700 }}>{proj.award}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 7. ARCADE */}
                {win.id === 'arcade' && (
                  <div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', borderBottom: '1.5px solid #161616', paddingBottom: '6px' }}>
                      <button
                        type="button"
                        onClick={() => { setArcadeTab('typing'); playSound('click'); }}
                        style={{
                          background: arcadeTab === 'typing' ? '#FACC00' : 'transparent',
                          border: '1px solid #161616',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        ⌨️ Typing
                      </button>
                      <button
                        type="button"
                        onClick={() => { setArcadeTab('minesweeper'); playSound('click'); }}
                        style={{
                          background: arcadeTab === 'minesweeper' ? '#FACC00' : 'transparent',
                          border: '1px solid #161616',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        💣 Minesweeper
                      </button>
                      <button
                        type="button"
                        onClick={() => { setArcadeTab('snake'); playSound('click'); }}
                        style={{
                          background: arcadeTab === 'snake' ? '#FACC00' : 'transparent',
                          border: '1px solid #161616',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        🐍 Snake
                      </button>
                      <button
                        type="button"
                        onClick={() => { setArcadeTab('2048'); playSound('click'); }}
                        style={{
                          background: arcadeTab === '2048' ? '#FACC00' : 'transparent',
                          border: '1px solid #161616',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        🎲 2048
                      </button>
                    </div>

                    {arcadeTab === 'typing' && <TypingGame />}
                    {arcadeTab === 'minesweeper' && <MinesweeperGame />}
                    {arcadeTab === 'snake' && <SnakeGame />}
                    {arcadeTab === '2048' && <Game2048 />}
                  </div>
                )}

                {/* 8. TERMINAL CLI */}
                {win.id === 'terminal' && (
                  <TerminalCLI
                    onOpenCard={(card) => flyToCard(card)}
                    onSetTheme={(theme) => switchTheme(theme)}
                    profile={profile}
                    socials={socials}
                  />
                )}

                {/* 9. NOTES WALL */}
                {win.id === 'notes' && (
                  <div>
                    <form onSubmit={handleAddNote} style={{ marginBottom: '12px' }}>
                      <input
                        type="text"
                        value={noteAuthor}
                        onChange={(e) => setNoteAuthor(e.target.value)}
                        placeholder="Your name"
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          background: 'rgba(22, 22, 22, 0.04)',
                          border: '1.5px solid #161616',
                          borderRadius: '4px',
                          fontSize: '12px',
                          marginBottom: '6px'
                        }}
                      />
                      <input
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          maxLength={180}
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Leave a note..."
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            background: 'rgba(22, 22, 22, 0.04)',
                            border: '1.5px solid #161616',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: '#FACC00',
                            color: '#161616',
                            border: '1.5px solid #161616',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Send size={13} />
                        </button>
                      </div>
                    </form>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {stickyNotes.map((n) => (
                        <div
                          key={n.id}
                          style={{
                            background: 'rgba(22, 22, 22, 0.04)',
                            border: '1.5px solid #161616',
                            boxShadow: '2px 2px 0px #161616',
                            padding: '8px',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        >
                          <b>{n.author}:</b> {n.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. LIVE ANALYTICS */}
                {win.id === 'analytics' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a6e3a1', boxShadow: '0 0 8px #a6e3a1', display: 'inline-block' }} />
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>Live: 4 viewing now</span>
                      </div>
                      <span style={{ fontSize: '11px', opacity: 0.7 }}>Edge Telemetry</span>
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                      14-Day Visitor Histogram (/api/visitors)
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '4px',
                        height: '110px',
                        background: 'rgba(22, 22, 22, 0.04)',
                        border: '1.5px solid #161616',
                        borderRadius: '6px',
                        padding: '10px 8px 4px',
                        marginBottom: '14px'
                      }}
                    >
                      {VISITOR_DAYS.map((item, idx) => {
                        const heightPct = Math.round((item.count / 300) * 100);
                        return (
                          <div
                            key={idx}
                            title={`${item.day}: ${item.count} visitors`}
                            style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              height: '100%',
                              justifyContent: 'flex-end'
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                height: `${heightPct}%`,
                                background: idx >= VISITOR_DAYS.length - 2 ? '#FACC00' : 'rgba(22, 22, 22, 0.4)',
                                border: '1px solid #161616',
                                borderRadius: '2px 2px 0 0'
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ border: '1px solid #161616', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>🇮🇳 IN 62%</span>
                      <span style={{ border: '1px solid #161616', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>🇺🇸 US 18%</span>
                      <span style={{ border: '1px solid #161616', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>🇩🇪 DE 9%</span>
                      <span style={{ border: '1px solid #161616', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>🇸🇬 SG 6%</span>
                    </div>
                  </div>
                )}

                {/* 11. NOW STATUS */}
                {win.id === 'now' && (
                  <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', color: '#161616', opacity: 0.7 }}>
                      📍 Tamil Nadu, India · Updated this week
                    </div>
                    <b>🔨 Building:</b>
                    <div>• Eventifyy ticket booking platform with React & Django</div>
                    <div>• Food delivery app with full-stack REST APIs</div>
                    <div>• Interactive 3D Web Skills Visualization with Three.js math</div>
                  </div>
                )}

                {/* 12. HARDWARE ARCHIVE */}
                {win.id === 'archive' && (
                  <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setArchiveTab('tomato')}
                        style={{
                          background: archiveTab === 'tomato' ? '#FACC00' : 'transparent',
                          border: '1px solid #161616',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Tomato Food App
                      </button>
                      <button
                        type="button"
                        onClick={() => setArchiveTab('sphere')}
                        style={{
                          background: archiveTab === 'sphere' ? '#FACC00' : 'transparent',
                          border: '1px solid #161616',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        3D Sphere Engine
                      </button>
                      <button
                        type="button"
                        onClick={() => setArchiveTab('mcp')}
                        style={{
                          background: archiveTab === 'mcp' ? '#FACC00' : 'transparent',
                          border: '1px solid #161616',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Eventifyy App
                      </button>
                    </div>

                    {archiveTab === 'tomato' && (
                      <div>
                        <b>Tomato Food Delivery Platform:</b>
                        <div>• Dynamic food catalog with reactive cart state</div>
                        <div>• RESTful backend services with order lifecycle tracking</div>
                        <div>• Responsive cross-device UI built for performance</div>
                      </div>
                    )}
                    {archiveTab === 'sphere' && (
                      <div>
                        <b>Interactive 3D Sphere &amp; Matrix Engine:</b>
                        <div>• Fibonacci point distribution on spherical coordinate space</div>
                        <div>• Smooth quaternion rotation with inertia &amp; drag momentum</div>
                        <div>• Full CMS-backed live rendering with category matrix sync</div>
                      </div>
                    )}
                    {archiveTab === 'mcp' && (
                      <div>
                        <b>Eventifyy Architecture:</b>
                        <div>• "Event booking &amp; management with React &amp; Django"</div>
                        <div>• Normalized MySQL schema with seat reservation tracking</div>
                      </div>
                    )}
                  </div>
                )}

                {/* 13. DEEP SPACE (?) */}
                {win.id === 'deepspace' && (
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '38px', marginBottom: '6px' }}>🌌</div>
                    <h3 style={{ margin: '0 0 6px 0' }}>Deep Space Discovered!</h3>
                    <p style={{ fontSize: '12px', margin: 0, opacity: 0.8 }}>
                      You panned out into empty coordinates and found the boundary card.
                    </p>
                    <div style={{ marginTop: '8px', fontWeight: 700, fontSize: '11px' }}>
                      🏆 Achievement: "Went looking"
                    </div>
                  </div>
                )}

                {/* 14. ACHIEVEMENTS */}
                {win.id === 'eggs' && (
                  <div>
                    {ALL_EGGS.map((egg) => {
                      const found = getFoundEggs().includes(egg.id);
                      return (
                        <div
                          key={egg.id}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            padding: '6px 8px',
                            background: found ? 'rgba(250, 204, 0, 0.15)' : 'transparent',
                            border: '1px solid #161616',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            opacity: found ? 1 : 0.6
                          }}
                        >
                          <span>{found ? '🏆' : '🔒'}</span>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>{egg.title}</div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>{egg.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================================================
          Bottom Dock Bar (Capsule Tray with Candy-Colored Buttons Matching Screenshot)
          ========================================================================== */}
      <footer className="canvas-dock">
        {/* 1. Yellow: Profile */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#FACC00' }}
          onClick={() => toggleWindow('resume')}
          title="Résumé"
        >
          <span style={{ fontSize: '16px' }}>👤</span>
          {windows.find((w) => w.id === 'resume')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 2. Pastel Green: Briefcase / Projects */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#A6E3A1' }}
          onClick={() => toggleWindow('projects')}
          title="Projects"
        >
          <Briefcase size={16} />
          {windows.find((w) => w.id === 'projects')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 3. Pastel Orange: Sliders / Toolbox */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#FDBA74' }}
          onClick={() => toggleWindow('toolbox')}
          title="Toolbox"
        >
          <Sliders size={16} />
          {windows.find((w) => w.id === 'toolbox')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 4. Pastel Blue: Layers / Experience */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#93C5FD' }}
          onClick={() => toggleWindow('experience')}
          title="Experience"
        >
          <Layers size={16} />
          {windows.find((w) => w.id === 'experience')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 5. Pastel Mint: Mail */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#6EE7B7' }}
          onClick={() => {
            window.location.href = `mailto:${socials?.email || 'vasanthKumar49480@gmail.com'}`;
          }}
          title="Contact Email"
        >
          <Mail size={16} />
        </button>

        {/* 6. Pastel Lavender: Document / Résumé */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#C4B5FD' }}
          onClick={() => toggleWindow('resume')}
          title="Résumé Card"
        >
          <FileText size={16} />
          {windows.find((w) => w.id === 'resume')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 7. Pastel Purple: Notes Wall */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#D8B4FE' }}
          onClick={() => toggleWindow('notes')}
          title="Guestbook Notes"
        >
          <span style={{ fontSize: '15px' }}>✏️</span>
          {windows.find((w) => w.id === 'notes')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 8. Pastel Peach: Hardware Archive */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#FED7AA' }}
          onClick={() => toggleWindow('archive')}
          title="Hardware Hacking Archive"
        >
          <Cpu size={16} />
          {windows.find((w) => w.id === 'archive')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 9. Pastel Yellow: Document / Now */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#FEF08A' }}
          onClick={() => toggleWindow('now')}
          title="Now Page"
        >
          <Clock size={16} />
          {windows.find((w) => w.id === 'now')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 10. Pastel Periwinkle: Pulse / Analytics */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#A5B4FC' }}
          onClick={() => toggleWindow('analytics')}
          title="Live Analytics"
        >
          <Activity size={16} />
          {windows.find((w) => w.id === 'analytics')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 11. Pastel Green: Arcade */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#86EFAC' }}
          onClick={() => toggleWindow('arcade')}
          title="Playable Retro Arcade"
        >
          <Gamepad2 size={16} />
          {windows.find((w) => w.id === 'arcade')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 12. Pastel Lime: Terminal */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#BEF264' }}
          onClick={() => toggleWindow('terminal')}
          title="In-Browser CLI"
        >
          <Terminal size={16} />
          {windows.find((w) => w.id === 'terminal')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 13. Pastel Pink: Themes */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#F472B6' }}
          onClick={() => toggleWindow('themes')}
          title="Theme Palette Selector"
        >
          <Palette size={16} />
          {windows.find((w) => w.id === 'themes')?.open && <div className="canvas-dock-indicator" />}
        </button>

        {/* 14. Pastel Peach: Secrets */}
        <button
          type="button"
          className="canvas-dock-tile"
          style={{ background: '#FDBA74' }}
          onClick={() => toggleWindow('eggs')}
          title="Secret Achievements"
        >
          <Trophy size={16} />
          {windows.find((w) => w.id === 'eggs')?.open && <div className="canvas-dock-indicator" />}
        </button>

        <div className="canvas-dock-divider" />

        {/* GitHub link */}
        <a
          href={socials?.github || "https://github.com/vasanth246810"}
          target="_blank"
          rel="noopener noreferrer"
          className="canvas-dock-tile circle"
          title="GitHub"
        >
          <Github size={15} />
        </a>

        {/* LinkedIn link */}
        <a
          href={socials?.linkedin || "https://www.linkedin.com/in/vasanth-s-8a6461269/"}
          target="_blank"
          rel="noopener noreferrer"
          className="canvas-dock-tile circle"
          title="LinkedIn"
        >
          <Linkedin size={15} />
        </a>
      </footer>

      {/* ==========================================================================
          Bottom Right Zoom Pill (Matching Screenshot: -  72%  +)
          ========================================================================== */}
      <div className="canvas-zoom-pill">
        <button
          type="button"
          className="canvas-zoom-btn"
          onClick={() => handleZoom(-0.08)}
          title="Zoom out"
        >
          -
        </button>
        <span>{Math.round(camera.s * 100)}%</span>
        <button
          type="button"
          className="canvas-zoom-btn"
          onClick={() => handleZoom(0.08)}
          title="Zoom in"
        >
          +
        </button>
      </div>

      {/* Global Command Palette (⌘K) */}
      {isCmdOpen && (
        <div className="canvas-cmd-overlay" onClick={() => setIsCmdOpen(false)}>
          <div className="canvas-cmd-card" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              className="canvas-cmd-input"
              placeholder="Search cards, games, themes, hardware... (Esc to close)"
              value={cmdSearch}
              onChange={(e) => setCmdSearch(e.target.value)}
              autoFocus
            />
            <div className="canvas-cmd-list">
              {windows
                .filter((w) => w.title.toLowerCase().includes(cmdSearch.toLowerCase()))
                .map((w) => (
                  <div
                    key={w.id}
                    className="canvas-cmd-item"
                    onClick={() => {
                      flyToCard(w.id);
                      setIsCmdOpen(false);
                    }}
                  >
                    <span>{w.title}</span>
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>Fly to card ↗</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
