import React from 'react';
import htmlImg from '../../assets/html.png';
import cssImg from '../../assets/css.png';
import bootstrapImg from '../../assets/bootstrap.png';
import javascriptImg from '../../assets/javascript.png';
import reactImg from '../../assets/react.png';
import githubImg from '../../assets/github.png';
import jqueryImg from '../../assets/jquery.png';
import sqlImg from '../../assets/sql.png';
import djangoImg from '../../assets/django.png';
import pythonImg from '../../assets/python.png';
import netlifyImg from '../../assets/netlify.png';
import postmanImg from '../../assets/postman.png';
import figmaImg from '../../assets/figma.png';
import { TechIcon } from '../VasanthPage/TechIcons';
import { Code2 } from 'lucide-react';

export const SKILL_ASSET_IMAGES = {
  html: htmlImg,
  html5: htmlImg,
  css: cssImg,
  css3: cssImg,
  bootstrap: bootstrapImg,
  javascript: javascriptImg,
  js: javascriptImg,
  react: reactImg,
  reactjs: reactImg,
  github: githubImg,
  jquery: jqueryImg,
  sql: sqlImg,
  mysql: sqlImg,
  django: djangoImg,
  python: pythonImg,
  netlify: netlifyImg,
  postman: postmanImg,
  figma: figmaImg,
};

export const BUILT_IN_ICON_KEYS = [
  { key: 'html', label: 'HTML5 (PNG)' },
  { key: 'css', label: 'CSS3 (PNG)' },
  { key: 'bootstrap', label: 'Bootstrap (PNG)' },
  { key: 'javascript', label: 'JavaScript (PNG)' },
  { key: 'react', label: 'React (PNG)' },
  { key: 'python', label: 'Python (PNG)' },
  { key: 'django', label: 'Django (PNG)' },
  { key: 'sql', label: 'MySQL / SQL (PNG)' },
  { key: 'github', label: 'GitHub (PNG)' },
  { key: 'jquery', label: 'jQuery (PNG)' },
  { key: 'postman', label: 'Postman (PNG)' },
  { key: 'netlify', label: 'Netlify (PNG)' },
  { key: 'figma', label: 'Figma (PNG)' },
  { key: 'typescript', label: 'TypeScript (SVG)' },
  { key: 'nextjs', label: 'Next.js (SVG)' },
  { key: 'nodejs', label: 'Node.js (SVG)' },
  { key: 'fastapi', label: 'FastAPI (SVG)' },
  { key: 'express', label: 'Express.js (SVG)' },
  { key: 'postgresql', label: 'PostgreSQL (SVG)' },
  { key: 'redis', label: 'Redis (SVG)' },
  { key: 'docker', label: 'Docker (SVG)' },
  { key: 'aws', label: 'AWS (SVG)' },
  { key: 'git', label: 'Git (SVG)' },
  { key: 'dynamodb', label: 'DynamoDB (SVG)' },
  { key: 'prisma', label: 'Prisma (SVG)' },
  { key: 's3', label: 'AWS S3 (SVG)' },
  { key: 'jest', label: 'Jest (SVG)' },
  { key: 'vitest', label: 'Vitest (SVG)' }
];

const TECH_ICON_KEYS = new Set([
  'python', 'py', 'typescript', 'ts', 'javascript', 'js', 'react', 'reactjs',
  'nextjs', 'next', 'next.js', 'nodejs', 'node', 'node.js', 'express', 'expressjs', 'express.js',
  'fastapi', 'postgresql', 'postgres', 'mysql', 'sql', 'redis', 'dynamodb',
  'prisma', 'aws', 'docker', 'git', 'github', 's3', 'jest', 'vitest',
  'html', 'html5', 'css', 'css3', 'bootstrap', 'jquery', 'django',
  'netlify', 'postman', 'figma', 'tailwind', 'tailwindcss', 'redux', 'vite',
  'linux', 'mongodb', 'graphql', 'pytorch', 'tensorflow'
]);

/**
 * Universally renders any skill icon: PNG asset, SVG brand icon, custom URL, or fallback.
 */
export function SkillIcon({ icon, imageUrl, size = 32, alt = 'Skill Icon', style = {} }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className="sphere-tag-icon-img"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          display: 'inline-block',
          imageRendering: '-webkit-optimize-contrast',
          backfaceVisibility: 'hidden',
          ...style
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  const normalizedKey = (icon || '').toLowerCase().trim();

  // 1. Prioritize resolution-independent vector SVGs first for crystal-clear sharpness
  if (TECH_ICON_KEYS.has(normalizedKey)) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, ...style }}>
        <TechIcon name={normalizedKey} size={size} />
      </span>
    );
  }

  // 2. Fallback to local PNG asset if no dedicated vector SVG is available
  if (SKILL_ASSET_IMAGES[normalizedKey]) {
    return (
      <img
        src={SKILL_ASSET_IMAGES[normalizedKey]}
        alt={alt}
        className="sphere-tag-icon-img"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          display: 'inline-block',
          imageRendering: '-webkit-optimize-contrast',
          backfaceVisibility: 'hidden',
          ...style
        }}
      />
    );
  }

  // 3. Clean Code Fallback
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, color: '#fabd2f', ...style }}>
      <Code2 size={Math.round(size * 0.8)} />
    </span>
  );
}
