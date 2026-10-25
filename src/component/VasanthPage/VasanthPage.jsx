import React, { useState, useEffect, useRef, useMemo } from 'react';
import './VasanthPage.css';
import CanvasOS from './CanvasOS';
import SkillsSphere from '../SkillsSphere/SkillsSphere';
import GitContributionMap from '../GitContributions/GitContributionMap';
import {
  THEMES,
  SKILL_CATEGORIES as STATIC_SKILL_CATEGORIES,
  EXPERIENCES as STATIC_EXPERIENCES,
  PROJECTS as STATIC_PROJECTS,
  EDUCATION as STATIC_EDUCATION,
  AWARDS as STATIC_AWARDS,
  WRITINGS as STATIC_WRITINGS,
  DEFAULT_PROFILE,
  DEFAULT_SOCIALS,
  DEFAULT_SKILL_ITEMS
} from './vasanthData';
import { CATEGORIES } from '../SkillsSphere/skillsData';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import Profile1 from '../../assets/Profile1.jpg';
import EventifyImg from '../../assets/Eventify.png';
import TomatoImg from '../../assets/Tomato.png';
import previewImg from '../../assets/preview.webp';
import { TechIcon } from './TechIcons';
import { DEFAULT_SETTINGS } from '../Navbar';

const vasanthPortrait = Profile1;

const PROJECT_MOCKUPS = {
  eventify: EventifyImg,
  'food-project': TomatoImg,
  'portfolio-3d': EventifyImg
};

import {
  ArrowLeft,
  ArrowUp,
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  Code2,
  Terminal,
  Database,
  Cpu,
  Mail,
  Github,
  Linkedin,
  FileText,
  RotateCw,
  Monitor,
  Sun,
  Settings,
  X,
  Menu,
  ChevronDown
} from 'lucide-react';

export default function VasanthPage({
  onOpenClassicPortfolio,
  onReturnToPortfolio,
  onOpenAdmin,
  settings = DEFAULT_SETTINGS,
  onSettingsChange
}) {
  const {
    skills: liveSkills,
    projects: liveProjects,
    experiences: liveExperiences,
    profile,
    socials,
    skillCategories: liveSkillCategories,
    education: liveEducation,
    awards: liveAwards,
    writings: liveWritings
  } = usePortfolioData();

  const PROJECTS = liveProjects && liveProjects.length > 0 ? liveProjects : STATIC_PROJECTS;
  const EXPERIENCES = liveExperiences && liveExperiences.length > 0 ? liveExperiences : STATIC_EXPERIENCES;
  const SKILL_CATEGORIES = liveSkillCategories && liveSkillCategories.length > 0 ? liveSkillCategories : STATIC_SKILL_CATEGORIES;
  const EDUCATION = liveEducation && liveEducation.length > 0 ? liveEducation : STATIC_EDUCATION;
  const AWARDS = liveAwards && liveAwards.length > 0 ? liveAwards : STATIC_AWARDS;
  const WRITINGS = liveWritings && liveWritings.length > 0 ? liveWritings : STATIC_WRITINGS;
  const activeProfile = profile || DEFAULT_PROFILE;
  const activeSocials = socials || DEFAULT_SOCIALS;

  const normalizeSkillCategory = (category) => {
    if (!category) return 'frontend_backend';
    const c = category.toString().trim().toLowerCase();
    if (c.includes('front') || c.includes('back') || c.includes('fullstack') || c.includes('web')) {
      return 'frontend_backend';
    }
    if (c.includes('lang') || c.includes('script') || c.includes('code')) {
      return 'languages';
    }
    if (c.includes('ai') || c.includes('ml') || c.includes('intelligence') || c.includes('learn')) {
      return 'ai_ml';
    }
    if (c.includes('cloud') || c.includes('devops') || c.includes('infra') || c.includes('deploy') || c.includes('aws') || c.includes('docker')) {
      return 'cloud_infra';
    }
    if (c.includes('data') || c.includes('tool') || c.includes('db') || c.includes('sql') || c.includes('git')) {
      return 'databases_tools';
    }
    return 'frontend_backend';
  };

  const dynamicSphereSkills = useMemo(() => {
    const sourceList = liveSkills && liveSkills.length > 0 ? liveSkills : DEFAULT_SKILL_ITEMS;
    return sourceList.map((s) => ({
      name: s.name,
      category: normalizeSkillCategory(s.category),
      weight: s.weight || (s.level === 'Expert' ? 3 : s.level === 'Familiar' ? 1 : 2),
      iconKey: s.icon ? s.icon.toLowerCase() : null,
      imageUrl: s.imageUrl || null,
      brandColor: s.color || '#38bdf8'
    }));
  }, [liveSkills]);

  const activeCategories = useMemo(() => {
    const presentCats = new Set(dynamicSphereSkills.map((s) => s.category));
    return CATEGORIES.filter((c) => c.id === 'all' || presentCats.has(c.id));
  }, [dynamicSphereSkills]);

  const currentViewMode = settings.viewMode || 'sphere-icons';
  const activeDisplayMode = currentViewMode === 'sphere-names' ? 'names' : 'icons';

  const [viewMode, setViewMode] = useState('classic'); // 'classic' or 'canvas'
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('portfolio_theme');
        if (saved) return saved;
      } catch {}
    }
    return 'obsidian'; // Defaults to modern obsidian dark theme when dark mode is loaded
  });

  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_theme', themeId);
        if (themeId !== 'cream') {
          localStorage.setItem('last_dark_theme', themeId);
        }
      } catch {}
    }
  };
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isPortraitFlipped, setIsPortraitFlipped] = useState(false);
  const [activeExperienceId, setActiveExperienceId] = useState(EXPERIENCES[0]?.id || 'fullstack-dev');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedExpIds, setExpandedExpIds] = useState(() => ({ [EXPERIENCES[0]?.id || '']: true }));

  const toggleExpAccordion = (id) => {
    setExpandedExpIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const updateSetting = (key, value) => {
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        [key]: value
      });
    }
  };

  const isSphereView = currentViewMode !== 'classic-grid';

  useEffect(() => {
    if (EXPERIENCES.length > 0 && !EXPERIENCES.some(e => e.id === activeExperienceId)) {
      setActiveExperienceId(EXPERIENCES[0].id);
    }
  }, [EXPERIENCES, activeExperienceId]);

  // Auto-selection scroll spy: as user scrolls down the page, automatically activate corresponding left item
  const handleWindowScroll = () => {
    if (isClickScrollingRef.current) return;

    // Viewport focal line: ~32% from the top of the viewport
    const focalPoint = window.innerHeight * 0.32;
    let foundId = null;

    // 1. Check if any experience card spans across the focal line
    for (let i = 0; i < EXPERIENCES.length; i++) {
      const exp = EXPERIENCES[i];
      const el = document.getElementById(`xp-card-${exp.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= focalPoint && rect.bottom > focalPoint) {
          foundId = exp.id;
          break;
        }
      }
    }

    // 2. If no card directly spans focalPoint, pick the card closest to focalPoint
    if (!foundId) {
      let minDistance = Infinity;
      for (let i = 0; i < EXPERIENCES.length; i++) {
        const exp = EXPERIENCES[i];
        const el = document.getElementById(`xp-card-${exp.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const cardCenter = (rect.top + rect.bottom) / 2;
          const dist = Math.abs(cardCenter - focalPoint);
          if (dist < minDistance) {
            minDistance = dist;
            foundId = exp.id;
          }
        }
      }
    }

    if (foundId) {
      setActiveExperienceId((prev) => (prev === foundId ? prev : foundId));
    }
  };

  // Ensure body margin-top does not displace sticky navigation
  useEffect(() => {
    const prevMarginTop = document.body.style.marginTop;
    document.body.style.marginTop = '0px';
    return () => {
      document.body.style.marginTop = prevMarginTop;
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('resize', handleWindowScroll, { passive: true });

    // Initial evaluation
    handleWindowScroll();

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('resize', handleWindowScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToExperienceCard = (id) => {
    setActiveExperienceId(id);
    isClickScrollingRef.current = true;
    const targetEl = document.getElementById(`xp-card-${id}`);

    if (targetEl) {
      const headerOffset = 100;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 700);
    }
  };

  if (viewMode === 'canvas') {
    return (
      <CanvasOS
        onReturnToPortfolio={onReturnToPortfolio}
        onSwitchToClassic={() => setViewMode('classic')}
      />
    );
  }

  const toggleTheme = () => {
    handleSelectTheme(currentTheme === 'cream' ? 'obsidian' : 'cream');
  };

  const displayName = (activeProfile.name || 'Vasanth S').trim();

  return (
    <div className="aahil-system" data-theme={currentTheme}>
      {/* 1. Header Bar */}
      <header className="ak-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* {(onOpenClassicPortfolio || onReturnToPortfolio) && (
            <button
              type="button"
              className="ak-return-btn"
              onClick={onOpenClassicPortfolio || onReturnToPortfolio}
              title="View the classic portfolio"
            >
              <ArrowLeft size={14} />
              <span>Classic Portfolio</span>
            </button>
          )} */}

          {/* Initials badge */}
          <a href="#top" className="ak-mark-square" aria-label="Top">
            {activeProfile.initials || 'VS'}
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <ul className="ak-nav-links" style={{ display: 'flex', gap: '22px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><a href="#about">About</a></li>
            <li><a href="#toolbox">Skills</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#activity">Activity</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          {/* Display Settings Button */}
          <button
            type="button"
            className="ak-settings-btn"
            onClick={() => setShowSettingsModal(true)}
            title="Display Preferences & 3D Sphere Settings"
            aria-label="Display Preferences"
          >
            <Settings size={16} />
          </button>

          {/* Theme Toggle Sun Button */}
          <button
            type="button"
            className="ak-theme-toggle-btn"
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            <Sun size={17} />
          </button>

          {/* Résumé PDF Button */}
          <a
            href={activeProfile.resumeUrl || "/Vasanth_Resume.pdf"}
            download
            className="ak-resume-btn"
          >
            <span>Résumé</span>
            <span>↓</span>
          </a>

          {/* Mobile Hamburger Menu Button (Matching Image 1) */}
          <button
            type="button"
            className="ak-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation (Matching Image 1 UX) */}
      {isMobileMenuOpen && (
        <div className="ak-mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="ak-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="ak-mobile-drawer-header">
              <div className="ak-mobile-drawer-brand">
                <span className="ak-mark-square">{activeProfile.initials || 'VS'}</span>
                <span className="ak-mobile-drawer-name">{displayName}</span>
              </div>
              <button
                type="button"
                className="ak-mobile-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="ak-mobile-drawer-nav">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a href="#toolbox" onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
              <a href="#experience" onClick={() => setIsMobileMenuOpen(false)}>Experience</a>
              <a href="#work" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
              <a href="#activity" onClick={() => setIsMobileMenuOpen(false)}>Activity</a>
              <a href="#education" onClick={() => setIsMobileMenuOpen(false)}>Education</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            </nav>

            <div className="ak-mobile-drawer-footer">
              <a
                href={activeProfile.resumeUrl || "/Vasanth_Resume.pdf"}
                download
                className="ak-resume-btn"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Download Résumé PDF ↓</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="ak-hero">
        <div className="ak-hero-grid" />

        <div className="ak-wrap">
          {/* Eyebrow */}
          <div className="ak-eyebrow-row">
            <span className="ak-eyebrow-text">{(activeProfile.location || 'TAMIL NADU, INDIA').toUpperCase()}</span>
            <div className="ak-eyebrow-line" />
          </div>

          {/* Name: Keep initial S near first name with a space on a single line */}
          <h1 className="ak-hero-name">
            {displayName.toUpperCase()}
          </h1>

          {/* Headline */}
          <p className="ak-hero-headline">
            {activeProfile.showcaseHeadline || (
              <>Full-stack engineer building <b>dynamic web applications and scalable systems</b> that hold up in production.</>
            )}
          </p>

          {/* Hero Action Buttons */}
          <div className="ak-hero-actions">
            <a href="#work" className="ak-cta-pill">
              <span>See the work</span>
              <span className="ak-cta-arrow">→</span>
            </a>

            {/* Canvas button: hidden by default until turned on via Settings */}
            {settings.showCanvasLink && (
              <button
                type="button"
                className="ak-ghost-pill"
                onClick={() => setViewMode('canvas')}
                title="Launch interactive infinite desktop OS with retro arcade & lofi"
              >
                <span className="ak-ghost-dot" />
                <span>There’s a far more fun version of this</span>
                <span className="ak-ghost-badge">highly recommended</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <main id="top" className="ak-wrap">
        {/* 3. About Section */}
        <section id="about" className="ak-section ak-about-section">
          <div className="ak-sec-eyebrow-row">
            <span className="ak-sec-eyebrow-text">ABOUT</span>
            <div className="ak-sec-eyebrow-line" />
          </div>

          <h2 className="ak-about-title">{activeProfile.aboutTitle || 'Hi there!'}</h2>

          <div className="ak-about-grid">
            {/* Real portrait photo card with subtle 3D flip card interaction */}
            <div
              className={`ak-flip-card ${isPortraitFlipped ? 'flipped' : ''}`}
              onClick={() => setIsPortraitFlipped(!isPortraitFlipped)}
              title="Click to flip card"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsPortraitFlipped(!isPortraitFlipped);
                }
              }}
            >
              <div className="ak-flip-inner">
                <div className="ak-flip-front">
                  <img
                    src={activeProfile.avatarUrl || vasanthPortrait}
                    alt={activeProfile.name || "Profile"}
                    className="ak-portrait-img"
                  />
                  <span className="ak-flip-hint">
                    <RotateCw size={12} /> flip
                  </span>
                </div>

                <div className="ak-flip-back">
                  <h4>{activeProfile.flipCardTitle || `${activeProfile.name || 'Vasanth S'} ⚡`}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                    {activeProfile.flipCardBack || 'Full-Stack Developer passionate about building user-friendly web applications, clean APIs, and interactive systems.'}
                  </p>
                  <span className="ak-flip-hint" style={{ color: 'inherit' }}>
                    <RotateCw size={12} /> flip back
                  </span>
                </div>
              </div>
            </div>

            {/* About Lede & Paragraphs */}
            <div className="ak-about-content">
              <h3 className="ak-about-lede">
                {activeProfile.aboutBio || 'I build AI stuff and anything else I find interesting, RAG pipelines, multi agent systems, Full Stack apps, and generally anything that looks shiny at 2AM in the morning :)'}
              </h3>

              <div className="ak-about-paras">
                {(activeProfile.aboutParas && activeProfile.aboutParas.length > 0 ? activeProfile.aboutParas : [
                  "Final year Computer Engineering with strong foundational experience across modern web and software development.",
                  "Splitting my time between building production-grade web systems and researching emerging AI architectures.",
                  "I love building interactive tools, clean interfaces, and developer-friendly platforms."
                ]).map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Toolbox / Skills Section */}
        <section id="toolbox" className="ak-section ak-toolbox-section">
          <div className="ak-sec-eyebrow-row">
            <span className="ak-sec-eyebrow-text">TOOLBOX</span>
            <div className="ak-sec-eyebrow-line" />
          </div>

          <h2 className="ak-toolbox-title">What I build with</h2>

          {isSphereView ? (
            <div className="ak-toolbox-sphere-container">
              <SkillsSphere
                skills={dynamicSphereSkills}
                categories={activeCategories}
                displayMode={activeDisplayMode}
                theme="editorial"
                idleSpeedY={settings.autoSpin ? 0.0022 * settings.speedMultiplier : 0.0018}
                idleSpeedX={settings.autoSpin ? 0.0008 * settings.speedMultiplier : 0.0006}
                radiusScale={settings.radiusScale || 1.0}
                reducedMotionOverride={!settings.autoSpin ? true : null}
                showModeSwitcher={false}
                showFilters={true}
                showHint={true}
              />
            </div>
          ) : (
            <div className="ak-toolbox-table">
              {SKILL_CATEGORIES.map((category) => (
                <div key={category.category} className="ak-toolbox-row">
                  <div className="ak-toolbox-label">{category.category}</div>
                  <div className="ak-toolbox-pills">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="ak-tech-badge">
                        {skill.imageUrl ? (
                          <span className="ak-tech-icon">
                            <img
                              src={skill.imageUrl}
                              alt={skill.name}
                              style={{ width: 18, height: 18, objectFit: 'contain' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </span>
                        ) : (
                          <span className="ak-tech-icon">
                            <TechIcon name={skill.icon || skill.name} size={18} />
                          </span>
                        )}
                        <span className="ak-tech-name">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Experience Section */}
        <section id="experience" className="ak-section ak-xp-section">
          <div className="ak-xp-sticky-layout">
            {/* Sticky Left Sidebar Navigation */}
            <div className="ak-xp-left-col">
              <div className="ak-sec-eyebrow-row">
                <span className="ak-sec-eyebrow-text">EXPERIENCE</span>
                <div className="ak-sec-eyebrow-line" />
              </div>

              <h2 className="ak-xp-title">Where I've been</h2>

              <nav className="ak-xp-nav-list" aria-label="Experience navigation">
                {EXPERIENCES.map((exp) => {
                  const isActive = activeExperienceId === exp.id;
                  return (
                    <button
                      key={exp.id}
                      id={`xp-btn-${exp.id}`}
                      type="button"
                      className={`ak-xp-nav-btn ${isActive ? 'active' : ''}`}
                      onClick={() => scrollToExperienceCard(exp.id)}
                      aria-current={isActive ? 'true' : 'false'}
                    >
                      <span className="ak-xp-nav-indicator">
                        {isActive ? (
                          <span className="ak-xp-dot-active" />
                        ) : (
                          <span className="ak-xp-dot-inactive" />
                        )}
                      </span>
                      <div className="ak-xp-nav-info">
                        <span className="ak-xp-nav-company">{exp.company}</span>
                        <span className="ak-xp-nav-meta">
                          {exp.role && exp.period
                            ? `${exp.role} · ${exp.period}`
                            : (exp.navMeta || exp.role || exp.period || '')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Experience Cards Column */}
            <div className="ak-xp-cards-col">
              {EXPERIENCES.map((exp) => {
                const isCardActive = activeExperienceId === exp.id;
                return (
                  <article
                    key={exp.id}
                    id={`xp-card-${exp.id}`}
                    className={`ak-xp-card ${isCardActive ? 'active' : ''}`}
                  >
                    <div className="ak-xp-card-meta">
                      <span className="ak-xp-card-period">{exp.period}</span>
                      {exp.location && <span className="ak-xp-card-loc">· {exp.location}</span>}
                    </div>

                    <p className="ak-xp-card-lede">{exp.lede}</p>

                    {exp.points && exp.points.length > 0 && (
                      <ul className="ak-xp-card-points">
                        {exp.points.map((pt, idx) => (
                          <li key={idx}>
                            <span className="ak-xp-bullet" />
                            <span
                              className="ak-xp-point-text"
                              dangerouslySetInnerHTML={{ __html: pt }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="ak-xp-card-chips">
                      {(exp.chips || []).map((chip) => (
                        <span key={chip} className="ak-xp-chip">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Mobile Experience Accordion (Screens <= 768px - Matching Image 4) */}
          <div className="ak-xp-mobile-list">
            <div className="ak-sec-eyebrow-row">
              <span className="ak-sec-eyebrow-text">EXPERIENCE</span>
              <div className="ak-sec-eyebrow-line" />
            </div>

            <h2 className="ak-xp-title" style={{ marginBottom: '24px' }}>Where I've been</h2>

            <div className="ak-xp-accordion-group">
              {EXPERIENCES.map((exp) => {
                const isExpanded = !!expandedExpIds[exp.id];
                return (
                  <div
                    key={exp.id}
                    className={`ak-xp-accordion-card ${isExpanded ? 'expanded' : ''}`}
                  >
                    <button
                      type="button"
                      className="ak-xp-accordion-header"
                      onClick={() => toggleExpAccordion(exp.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className="ak-xp-accordion-meta-block">
                        <span className="ak-xp-accordion-period">
                          {exp.period} {exp.location ? `· ${exp.location}` : ''}
                        </span>
                        <div className="ak-xp-accordion-role-line">
                          <span className="ak-xp-accordion-role">{exp.role}</span>
                          <span className="ak-xp-accordion-sep"> — </span>
                          <span className="ak-xp-accordion-company">{exp.company}</span>
                        </div>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`ak-xp-accordion-chevron ${isExpanded ? 'rotated' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ak-xp-accordion-content">
                        {exp.lede && (
                          <p className="ak-xp-card-lede">{exp.lede}</p>
                        )}
                        {exp.points && exp.points.length > 0 && (
                          <ul className="ak-xp-card-points">
                            {exp.points.map((pt, idx) => (
                              <li key={idx}>
                                <span className="ak-xp-bullet" />
                                <span
                                  className="ak-xp-point-text"
                                  dangerouslySetInnerHTML={{ __html: pt }}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                        {exp.chips && exp.chips.length > 0 && (
                          <div className="ak-xp-card-chips">
                            {exp.chips.map((chip) => (
                              <span key={chip} className="ak-xp-chip">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Selected Work */}
        <section id="work" className="ak-section ak-work-section">
          <div className="ak-work-header">
            <h2 className="ak-work-title">
              <span>Things worth opening</span>
              <span className="ak-work-title-dot" />
            </h2>
            <p className="ak-work-subtitle">
              Each of these has highlights, tech stack, and links to source or live deployment.
            </p>
          </div>

          <div className="ak-work-list">
            {PROJECTS.map((project, index) => {
              const isEven = index % 2 === 1;
              return (
                <article
                  key={project.id || index}
                  className={`ak-project-row ${isEven ? 'reversed' : ''}`}
                >
                  {/* Mockup Column */}
                  <div className="ak-project-visual">
                    <div className="ak-device-frame">
                      <img
                        src={PROJECT_MOCKUPS[project.id] || project.image || EventifyImg}
                        alt={`${project.title} interface preview`}
                        className="ak-device-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = EventifyImg;
                        }}
                      />
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="ak-project-details">
                    <div className="ak-project-no">{project.no || `0${index + 1} / 2026`}</div>
                    <h3 className="ak-project-name">{project.title}</h3>
                    {project.tag && <h4 className="ak-project-tag">{project.tag}</h4>}
                    <p className="ak-project-lede">{project.lede || project.description}</p>

                    {project.award && (
                      <div className="ak-project-award">
                        <span>{project.award}</span>
                      </div>
                    )}

                    <div className="ak-project-chips">
                      {(project.chips || []).map((chip) => (
                        <span key={chip} className="ak-project-chip">
                          {chip}
                        </span>
                      ))}
                    </div>

                    <a
                      href={project.githubUrl || project.linkUrl || "https://github.com/vasanth246810"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ak-project-cta"
                    >
                      <span>{project.linkText || 'Read the write-up'}</span>
                      <span>→</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 6b. Git Contribution Map & Open Source */}
        <section id="activity" className="ak-section ak-activity-section">
          <div className="ak-sec-eyebrow-row">
            <span className="ak-sec-eyebrow-text">OPEN SOURCE &amp; TELEMETRY</span>
            <div className="ak-sec-eyebrow-line" />
          </div>

          <h2 className="ak-toolbox-title">Code Activity &amp; Commit Streaks</h2>

          <GitContributionMap variant="showcase" parentTheme={currentTheme} />
        </section>

        {/* 7. Education */}
        <section id="education" className="ak-section ak-creds-section">
          <div className="ak-sec-eyebrow-row">
            <span className="ak-sec-eyebrow-text">ACADEMIC BACKGROUND</span>
            <div className="ak-sec-eyebrow-line" />
          </div>

          <h2 className="ak-toolbox-title">Education</h2>

          <div className="ak-creds-grid">
            {/* Education */}
            <div className="ak-cred-card">
              <h3>Education</h3>
              <ul className="ak-cred-list">
                {EDUCATION.map((edu, idx) => (
                  <li key={edu.id || idx} className="ak-edu-item">
                    <div className="ak-edu-header">
                      <div className="ak-edu-main">
                        <b className="ak-edu-degree">{edu.degree}</b>
                        <span className="ak-edu-institution">{edu.institution}</span>
                      </div>
                      <div className="ak-edu-meta">
                        {edu.period}{edu.score ? ` · ${edu.score}` : ''}
                      </div>
                    </div>
                    {edu.highlights && (
                      <p className="ak-edu-highlights">{edu.highlights}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 8. Contact Section */}
        <section id="contact" className="ak-section ak-closer-section">
          <h2 className="ak-closer-title">
            <span>Let’s build</span>
            <span>something.</span>
          </h2>

          <p className="ak-closer-lede">
            Open for cool builds and interesting problems. The fastest way to reach me is email, I answer all of them.
          </p>

          <div className="ak-closer-email-wrap">
            <a href={`mailto:${activeSocials.email || 'vasanthKumar49480@gmail.com'}`} className="ak-closer-email">
              {activeSocials.email || 'vasanthKumar49480@gmail.com'}
            </a>
          </div>

          <div className="ak-closer-pills">
            {activeSocials.github && (
              <a
                href={activeSocials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ak-contact-pill"
              >
                <span>GitHub</span>
                <span>↗</span>
              </a>
            )}

            {activeSocials.linkedin && (
              <a
                href={activeSocials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="ak-contact-pill"
              >
                <span>LinkedIn</span>
                <span>↗</span>
              </a>
            )}

            <a
              href={activeProfile.resumeUrl || "/Vasanth_Resume.pdf"}
              download
              className="ak-contact-pill"
            >
              <span>Résumé</span>
              <span>↓</span>
            </a>
          </div>

          {/* Secret Door ("The Desk") - Hidden by default until showCanvasLink is enabled */}
          {settings.showCanvasLink && (
            <div className="ak-door" id="desk">
              <div className="ak-door-copy">
                <p className="ak-door-title">Oh, and this page is the boring half.</p>
                <p>
                  The main portfolio is finished. This one is a little less serious. There's a canvas, beautiful cards, a few games, lofi, and probably more than there needs to be.
                </p>
                <p>
                  Some of it keeps score. Try not to take that personally.
                </p>
                <p>
                  There are things here that aren't meant to be obvious. If you find one, you find one.
                </p>
              </div>
              <div className="ak-door-go">
                <button
                  type="button"
                  className="ak-door-btn"
                  onClick={() => setViewMode('canvas')}
                >
                  <span>Open the canvas →</span>
                </button>
                <p className="ak-door-note">
                  Only Desktops supported. This<br />
                  place has a lot going on.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="ak-footer">
          <div className="ak-footer-left">
            {activeProfile.name || 'Vasanth S'} · {activeProfile.location || 'Tamil Nadu, India'}
          </div>
          <div className="ak-footer-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>Thanks for scrolling all the way down :)</span>
            {/* CMS link hidden per user request; CMS remains accessible via Ctrl+Shift+A hotkey or ?page=admin */}
          </div>
        </footer>
      </main>

      {/* Floating Scroll to Top button */}
      <button
        type="button"
        className="ak-scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>

      {/* Display Preferences Floating Popover (Opened from Navbar Settings Icon) */}
      {showSettingsModal && (
        <>
          <div
            className="ak-popover-dismiss"
            onClick={() => setShowSettingsModal(false)}
          />
          <div className="ak-settings-popover" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(128,128,128,0.2)' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} /> Display Preferences
              </h3>
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: '4px' }}
                onClick={() => setShowSettingsModal(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Theme & Palette Live Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.8 }}>
                Dark / Light Color Theme
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`ak-toolbox-btn ${currentTheme === t.id ? 'active' : ''}`}
                    style={{ justifyContent: 'space-between', width: '100%', padding: '7px 10px', fontSize: '12px' }}
                    onClick={() => handleSelectTheme(t.id)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: t.bg,
                          boxShadow: `0 0 0 2px ${t.accent}`,
                          display: 'inline-block'
                        }}
                      />
                      <span>{t.icon} <strong>{t.name}</strong></span>
                    </span>
                    <span style={{ fontSize: '10px', opacity: 0.65 }}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '12px', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.8 }}>
                Skills Presentation Mode
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  className={`ak-toolbox-btn ${currentViewMode === 'sphere-icons' ? 'active' : ''}`}
                  style={{ justifyContent: 'flex-start', width: '100%', padding: '9px 12px', fontSize: '12px' }}
                  onClick={() => updateSetting('viewMode', 'sphere-icons')}
                >
                  <span style={{ fontSize: '14px' }}>🎯</span> <strong>3D Sphere</strong> (Icons Alone)
                </button>
                <button
                  type="button"
                  className={`ak-toolbox-btn ${currentViewMode === 'sphere-names' ? 'active' : ''}`}
                  style={{ justifyContent: 'flex-start', width: '100%', padding: '9px 12px', fontSize: '12px' }}
                  onClick={() => updateSetting('viewMode', 'sphere-names')}
                >
                  <span style={{ fontSize: '14px' }}>🏷️</span> <strong>3D Sphere</strong> (Names Alone)
                </button>
                <button
                  type="button"
                  className={`ak-toolbox-btn ${currentViewMode === 'classic-grid' ? 'active' : ''}`}
                  style={{ justifyContent: 'flex-start', width: '100%', padding: '9px 12px', fontSize: '12px' }}
                  onClick={() => updateSetting('viewMode', 'classic-grid')}
                >
                  <span style={{ fontSize: '14px' }}>📋</span> <strong>Normal Listing</strong> (Categories)
                </button>
              </div>
            </div>

            {isSphereView && (
              <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Sphere Speed</span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{settings.speedMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={settings.speedMultiplier}
                  onChange={(e) => updateSetting('speedMultiplier', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '10px', cursor: 'pointer' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Auto-Rotation</span>
                  <button
                    type="button"
                    className={`ak-toolbox-btn ${settings.autoSpin ? 'active' : ''}`}
                    style={{ padding: '3px 12px', fontSize: '11px' }}
                    onClick={() => updateSetting('autoSpin', !settings.autoSpin)}
                  >
                    {settings.autoSpin ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}

            {/* Canvas OS Desktop Link visibility toggle */}
            {/* <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Interactive Canvas OS</div>
                  <div style={{ fontSize: '11px', opacity: 0.65 }}>Show links to the retro desktop canvas</div>
                </div>
                <button
                  type="button"
                  className={`ak-toolbox-btn ${settings.showCanvasLink ? 'active' : ''}`}
                  style={{ padding: '3px 12px', fontSize: '11px' }}
                  onClick={() => updateSetting('showCanvasLink', !settings.showCanvasLink)}
                >
                  {settings.showCanvasLink ? 'VISIBLE' : 'HIDDEN'}
                </button>
              </div>
            </div> */}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                type="button"
                className="ak-toolbox-btn active"
                style={{ padding: '4px 14px', fontSize: '12px' }}
                onClick={() => setShowSettingsModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
