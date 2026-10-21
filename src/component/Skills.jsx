import React, { useMemo } from 'react';
import '../Styles/Skills.css';
import { useInView } from 'react-intersection-observer';
import SkillsSphere from './SkillsSphere/SkillsSphere';
import {
  PORTFOLIO_SKILLS,
  HIGH_DENSITY_SKILLS,
} from './SkillsSphere/skillsData';
import { SkillIcon } from './SkillsSphere/skillAssetIcons.jsx';
import { DEFAULT_SETTINGS } from './Navbar';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Skills({ settings = DEFAULT_SETTINGS, onSettingsChange }) {
  const { skills } = usePortfolioData();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const dynamicSphereSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    return skills.map((s) => ({
      name: s.name,
      category: (s.category || 'general').toLowerCase().replace(/[^a-z0-9]/g, '_'),
      weight: s.weight || (s.level === 'Expert' ? 3 : s.level === 'Familiar' ? 1 : 2),
      iconKey: s.icon ? s.icon.toLowerCase() : null,
      imageUrl: s.imageUrl || null,
      brandColor: s.color || '#38bdf8'
    }));
  }, [skills]);

  const activeSkills = useMemo(() => {
    switch (settings.dataset) {
      case 'portfolio':
        return PORTFOLIO_SKILLS;
      case 'dense':
        return HIGH_DENSITY_SKILLS;
      case 'standard':
      default:
        return dynamicSphereSkills;
    }
  }, [settings.dataset, dynamicSphereSkills]);

  const isClassicGrid = settings.viewMode === 'classic-grid';

  return (
    <section id="skills" className="d-flex flex-column justify-content-center py-5">
      <p
        className={`${
          inView ? 'show' : ''
        } fade-in-up Skills d-flex align-items-center justify-content-center fw-bold mb-4 text-light bg-clip-text`}
      >
        Skills
      </p>

      {isClassicGrid ? (
        /* Classic Dynamic Grid matching the Original Portfolio aesthetic */
        <div className="imagediv gap-5 justify-content-center py-4 flex-wrap">
          {skills.map((skill, idx) => (
            <div key={skill.id || idx} ref={idx === 0 ? ref : null} className="imgpost">
              <SkillIcon
                icon={skill.icon}
                imageUrl={skill.imageUrl}
                size={54}
                alt={skill.name}
              />
              <p>{skill.name}</p>
            </div>
          ))}
        </div>
      ) : (
        /* Interactive 3D Skills Sphere (Controlled dynamically via Navbar Settings) */
        <div className="container" style={{ maxWidth: '960px' }}>
          <SkillsSphere
            skills={activeSkills}
            displayMode={settings.viewMode === 'sphere-icons' ? 'icons' : 'names'}
            idleSpeedY={settings.autoSpin ? 0.0022 * settings.speedMultiplier : 0}
            idleSpeedX={settings.autoSpin ? 0.0008 * settings.speedMultiplier : 0}
            radiusScale={settings.radiusScale}
            reducedMotionOverride={!settings.autoSpin ? true : null}
            showModeSwitcher={false}
            showFilters={true}
            showHint={true}
          />
        </div>
      )}
    </section>
  );
}
