/**
 * Skill categories, icon mappings, and test datasets for the 3D Spherical Skills Visualization.
 */
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaFigma,
  FaAws,
  FaDocker,
  FaDatabase,
  FaBrain,
  FaCloud,
  FaCode,
  FaPython,
  FaJava,
  FaRust,
} from 'react-icons/fa';
import {
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiDjango,
  SiMysql,
  SiPostgresql,
  SiTailwindcss,
  SiBootstrap,
  SiExpress,
  SiRedux,
  SiJquery,
  SiVite,
  SiNetlify,
  SiVercel,
  SiPostman,
  SiPytorch,
  SiScikitlearn,
  SiNumpy,
  SiPandas,
  SiLinux,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiNextdotjs,
  SiFastapi,
  SiKubernetes,
  SiNginx,
  SiGithubactions,
  SiTensorflow,
  SiOpencv,
} from 'react-icons/si';
import { TbBrandOpenai } from 'react-icons/tb';

export const CATEGORIES = [
  { id: 'all', label: 'All', color: '#ffffff' },
  { id: 'languages', label: 'Languages', color: '#38bdf8' },
  { id: 'frontend_backend', label: 'Frontend & Backend', color: '#22d3ee' },
  { id: 'ai_ml', label: 'AI & ML', color: '#c084fc' },
  { id: 'cloud_infra', label: 'Cloud & Infra', color: '#fb7185' },
  { id: 'databases_tools', label: 'Databases & Tools', color: '#fbbf24' },
];

/**
 * Standard comprehensive skills dataset tailored to the developer's full-stack profile.
 * Weights:
 * 3 = Core / Expert
 * 2 = Proficient
 * 1 = Familiar / Tooling
 */
export const STANDARD_SKILLS = [
  // Programming Languages
  { name: 'Python', category: 'languages', weight: 3, iconKey: 'python', iconComponent: FaPython, brandColor: '#3776AB' },
  { name: 'JavaScript', category: 'languages', weight: 3, iconKey: 'javascript', iconComponent: SiJavascript, brandColor: '#F7DF1E' },
  { name: 'TypeScript', category: 'languages', weight: 2, iconComponent: SiTypescript, brandColor: '#3178C6' },
  { name: 'HTML5', category: 'languages', weight: 3, iconKey: 'html', iconComponent: FaHtml5, brandColor: '#E34F26' },
  { name: 'CSS3', category: 'languages', weight: 3, iconKey: 'css', iconComponent: FaCss3Alt, brandColor: '#1572B6' },
  { name: 'SQL', category: 'languages', weight: 2, iconKey: 'sql', iconComponent: FaDatabase, brandColor: '#00758F' },
  { name: 'C++', category: 'languages', weight: 1, iconComponent: SiCplusplus, brandColor: '#00599C' },

  // Frontend & Backend
  { name: 'React', category: 'frontend_backend', weight: 3, iconKey: 'react', iconComponent: FaReact, brandColor: '#61DAFB' },
  { name: 'Django', category: 'frontend_backend', weight: 3, iconKey: 'django', iconComponent: SiDjango, brandColor: '#2ba977' },
  { name: 'Django REST', category: 'frontend_backend', weight: 3, iconKey: 'django', iconComponent: SiDjango, brandColor: '#a30000' },
  { name: 'Node.js', category: 'frontend_backend', weight: 2, iconComponent: FaNodeJs, brandColor: '#339933' },
  { name: 'Express', category: 'frontend_backend', weight: 2, iconComponent: SiExpress, brandColor: '#ffffff' },
  { name: 'Bootstrap', category: 'frontend_backend', weight: 2, iconKey: 'bootstrap', iconComponent: SiBootstrap, brandColor: '#7952B3' },
  { name: 'Tailwind CSS', category: 'frontend_backend', weight: 2, iconComponent: SiTailwindcss, brandColor: '#06B6D4' },
  { name: 'Redux Toolkit', category: 'frontend_backend', weight: 2, iconComponent: SiRedux, brandColor: '#764ABC' },
  { name: 'jQuery', category: 'frontend_backend', weight: 1, iconKey: 'jquery', iconComponent: SiJquery, brandColor: '#0769AD' },
  { name: 'REST APIs', category: 'frontend_backend', weight: 3, iconComponent: FaCode, brandColor: '#6ee7d5' },

  // AI & Machine Learning
  { name: 'OpenAI API', category: 'ai_ml', weight: 3, iconComponent: TbBrandOpenai, brandColor: '#10A37F' },
  { name: 'Prompt Engineering', category: 'ai_ml', weight: 3, iconComponent: FaBrain, brandColor: '#c084fc' },
  { name: 'PyTorch', category: 'ai_ml', weight: 2, iconComponent: SiPytorch, brandColor: '#EE4C2C' },
  { name: 'scikit-learn', category: 'ai_ml', weight: 2, iconComponent: SiScikitlearn, brandColor: '#F7931E' },
  { name: 'LangChain', category: 'ai_ml', weight: 2, iconComponent: FaBrain, brandColor: '#2ba977' },
  { name: 'NumPy', category: 'ai_ml', weight: 2, iconComponent: SiNumpy, brandColor: '#013243' },
  { name: 'Pandas', category: 'ai_ml', weight: 2, iconComponent: SiPandas, brandColor: '#150458' },
  { name: 'Computer Vision', category: 'ai_ml', weight: 1, iconComponent: FaBrain, brandColor: '#6ee7d5' },

  // Cloud & Infrastructure
  { name: 'AWS (EC2, S3)', category: 'cloud_infra', weight: 2, iconComponent: FaAws, brandColor: '#FF9900' },
  { name: 'Docker', category: 'cloud_infra', weight: 2, iconComponent: FaDocker, brandColor: '#2496ED' },
  { name: 'Netlify', category: 'cloud_infra', weight: 2, iconKey: 'netlify', iconComponent: SiNetlify, brandColor: '#00C7B7' },
  { name: 'Vercel', category: 'cloud_infra', weight: 2, iconComponent: SiVercel, brandColor: '#ffffff' },
  { name: 'CI/CD Pipelines', category: 'cloud_infra', weight: 2, iconComponent: FaCloud, brandColor: '#fdba74' },
  { name: 'Linux / Bash', category: 'cloud_infra', weight: 2, iconComponent: SiLinux, brandColor: '#FCC624' },

  // Databases & Tools
  { name: 'MySQL', category: 'databases_tools', weight: 3, iconKey: 'sql', iconComponent: SiMysql, brandColor: '#4479A1' },
  { name: 'PostgreSQL', category: 'databases_tools', weight: 2, iconComponent: SiPostgresql, brandColor: '#4169E1' },
  { name: 'Git & GitHub', category: 'databases_tools', weight: 3, iconKey: 'github', iconComponent: FaGithub, brandColor: '#ffffff' },
  { name: 'Postman', category: 'databases_tools', weight: 2, iconKey: 'postman', iconComponent: SiPostman, brandColor: '#FF6C37' },
  { name: 'Vite', category: 'databases_tools', weight: 2, iconComponent: SiVite, brandColor: '#646CFF' },
  { name: 'Figma', category: 'databases_tools', weight: 1, iconKey: 'figma', iconComponent: FaFigma, brandColor: '#F24E1E' },
];

/**
 * Dataset reflecting strictly the original 12 skills currently showcased in the portfolio,
 * mapped to their authentic PNG assets and React Icon components.
 */
export const PORTFOLIO_SKILLS = [
  { name: 'HTML', category: 'languages', weight: 3, iconKey: 'html', iconComponent: FaHtml5, brandColor: '#E34F26' },
  { name: 'CSS', category: 'languages', weight: 3, iconKey: 'css', iconComponent: FaCss3Alt, brandColor: '#1572B6' },
  { name: 'Bootstrap', category: 'frontend_backend', weight: 2, iconKey: 'bootstrap', iconComponent: SiBootstrap, brandColor: '#7952B3' },
  { name: 'JavaScript', category: 'languages', weight: 3, iconKey: 'javascript', iconComponent: SiJavascript, brandColor: '#F7DF1E' },
  { name: 'React', category: 'frontend_backend', weight: 3, iconKey: 'react', iconComponent: FaReact, brandColor: '#61DAFB' },
  { name: 'GitHub', category: 'databases_tools', weight: 3, iconKey: 'github', iconComponent: FaGithub, brandColor: '#ffffff' },
  { name: 'jQuery', category: 'frontend_backend', weight: 1, iconKey: 'jquery', iconComponent: SiJquery, brandColor: '#0769AD' },
  { name: 'MySQL', category: 'databases_tools', weight: 3, iconKey: 'sql', iconComponent: SiMysql, brandColor: '#4479A1' },
  { name: 'Django', category: 'frontend_backend', weight: 3, iconKey: 'django', iconComponent: SiDjango, brandColor: '#2ba977' },
  { name: 'Python', category: 'languages', weight: 3, iconKey: 'python', iconComponent: FaPython, brandColor: '#3776AB' },
  { name: 'Netlify', category: 'cloud_infra', weight: 2, iconKey: 'netlify', iconComponent: SiNetlify, brandColor: '#00C7B7' },
  { name: 'Postman', category: 'databases_tools', weight: 2, iconKey: 'postman', iconComponent: SiPostman, brandColor: '#FF6C37' },
];

/**
 * Stress test dataset with long names to verify non-clipping and boundary handling.
 */
export const LONG_LABELS_SKILLS = [
  { name: 'Natural Language Processing Pipelines', category: 'ai_ml', weight: 3, iconComponent: FaBrain, brandColor: '#c4b5fd' },
  { name: 'Continuous Integration & Continuous Deployment', category: 'cloud_infra', weight: 3, iconComponent: FaCloud, brandColor: '#fdba74' },
  { name: 'Object-Relational Mapping (Django ORM)', category: 'frontend_backend', weight: 2, iconKey: 'django', iconComponent: SiDjango, brandColor: '#2ba977' },
  { name: 'Microservices Architecture & Orchestration', category: 'cloud_infra', weight: 3, iconComponent: FaDocker, brandColor: '#2496ED' },
  { name: 'Asynchronous JavaScript & Event Loops', category: 'languages', weight: 2, iconKey: 'javascript', iconComponent: SiJavascript, brandColor: '#F7DF1E' },
  { name: 'Relational Database Schema Normalization', category: 'databases_tools', weight: 2, iconKey: 'sql', iconComponent: SiMysql, brandColor: '#4479A1' },
  { name: 'Cross-Origin Resource Sharing (CORS) Security', category: 'frontend_backend', weight: 1, iconComponent: FaCode, brandColor: '#6ee7d5' },
  { name: 'Convolutional Neural Network Implementations', category: 'ai_ml', weight: 2, iconComponent: SiPytorch, brandColor: '#EE4C2C' },
  { name: 'Scalable Cloud Containerization with Docker', category: 'cloud_infra', weight: 2, iconComponent: FaDocker, brandColor: '#2496ED' },
  { name: 'End-to-End Automated Testing Protocols', category: 'databases_tools', weight: 1, iconComponent: FaCode, brandColor: '#fde047' },
];

/**
 * High density dataset (54 skills) to verify performance and spacing on crowded spheres.
 */
export const HIGH_DENSITY_SKILLS = [
  ...STANDARD_SKILLS,
  { name: 'GraphQL', category: 'frontend_backend', weight: 2, iconComponent: SiGraphql, brandColor: '#E10098' },
  { name: 'MongoDB', category: 'databases_tools', weight: 2, iconComponent: SiMongodb, brandColor: '#47A248' },
  { name: 'FastAPI', category: 'frontend_backend', weight: 2, iconComponent: SiFastapi, brandColor: '#009688' },
  { name: 'Java', category: 'languages', weight: 2, iconComponent: FaJava, brandColor: '#ED8B00' },
  { name: 'Rust', category: 'languages', weight: 1, iconComponent: FaRust, brandColor: '#DEA584' },
  { name: 'Kubernetes', category: 'cloud_infra', weight: 2, iconComponent: SiKubernetes, brandColor: '#326CE5' },
  { name: 'Nginx', category: 'cloud_infra', weight: 2, iconComponent: SiNginx, brandColor: '#009639' },
  { name: 'GitHub Actions', category: 'cloud_infra', weight: 2, iconComponent: SiGithubactions, brandColor: '#2088FF' },
  { name: 'TensorFlow', category: 'ai_ml', weight: 1, iconComponent: SiTensorflow, brandColor: '#FF6F00' },
  { name: 'OpenCV', category: 'ai_ml', weight: 1, iconComponent: SiOpencv, brandColor: '#5C3EE8' },
  { name: 'WebSockets', category: 'frontend_backend', weight: 2, iconComponent: FaCode, brandColor: '#6ee7d5' },
  { name: 'PostgreSQL ORM', category: 'databases_tools', weight: 2, iconComponent: SiPostgresql, brandColor: '#4169E1' },
];

/**
 * Empty dataset to verify empty-state handling.
 */
export const EMPTY_SKILLS = [];

export const DATASET_OPTIONS = [
  { id: 'standard', label: 'Standard Full Stack (36 skills)', data: STANDARD_SKILLS },
  { id: 'portfolio', label: 'Original Portfolio (12 skills)', data: PORTFOLIO_SKILLS },
  { id: 'dense', label: 'High Density (51 skills)', data: HIGH_DENSITY_SKILLS },
  { id: 'long', label: 'Long Labels Stress Test (10 skills)', data: LONG_LABELS_SKILLS },
  { id: 'empty', label: 'Empty State (0 skills)', data: EMPTY_SKILLS },
];
