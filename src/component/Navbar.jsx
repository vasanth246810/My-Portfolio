import React, { useState } from 'react';
import '../Styles/Navbar.css';
import { Settings, X, Sparkles } from 'lucide-react';

export const DEFAULT_SETTINGS = {
  viewMode: 'sphere-names', // 'sphere-names' (default), 'sphere-icons', 'classic-grid'
  speedMultiplier: 1.0,     // 0.2 to 2.5
  radiusScale: 1.0,         // 0.8 to 1.3
  autoSpin: true,           // true / false
  dataset: 'standard',      // 'standard', 'portfolio', 'dense'
};

export function Navbar({
  onOpenDemo,
  onOpenVasanthPage,
  onOpenAdmin,
  settings = DEFAULT_SETTINGS,
  onSettingsChange
}) {
  const [showSettings, setShowSettings] = useState(false);

  const updateSetting = (key, value) => {
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        [key]: value,
      });
    }
  };

  const handleReset = () => {
    if (onSettingsChange) {
      onSettingsChange(DEFAULT_SETTINGS);
    }
  };

  const isSphereMode = settings.viewMode !== 'classic-grid';

  return (
    <div style={{ paddingTop: '30px' }}>
      <nav className="navbar d-flex justify-content-between align-items-center flex-column">
        <ul className="navlinks">
          <li>
            <a href="#home" style={{ textDecoration: 'none', color: 'inherit' }}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>
              About
            </a>
          </li>
          <li>
            <a href="#skills" style={{ textDecoration: 'none', color: 'inherit' }}>
              Skills
            </a>
          </li>
          <li>
            <a href="#projects" style={{ textDecoration: 'none', color: 'inherit' }}>
              Projects
            </a>
          </li>
          <li>
            <a href="#contact" style={{ textDecoration: 'none', color: 'inherit' }}>
              Contact
            </a>
          </li>
          <li style={{ position: 'relative' }}>
            <button
              type="button"
              className={`nav-settings-btn ${showSettings ? 'active' : ''}`}
              onClick={() => setShowSettings(!showSettings)}
              title="Customize display settings and 3D sphere options"
            >
              <Settings size={15} />
              <span>Settings</span>
            </button>
          </li>
          {onOpenVasanthPage && (
            <li>
              <button
                type="button"
                className="nav-page-btn"
                onClick={onOpenVasanthPage}
                title="Visit the interactive Neo-Brutalist Showcase page"
              >
                <Sparkles size={14} />
                <span>Vasanth's Showcase</span>
              </button>
            </li>
          )}
        </ul>
      </nav>


      {/* Floating Settings Popover */}
      {showSettings && (
        <>
          <div
            className="minimal-popover-dismiss"
            onClick={() => setShowSettings(false)}
          />
          <div className="minimal-settings-popover" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="minimal-settings-header">
              <h3 id="minimal-settings-title">
                <Settings size={17} color="#8fcaff" /> Display Preferences
              </h3>
              <button
                type="button"
                className="minimal-close-btn"
                onClick={() => setShowSettings(false)}
                aria-label="Close settings"
              >
                <X size={17} />
              </button>
            </div>

            {/* 1. View Mode Segmented Selector */}
            <div className="minimal-ctrl-row">
              <div className="minimal-ctrl-label-bar">
                <span>Skills View Mode</span>
              </div>
              <div className="minimal-segmented">
                <button
                  type="button"
                  className={`minimal-seg-btn ${
                    settings.viewMode === 'sphere-names' ? 'active' : ''
                  }`}
                  onClick={() => updateSetting('viewMode', 'sphere-names')}
                >
                  <span>🏷️</span> Names (Default)
                </button>
                <button
                  type="button"
                  className={`minimal-seg-btn ${
                    settings.viewMode === 'sphere-icons' ? 'active' : ''
                  }`}
                  onClick={() => updateSetting('viewMode', 'sphere-icons')}
                >
                  <span>🎯</span> Icons Alone
                </button>
                <button
                  type="button"
                  className={`minimal-seg-btn ${
                    settings.viewMode === 'classic-grid' ? 'active' : ''
                  }`}
                  onClick={() => updateSetting('viewMode', 'classic-grid')}
                >
                  <span>📋</span> Classic Grid
                </button>
              </div>
            </div>

            {/* 2. Sphere-Specific Controls (Speed, Size, Auto-Spin) */}
            {isSphereMode && (
              <>
                {/* Rotation Speed Slider */}
                <div className="minimal-ctrl-row">
                  <div className="minimal-ctrl-label-bar">
                    <span>Rotation Speed</span>
                    <span className="minimal-val-badge">
                      {settings.speedMultiplier.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    className="minimal-range-slider"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={settings.speedMultiplier}
                    onChange={(e) =>
                      updateSetting('speedMultiplier', parseFloat(e.target.value))
                    }
                  />
                </div>

                {/* Sphere Size / Radius Slider */}
                <div className="minimal-ctrl-row">
                  <div className="minimal-ctrl-label-bar">
                    <span>Sphere Size</span>
                    <span className="minimal-val-badge">
                      {settings.radiusScale.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    className="minimal-range-slider"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={settings.radiusScale}
                    onChange={(e) =>
                      updateSetting('radiusScale', parseFloat(e.target.value))
                    }
                  />
                </div>

                {/* Auto-Spin Motion Switch */}
                <label className="minimal-toggle-row">
                  <span className="minimal-toggle-label">Continuous Auto-Spin</span>
                  <div className="minimal-switch">
                    <input
                      type="checkbox"
                      checked={settings.autoSpin}
                      onChange={(e) => updateSetting('autoSpin', e.target.checked)}
                    />
                    <span className="minimal-slider-track" />
                  </div>
                </label>

                {/* Dataset Segmented Selector */}
                <div className="minimal-ctrl-row">
                  <div className="minimal-ctrl-label-bar">
                    <span>Skills Dataset</span>
                  </div>
                  <div className="minimal-segmented">
                    <button
                      type="button"
                      className={`minimal-seg-btn ${
                        settings.dataset === 'standard' ? 'active' : ''
                      }`}
                      onClick={() => updateSetting('dataset', 'standard')}
                    >
                      Full Stack (37)
                    </button>
                    <button
                      type="button"
                      className={`minimal-seg-btn ${
                        settings.dataset === 'portfolio' ? 'active' : ''
                      }`}
                      onClick={() => updateSetting('dataset', 'portfolio')}
                    >
                      Portfolio (12)
                    </button>
                    <button
                      type="button"
                      className={`minimal-seg-btn ${
                        settings.dataset === 'dense' ? 'active' : ''
                      }`}
                      onClick={() => updateSetting('dataset', 'dense')}
                    >
                      Dense (51)
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Footer Action Row */}
            <div className="minimal-settings-footer">
              <button
                type="button"
                className="minimal-reset-btn"
                onClick={handleReset}
                title="Reset all settings to default values"
              >
                Reset Defaults
              </button>

              <button
                type="button"
                className="minimal-demo-link"
                onClick={() => {
                  setShowSettings(false);
                  if (onOpenDemo) onOpenDemo();
                }}
              >
                <Sparkles size={13} /> Full Playground
              </button>

              {onOpenAdmin && (
                <button
                  type="button"
                  className="minimal-demo-link"
                  onClick={() => {
                    setShowSettings(false);
                    onOpenAdmin();
                  }}
                  title="Manage Projects & Content via Firebase"
                >
                  ⚙ CMS
                </button>
              )}

              <button
                type="button"
                className="minimal-done-btn"
                onClick={() => setShowSettings(false)}
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
