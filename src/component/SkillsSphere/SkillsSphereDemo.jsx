import React, { useState, useMemo } from 'react';
import './SkillsSphereDemo.css';
import SkillsSphere from './SkillsSphere';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import {
  CATEGORIES,
  DATASET_OPTIONS,
  STANDARD_SKILLS,
  PORTFOLIO_SKILLS,
  HIGH_DENSITY_SKILLS,
  LONG_LABELS_SKILLS,
  EMPTY_SKILLS,
} from './skillsData';

/**
 * Dedicated Interactive Demo Playground for 3D Spherical Skills Visualization.
 */
export default function SkillsSphereDemo({ onReturnToPortfolio }) {
  const { skills: liveSkills } = usePortfolioData();
  const [datasetId, setDatasetId] = useState('standard');
  const [presentationMode, setPresentationMode] = useState('auto'); // 'auto', 'sphere', 'flat'
  const [styleMode, setStyleMode] = useState('icons'); // 'icons' or 'names'
  const [reducedMotionSetting, setReducedMotionSetting] = useState('system'); // 'system', 'on', 'off'
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [radiusScale, setRadiusScale] = useState(1.0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showA11yInspector, setShowA11yInspector] = useState(false);

  const dynamicSphereSkills = useMemo(() => {
    if (!liveSkills || liveSkills.length === 0) return STANDARD_SKILLS;
    return liveSkills.map((s) => ({
      name: s.name,
      category: (s.category || 'general').toLowerCase().replace(/[^a-z0-9]/g, '_'),
      weight: s.weight || (s.level === 'Expert' ? 3 : s.level === 'Familiar' ? 1 : 2),
      iconKey: s.icon ? s.icon.toLowerCase() : null,
      imageUrl: s.imageUrl || null,
      brandColor: s.color || '#38bdf8'
    }));
  }, [liveSkills]);

  // Active dataset calculation
  const currentSkills = useMemo(() => {
    switch (datasetId) {
      case 'portfolio':
        return PORTFOLIO_SKILLS;
      case 'dense':
        return HIGH_DENSITY_SKILLS;
      case 'long':
        return LONG_LABELS_SKILLS;
      case 'empty':
        return EMPTY_SKILLS;
      case 'standard':
      default:
        return dynamicSphereSkills;
    }
  }, [datasetId, dynamicSphereSkills]);

  // Reduced motion override
  const reducedMotionOverride = useMemo(() => {
    if (reducedMotionSetting === 'on') return true;
    if (reducedMotionSetting === 'off') return false;
    return null; // System default
  }, [reducedMotionSetting]);

  // Force flat override
  const forceFlat =
    presentationMode === 'flat' ? true : presentationMode === 'sphere' ? false : false;

  // Matching count
  const matchingSkills = useMemo(() => {
    if (activeCategory === 'all') return currentSkills;
    return currentSkills.filter((s) => s.category === activeCategory);
  }, [currentSkills, activeCategory]);

  const handleReset = () => {
    setDatasetId('standard');
    setPresentationMode('auto');
    setStyleMode('icons');
    setReducedMotionSetting('system');
    setSpeedMultiplier(1.0);
    setRadiusScale(1.0);
    setActiveCategory('all');
    setShowA11yInspector(false);
  };

  return (
    <div className="skills-demo-page">
      <div className="skills-demo-container">
        {/* Navigation & Header */}
        <header className="skills-demo-header">
          <div className="skills-demo-title">
            <h1>3D Spherical Skills Visualization</h1>
            <p>
              Interactive Globe Projection &bull; Icons Alone or Names Alone &bull; Fibonacci Distribution
            </p>
          </div>
          <div className="skills-demo-nav-actions">
            <button
              type="button"
              className="demo-btn-secondary"
              onClick={handleReset}
              title="Reset test settings to default"
            >
              Reset Settings
            </button>
            <button
              type="button"
              className="demo-btn-primary"
              onClick={onReturnToPortfolio}
            >
              &larr; Return to Portfolio
            </button>
          </div>
        </header>

        {/* Interactive Testing & Configuration Panel */}
        <section className="skills-demo-controls-card" aria-label="Demo Testing Controls">
          <div className="demo-controls-grid">
            {/* Dataset Selector */}
            <div className="demo-control-group">
              <label htmlFor="dataset-select">Test Dataset</label>
              <select
                id="dataset-select"
                className="demo-select"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
              >
                {DATASET_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Icon Alone vs Names Alone Style Selector */}
            <div className="demo-control-group">
              <label htmlFor="style-mode-select">Display Style</label>
              <select
                id="style-mode-select"
                className="demo-select"
                value={styleMode}
                onChange={(e) => setStyleMode(e.target.value)}
              >
                <option value="icons">🎯 Icons Alone (Clean Floating Badges)</option>
                <option value="names">🏷️ Names Alone (Text Projection)</option>
              </select>
            </div>

            {/* Presentation Mode */}
            <div className="demo-control-group">
              <label htmlFor="mode-select">Presentation Mode</label>
              <select
                id="mode-select"
                className="demo-select"
                value={presentationMode}
                onChange={(e) => setPresentationMode(e.target.value)}
              >
                <option value="auto">Auto (3D with Flat Responsive Fallback)</option>
                <option value="sphere">Force 3D Sphere</option>
                <option value="flat">Force Flat Fallback (Accessible Grid)</option>
              </select>
            </div>

            {/* Motion Preference */}
            <div className="demo-control-group">
              <label htmlFor="motion-select">Motion &amp; Accessibility</label>
              <select
                id="motion-select"
                className="demo-select"
                value={reducedMotionSetting}
                onChange={(e) => setReducedMotionSetting(e.target.value)}
              >
                <option value="system">System Preference (Auto)</option>
                <option value="on">Emulate Reduced Motion (Static/Paused)</option>
                <option value="off">Force Motion Active</option>
              </select>
            </div>

            {/* Rotation Speed Multiplier */}
            <div className="demo-control-group">
              <label htmlFor="speed-range">
                Rotation Speed ({speedMultiplier.toFixed(1)}x)
              </label>
              <input
                id="speed-range"
                type="range"
                className="demo-range"
                min="0"
                max="3"
                step="0.2"
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
              />
            </div>

            {/* Sphere Radius Scale */}
            <div className="demo-control-group">
              <label htmlFor="radius-range">
                Sphere Radius Scale ({radiusScale.toFixed(2)}x)
              </label>
              <input
                id="radius-range"
                type="range"
                className="demo-range"
                min="0.75"
                max="1.35"
                step="0.05"
                value={radiusScale}
                onChange={(e) => setRadiusScale(parseFloat(e.target.value))}
              />
            </div>

            {/* Toggle Semantic Tree */}
            <div className="demo-control-group" style={{ justifyContent: 'flex-end' }}>
              <label className="demo-toggle-row">
                <input
                  type="checkbox"
                  checked={showA11yInspector}
                  onChange={(e) => setShowA11yInspector(e.target.checked)}
                />
                Inspect Accessible Tree
              </label>
            </div>
          </div>
        </section>

        {/* Live Diagnostics & Status Bar */}
        <div className="demo-status-bar" role="status">
          <div className="demo-status-pill">
            <span>Dataset:</span>
            <strong>{DATASET_OPTIONS.find((d) => d.id === datasetId)?.label}</strong>
          </div>
          <div className="demo-status-pill">
            <span>Style:</span>
            <strong>{styleMode === 'icons' ? '🎯 Icons Alone' : '🏷️ Names Alone'}</strong>
          </div>
          <div className="demo-status-pill">
            <span>Total Skills:</span>
            <strong>{currentSkills.length}</strong>
          </div>
          <div className="demo-status-pill">
            <span>Filtered Matching:</span>
            <strong>{matchingSkills.length}</strong>
          </div>
          <div className="demo-status-pill">
            <span>Active Filter:</span>
            <strong>
              {CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory}
            </strong>
          </div>
          <div className="demo-status-pill">
            <span>Reduced Motion:</span>
            <strong>
              {reducedMotionSetting === 'system'
                ? 'System Default'
                : reducedMotionSetting === 'on'
                ? 'Active (Paused)'
                : 'Disabled'}
            </strong>
          </div>
        </div>

        {/* Main 3D Sphere Interactive Stage */}
        <main className="demo-visualization-stage">
          <SkillsSphere
            skills={currentSkills}
            categories={CATEGORIES}
            selectedCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            displayMode={styleMode}
            onDisplayModeChange={setStyleMode}
            showModeSwitcher={true}
            forceFlat={forceFlat}
            reducedMotionOverride={reducedMotionOverride}
            idleSpeedY={0.0022 * speedMultiplier}
            idleSpeedX={0.0008 * speedMultiplier}
            radiusScale={radiusScale}
            showFilters={true}
            showHint={true}
          />
        </main>

        {/* Screen Reader Semantic Hierarchy Inspector (When toggled) */}
        {showA11yInspector && (
          <aside className="demo-a11y-inspector" aria-label="Accessible Semantic Inspector">
            <h3>Accessible Hierarchy (Screen Reader Equivalent)</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
              This semantic tree is embedded in the component for assistive technologies, ensuring
              full WCAG 2.1 compliance regardless of visual 3D animation.
            </p>
            <ul className="demo-a11y-list">
              {matchingSkills.map((s, idx) => (
                <li key={idx} className="demo-a11y-item">
                  <strong>{s.name}</strong> &mdash;{' '}
                  <span style={{ color: '#94a3b8' }}>
                    {CATEGORIES.find((c) => c.id === s.category)?.label}
                  </span>{' '}
                  (Weight {s.weight}/3)
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Technical Architecture Summary */}
        <section className="demo-info-card">
          <h2>Architecture &amp; Algorithm Highlights</h2>
          <div className="demo-features-grid">
            <div className="demo-feature-item">
              <h3>Icons Alone vs. Names Alone</h3>
              <p>
                Switch between clean floating circular icon badges (with hover tooltips) and clean
                typography text projection. This eliminates overlapping rectangular cards and keeps the sphere
                open, airy, and balanced.
              </p>
            </div>
            <div className="demo-feature-item">
              <h3>Fibonacci Sphere Distribution</h3>
              <p>
                Calculates uniform deterministic spherical coordinates using golden ratio intervals
                (&phi; and &theta;) to avoid clustering at the poles.
              </p>
            </div>
            <div className="demo-feature-item">
              <h3>Drag Physics with Momentum Decay</h3>
              <p>
                Smooth pointer drag with pointer capture and natural fling momentum. Releases decay
                gradually back to continuous idle rotation using linear interpolation.
              </p>
            </div>
            <div className="demo-feature-item">
              <h3>Non-Blocking Category Filtering</h3>
              <p>
                Switching categories highlights matching tags with glowing text/border shadows and dims
                non-matching tags while the sphere continues spinning without disruption.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
