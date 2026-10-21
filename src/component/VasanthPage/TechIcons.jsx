import React from 'react';
import {
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiDjango,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiDocker,
  SiGit,
  SiGithub,
  SiPostman,
  SiNetlify,
  SiBootstrap,
  SiJquery,
  SiFigma,
  SiPython,
  SiTailwindcss,
  SiRedux,
  SiPrisma,
  SiVite,
  SiJest,
  SiLinux,
  SiMongodb,
  SiGraphql,
  SiPytorch,
  SiTensorflow
} from 'react-icons/si';
import { FaAws, FaCss3Alt, FaDatabase } from 'react-icons/fa';

/**
 * 100% Official, authentic brand vector icons from Simple Icons & FontAwesome.
 * Zero approximations, zero fake text badges, full resolution-independent sharpness.
 */
export function TechIcon({ name, size = 20, color, style = {} }) {
  const key = (name || '').toLowerCase().trim();
  const iconProps = {
    size,
    style: {
      display: 'block',
      flexShrink: 0,
      shapeRendering: 'geometricPrecision',
      textRendering: 'geometricPrecision',
      ...style
    }
  };

  switch (key) {
    case 'html':
    case 'html5':
      return <SiHtml5 {...iconProps} color={color || '#E34F26'} title="HTML5" />;

    case 'css':
    case 'css3':
      return <FaCss3Alt {...iconProps} color={color || '#1572B6'} title="CSS3" />;

    case 'javascript':
    case 'js':
      return <SiJavascript {...iconProps} color={color || '#F7DF1E'} title="JavaScript" />;

    case 'typescript':
    case 'ts':
      return <SiTypescript {...iconProps} color={color || '#3178C6'} title="TypeScript" />;

    case 'react':
    case 'reactjs':
      return <SiReact {...iconProps} color={color || '#61DAFB'} title="React" />;

    case 'nextjs':
    case 'next':
    case 'next.js':
      return <SiNextdotjs {...iconProps} color={color || 'currentColor'} title="Next.js" />;

    case 'nodejs':
    case 'node':
    case 'node.js':
      return <SiNodedotjs {...iconProps} color={color || '#339933'} title="Node.js" />;

    case 'django':
      return <SiDjango {...iconProps} color={color || '#092E20'} title="Django" />;

    case 'fastapi':
      return <SiFastapi {...iconProps} color={color || '#009688'} title="FastAPI" />;

    case 'express':
    case 'expressjs':
    case 'express.js':
      return <SiExpress {...iconProps} color={color || 'currentColor'} title="Express.js" />;

    case 'postgresql':
    case 'postgres':
      return <SiPostgresql {...iconProps} color={color || '#4169E1'} title="PostgreSQL" />;

    case 'mysql':
    case 'sql':
      return <SiMysql {...iconProps} color={color || '#4479A1'} title="MySQL" />;

    case 'redis':
      return <SiRedis {...iconProps} color={color || '#DC382D'} title="Redis" />;

    case 'docker':
      return <SiDocker {...iconProps} color={color || '#2496ED'} title="Docker" />;

    case 'aws':
      return <FaAws {...iconProps} color={color || '#FF9900'} title="AWS" />;

    case 'git':
      return <SiGit {...iconProps} color={color || '#F05032'} title="Git" />;

    case 'github':
      return <SiGithub {...iconProps} color={color || 'currentColor'} title="GitHub" />;

    case 'postman':
      return <SiPostman {...iconProps} color={color || '#FF6C37'} title="Postman" />;

    case 'netlify':
      return <SiNetlify {...iconProps} color={color || '#00C7B7'} title="Netlify" />;

    case 'bootstrap':
      return <SiBootstrap {...iconProps} color={color || '#7952B3'} title="Bootstrap" />;

    case 'jquery':
      return <SiJquery {...iconProps} color={color || '#0769AD'} title="jQuery" />;

    case 'figma':
      return <SiFigma {...iconProps} color={color || '#F24E1E'} title="Figma" />;

    case 'python':
    case 'py':
      return <SiPython {...iconProps} color={color || '#3776AB'} title="Python" />;

    case 'tailwind':
    case 'tailwindcss':
      return <SiTailwindcss {...iconProps} color={color || '#06B6D4'} title="Tailwind CSS" />;

    case 'redux':
      return <SiRedux {...iconProps} color={color || '#764ABC'} title="Redux" />;

    case 'prisma':
      return <SiPrisma {...iconProps} color={color || 'currentColor'} title="Prisma" />;

    case 'vite':
      return <SiVite {...iconProps} color={color || '#646CFF'} title="Vite" />;

    case 'jest':
      return <SiJest {...iconProps} color={color || '#C21325'} title="Jest" />;

    case 'linux':
      return <SiLinux {...iconProps} color={color || '#FCC624'} title="Linux" />;

    case 'mongodb':
    case 'mongo':
      return <SiMongodb {...iconProps} color={color || '#47A248'} title="MongoDB" />;

    case 'graphql':
      return <SiGraphql {...iconProps} color={color || '#E10098'} title="GraphQL" />;

    case 'pytorch':
      return <SiPytorch {...iconProps} color={color || '#EE4C2C'} title="PyTorch" />;

    case 'tensorflow':
      return <SiTensorflow {...iconProps} color={color || '#FF6F00'} title="TensorFlow" />;

    case 's3':
    case 'dynamodb':
    case 'database':
      return <FaDatabase {...iconProps} color={color || '#336791'} title="Database" />;

    default:
      return null;
  }
}
