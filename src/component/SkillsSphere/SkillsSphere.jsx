import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './SkillsSphere.css';
import {
  calculateFibonacciSpherePoints,
  rotateAndProjectPoint,
  calculateSphereRadii,
  lerp,
} from './sphereGeometry';
import { CATEGORIES, STANDARD_SKILLS } from './skillsData';
import { SkillIcon, SKILL_ASSET_IMAGES } from './skillAssetIcons.jsx';

/**
 * Interactive 3D Spherical Skills Visualization Component.
 * Supports:
 * - displayMode: 'icons' (clean floating icon badges) | 'names' (clean text typography)
 */
export default function SkillsSphere({
  skills = STANDARD_SKILLS,
  categories = CATEGORIES,
  selectedCategory: controlledCategory,
  onCategoryChange,
  displayMode: controlledDisplayMode,
  onDisplayModeChange,
  showModeSwitcher = true,
  forceFlat = false,
  reducedMotionOverride = null,
  idleSpeedY = 0.0022,
  idleSpeedX = 0.0008,
  radiusScale = 1.0,
  showFilters = true,
  showHint = true,
  theme = 'editorial',
  className = '',
}) {
  const [internalCategory, setInternalCategory] = useState('all');
  const activeCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;

  const [internalDisplayMode, setInternalDisplayMode] = useState('icons'); // 'icons' or 'names'
  const activeDisplayMode =
    controlledDisplayMode !== undefined ? controlledDisplayMode : internalDisplayMode;

  const [isFlatResponsive, setIsFlatResponsive] = useState(false);
  const [stageDimensions, setStageDimensions] = useState({ width: 600, height: 460 });
  const [isPaused, setIsPaused] = useState(false);

  const stageRef = useRef(null);
  const tagRefs = useRef([]);
  const animFrameRef = useRef(null);
  const isIntersectingRef = useRef(true);
  const isDocVisibleRef = useRef(true);

  // Physics and rotation state stored in refs to allow 60fps rendering without React reconciliations
  const sphereState = useRef({
    angleX: -0.2,
    angleY: 0.1,
    velX: idleSpeedX,
    velY: idleSpeedY,
    dragging: false,
    lastX: 0,
    lastY: 0,
    maxHalfWidth: activeDisplayMode === 'icons' ? 22 : 45,
  });

  // Determine effective reduced-motion preference
  const [systemReducedMotion, setSystemReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setSystemReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const prefersReducedMotion =
    reducedMotionOverride !== null ? reducedMotionOverride : systemReducedMotion;

  // Flatten when on small screens or forced by prop
  const effectiveIsFlat = forceFlat || isFlatResponsive;

  // 1. Generate Fibonacci sphere coordinates whenever skills count changes
  const fibonacciPoints = useMemo(() => {
    return calculateFibonacciSpherePoints(skills.length);
  }, [skills.length]);

  // Keep tagRefs sized correctly
  useEffect(() => {
    tagRefs.current = tagRefs.current.slice(0, skills.length);
  }, [skills.length]);

  // Measure widest tag to calculate optimal radius and prevent edge clipping
  useEffect(() => {
    if (effectiveIsFlat || !tagRefs.current.length) return;
    let maxW = activeDisplayMode === 'icons' ? 44 : 50;
    tagRefs.current.forEach((el) => {
      if (el) {
        const w = el.offsetWidth;
        if (w > maxW) maxW = w;
      }
    });
    sphereState.current.maxHalfWidth = maxW / 2;
  }, [skills, effectiveIsFlat, activeDisplayMode]);

  // 2. Observe container size for responsive recalculation
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setStageDimensions({ width, height });
          setIsFlatResponsive(width < 560);
        }
      }
    });

    observer.observe(stageEl);
    return () => observer.disconnect();
  }, []);

  // 3. Track visibility and viewport intersection to pause animation when offscreen
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
      },
      { rootMargin: '100px 0px' }
    );

    io.observe(stageEl);

    const onVisibilityChange = () => {
      isDocVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // 4. Main 60fps 3D Animation & Projection Loop
  useEffect(() => {
    if (effectiveIsFlat || skills.length === 0) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const { rx, ry } = calculateSphereRadii(
      stageDimensions.width,
      stageDimensions.height,
      sphereState.current.maxHalfWidth
    );
    const effectiveRadii = { rx: rx * radiusScale, ry: ry * radiusScale };

    const render = () => {
      const state = sphereState.current;

      const shouldAnimate =
        isIntersectingRef.current &&
        isDocVisibleRef.current &&
        !isPaused;

      if (shouldAnimate) {
        if (!state.dragging) {
          if (!prefersReducedMotion) {
            state.angleY += state.velY;
            state.angleX += state.velX;

            // Decay drag momentum back to idle speeds
            state.velY = lerp(state.velY, idleSpeedY, 0.025);
            state.velX = lerp(state.velX, idleSpeedX, 0.025);
          } else {
            // When reduced motion is active, friction damps any manual rotation to 0
            state.velY = lerp(state.velY, 0, 0.1);
            state.velX = lerp(state.velX, 0, 0.1);
            state.angleY += state.velY;
            state.angleX += state.velX;
          }
        }

        // Project and render each tag
        for (let i = 0; i < fibonacciPoints.length; i++) {
          const point = fibonacciPoints[i];
          const tagEl = tagRefs.current[i];
          if (!tagEl || !point) continue;

          const projected = rotateAndProjectPoint(
            point,
            { angleX: state.angleX, angleY: state.angleY },
            effectiveRadii,
            stageDimensions
          );

          // Snap to integer pixels to prevent subpixel font and border blurring
          const screenX = Math.round(projected.screenX);
          const screenY = Math.round(projected.screenY);
          tagEl.style.left = `${screenX}px`;
          tagEl.style.top = `${screenY}px`;
          tagEl.style.transform = `translate3d(-50%, -50%, 0) scale(${projected.scale.toFixed(3)})`;
          tagEl.style.zIndex = projected.zIndex;

          const isDimmed = tagEl.classList.contains('dim');
          if (isDimmed) {
            tagEl.style.opacity = '0.08';
          } else {
            tagEl.style.opacity = projected.opacity.toFixed(3);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    fibonacciPoints,
    effectiveIsFlat,
    stageDimensions,
    idleSpeedX,
    idleSpeedY,
    radiusScale,
    prefersReducedMotion,
    isPaused,
    skills.length,
    activeDisplayMode,
  ]);

  // Handle Category Click
  const handleCategorySelect = useCallback(
    (catId) => {
      if (controlledCategory === undefined) {
        setInternalCategory(catId);
      }
      if (onCategoryChange) {
        onCategoryChange(catId);
      }
    },
    [controlledCategory, onCategoryChange]
  );

  // Handle Display Mode Toggle (Icons vs Names)
  const handleDisplayModeSelect = useCallback(
    (mode) => {
      if (controlledDisplayMode === undefined) {
        setInternalDisplayMode(mode);
      }
      if (onDisplayModeChange) {
        onDisplayModeChange(mode);
      }
    },
    [controlledDisplayMode, onDisplayModeChange]
  );

  // Pointer Drag Handlers
  const handlePointerDown = (e) => {
    if (effectiveIsFlat) return;
    const state = sphereState.current;
    state.dragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if pointer capture isn't supported
    }
  };

  const handlePointerMove = (e) => {
    const state = sphereState.current;
    if (!state.dragging || effectiveIsFlat) return;

    const dx = e.clientX - state.lastX;
    const dy = e.clientY - state.lastY;
    state.lastX = e.clientX;
    state.lastY = e.clientY;

    state.angleY += dx * 0.005;
    state.angleX -= dy * 0.005;

    // Set momentum velocities
    state.velY = dx * 0.0018;
    state.velX = -dy * 0.0018;
  };

  const handlePointerUp = (e) => {
    const state = sphereState.current;
    state.dragging = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }
  };

  // Keyboard Navigation on Sphere Stage
  const handleKeyDown = (e) => {
    if (effectiveIsFlat) return;
    const state = sphereState.current;
    const step = 0.14;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        state.angleY -= step;
        state.velY = -0.006;
        break;
      case 'ArrowRight':
        e.preventDefault();
        state.angleY += step;
        state.velY = 0.006;
        break;
      case 'ArrowUp':
        e.preventDefault();
        state.angleX -= step;
        state.velX = -0.006;
        break;
      case 'ArrowDown':
        e.preventDefault();
        state.angleX += step;
        state.velX = 0.006;
        break;
      case ' ':
        e.preventDefault();
        setIsPaused((prev) => !prev);
        break;
      default:
        break;
    }
  };

  // Count matching skills for a11y live feedback
  const matchCount = useMemo(() => {
    if (activeCategory === 'all') return skills.length;
    return skills.filter((s) => s.category === activeCategory).length;
  }, [skills, activeCategory]);

  const modeClass = activeDisplayMode === 'icons' ? 'mode-icon' : 'mode-name';

  // Helper to render icon or label according to activeDisplayMode
  const renderTagContent = (skill) => {
    if (activeDisplayMode === 'icons') {
      const rawKey = (skill.iconKey || skill.name || '').toLowerCase().trim();
      const lookupKey = rawKey.replace(/[^a-z0-9]/g, '');
      const hasIcon = skill.imageUrl || skill.iconKey || skill.iconComponent || skill.name;
      const IconComponent = skill.iconComponent;
      const iconSize = skill.weight === 3 ? 30 : skill.weight === 1 ? 22 : 26;

      const iconElement = (skill.imageUrl || lookupKey) ? (
        <SkillIcon
          icon={skill.iconKey || lookupKey}
          imageUrl={skill.imageUrl}
          size={iconSize}
          style={{ pointerEvents: 'none' }}
        />
      ) : IconComponent ? (
        <IconComponent
          className="sphere-tag-icon-svg"
          aria-hidden="true"
          size={iconSize}
          style={{ color: skill.brandColor || 'currentColor' }}
        />
      ) : (
        <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{skill.name.slice(0, 2)}</span>
      );

      return (
        <>
          {iconElement}
          <span className="sphere-tag-tooltip">{skill.name}</span>
        </>
      );
    }

    // Default: 'names' (pure text)
    return <span>{skill.name}</span>;
  };

  return (
    <div className={`skills-sphere-root ${theme ? `theme-${theme}` : ''} ${className}`}>
      {/* Primary Mode Switcher: Icons Alone vs Names Alone */}
      {showModeSwitcher && (
        <div className="skills-mode-bar" role="group" aria-label="Skill presentation mode">
          <div className="skills-mode-segmented">
            <button
              type="button"
              className={`mode-segmented-btn ${activeDisplayMode === 'icons' ? 'active' : ''}`}
              onClick={() => handleDisplayModeSelect('icons')}
              aria-pressed={activeDisplayMode === 'icons'}
              title="Show clean floating icon badges"
            >
              <span aria-hidden="true">🎯</span> Icons Alone
            </button>
            <button
              type="button"
              className={`mode-segmented-btn ${activeDisplayMode === 'names' ? 'active' : ''}`}
              onClick={() => handleDisplayModeSelect('names')}
              aria-pressed={activeDisplayMode === 'names'}
              title="Show clean technology names"
            >
              <span aria-hidden="true">🏷️</span> Names Alone
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Bar */}
      {showFilters && categories.length > 0 && (
        <div className="skills-filters-bar">
          <nav
            className="skills-filters"
            role="toolbar"
            aria-label="Skill category filters"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`skills-filter-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.id)}
                  aria-pressed={isActive}
                >
                  <span
                    className="filter-dot"
                    data-cat={cat.id}
                    style={
                      cat.id !== 'all'
                        ? { backgroundColor: cat.color }
                        : { backgroundColor: 'var(--sphere-ink, #ffffff)' }
                    }
                    aria-hidden="true"
                  />
                  {cat.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Screen Reader Live Region for Filter Feedback */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeCategory === 'all'
          ? `Showing all ${skills.length} skills in ${activeDisplayMode} mode`
          : `Showing ${matchCount} skills in ${
              categories.find((c) => c.id === activeCategory)?.label || activeCategory
            }`}
      </div>

      {/* 3D Stage / Responsive Fallback Container */}
      {skills.length === 0 ? (
        <div className="skills-sphere-empty" role="status">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <p>No skills found in this dataset.</p>
        </div>
      ) : (
        <div
          ref={stageRef}
          className={`skills-sphere-stage ${effectiveIsFlat ? 'flat' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          tabIndex={effectiveIsFlat ? -1 : 0}
          role={effectiveIsFlat ? 'region' : 'application'}
          aria-label={
            effectiveIsFlat
              ? 'List of technology skills'
              : `Interactive 3D skills sphere in ${activeDisplayMode} mode. Use mouse or touch to spin. Use arrow keys to rotate, space to pause.`
          }
        >
          <div className="sphere-cloud" aria-hidden={!effectiveIsFlat ? 'true' : 'false'}>
            {skills.map((skill, index) => {
              const matches = activeCategory === 'all' || skill.category === activeCategory;
              const isMatchActive = matches && activeCategory !== 'all';
              const isDimmed = !matches;

              return (
                <div
                  key={`${skill.name}-${index}`}
                  ref={(el) => {
                    tagRefs.current[index] = el;
                  }}
                  className={`sphere-tag ${modeClass} ${isDimmed ? 'dim' : ''} ${
                    isMatchActive ? 'match' : ''
                  }`}
                  data-cat={skill.category}
                  data-weight={skill.weight || 2}
                  title={`${skill.name} (${skill.category})`}
                >
                  {renderTagContent(skill)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Guidance Hint */}
      {showHint && !effectiveIsFlat && skills.length > 0 && (
        <p className="skills-sphere-hint" aria-hidden="true">
          Drag to spin &bull; Keys <kbd>&larr;</kbd> <kbd>&rarr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd> &bull; <kbd>Space</kbd> to {isPaused ? 'resume' : 'pause'}
        </p>
      )}

      {/* Semantic Accessible Representation (for screen readers when in 3D mode) */}
      {!effectiveIsFlat && skills.length > 0 && (
        <section className="sr-only" aria-label="Structured skills directory">
          <h3>Skills Directory</h3>
          <ul>
            {skills.map((skill, i) => (
              <li key={`sr-${skill.name}-${i}`}>
                {skill.name} — Category:{' '}
                {categories.find((c) => c.id === skill.category)?.label || skill.category}, Importance Level:{' '}
                {skill.weight || 2} of 3
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
