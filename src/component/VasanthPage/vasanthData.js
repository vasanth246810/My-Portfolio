/**
 * Structured dataset for Vasanth S showcase page.
 * Derived from the design system tokens and real portfolio specifications.
 */

export const THEMES = [
  { id: 'nord', name: 'Nord Dark' },
  { id: 'cream', name: 'Cream Light' },
  { id: 'tokyo-night', name: 'Tokyo Night' },
  { id: 'gruvbox-dark', name: 'Gruvbox' }
];

export const DEFAULT_SKILL_ITEMS = [
  // 12 Original Portfolio Skills
  { id: 'html', name: 'HTML5', category: 'Frontend', icon: 'html', level: 'Expert', weight: 3, color: '#E34F26' },
  { id: 'css', name: 'CSS3', category: 'Frontend', icon: 'css', level: 'Expert', weight: 3, color: '#1572B6' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'Frontend', icon: 'bootstrap', level: 'Expert', weight: 3, color: '#7952B3' },
  { id: 'javascript', name: 'JavaScript', category: 'Languages', icon: 'javascript', level: 'Expert', weight: 3, color: '#F7DF1E' },
  { id: 'react', name: 'React', category: 'Frontend', icon: 'react', level: 'Expert', weight: 3, color: '#61DAFB' },
  { id: 'github', name: 'GitHub', category: 'Tools', icon: 'github', level: 'Proficient', weight: 2, color: '#24292e' },
  { id: 'jquery', name: 'jQuery', category: 'Frontend', icon: 'jquery', level: 'Proficient', weight: 2, color: '#0769AD' },
  { id: 'mysql', name: 'MySQL', category: 'Databases', icon: 'sql', level: 'Proficient', weight: 2, color: '#00758F' },
  { id: 'django', name: 'Django', category: 'Backend', icon: 'django', level: 'Expert', weight: 3, color: '#092E20' },
  { id: 'python', name: 'Python', category: 'Languages', icon: 'python', level: 'Expert', weight: 3, color: '#3776AB' },
  { id: 'netlify', name: 'Netlify', category: 'Cloud & DevOps', icon: 'netlify', level: 'Proficient', weight: 2, color: '#00C7B7' },
  { id: 'postman', name: 'Postman', category: 'Tools', icon: 'postman', level: 'Proficient', weight: 2, color: '#FF6C37' },
  // Modern Full-Stack Extensions
  { id: 'typescript', name: 'TypeScript', category: 'Languages', icon: 'typescript', level: 'Proficient', weight: 2, color: '#3178C6' },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', icon: 'nextjs', level: 'Proficient', weight: 2, color: '#000000' },
  { id: 'nodejs', name: 'Node.js', category: 'Backend', icon: 'nodejs', level: 'Proficient', weight: 2, color: '#5FA04E' },
  { id: 'fastapi', name: 'FastAPI', category: 'Backend', icon: 'fastapi', level: 'Proficient', weight: 2, color: '#009688' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Databases', icon: 'postgresql', level: 'Proficient', weight: 2, color: '#336791' },
  { id: 'docker', name: 'Docker', category: 'Cloud & DevOps', icon: 'docker', level: 'Proficient', weight: 2, color: '#2496ED' },
  { id: 'aws', name: 'AWS', category: 'Cloud & DevOps', icon: 'aws', level: 'Familiar', weight: 1, color: '#FF9900' },
  { id: 'redis', name: 'Redis', category: 'Databases', icon: 'redis', level: 'Familiar', weight: 1, color: '#DC382D' }
];

export function groupSkillsByCategory(skillsList) {
  if (!skillsList || skillsList.length === 0) return SKILL_CATEGORIES;
  const map = {};
  for (const skill of skillsList) {
    const cat = (skill.category || 'OTHER').toUpperCase();
    if (!map[cat]) {
      map[cat] = [];
    }
    map[cat].push({
      name: skill.name,
      icon: skill.icon || null,
      imageUrl: skill.imageUrl || null,
      level: skill.level || 'Proficient'
    });
  }
  return Object.keys(map).map((catName) => ({
    category: catName,
    skills: map[catName]
  }));
}

export const SKILL_CATEGORIES = [
  {
    category: 'LANGUAGES',
    skills: [
      { name: 'Python', icon: 'python' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' }
    ]
  },
  {
    category: 'FRAMEWORKS',
    skills: [
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'Express.js', icon: 'express' },
      { name: 'FastAPI', icon: 'fastapi' }
    ]
  },
  {
    category: 'DATABASES',
    skills: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Redis', icon: 'redis' },
      { name: 'DynamoDB', icon: 'dynamodb' },
      { name: 'Prisma', icon: 'prisma' }
    ]
  },
  {
    category: 'CLOUD & DEVOPS',
    skills: [
      { name: 'AWS', icon: 'aws' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub Actions', icon: 'github' },
      { name: 'S3', icon: 's3' }
    ]
  },
  {
    category: 'AI/ML',
    skills: [
      { name: 'LLM APIs', icon: null },
      { name: 'LangGraph', icon: null },
      { name: 'RAG pipelines', icon: null },
      { name: 'Vector embeddings', icon: null },
      { name: 'Semantic search', icon: null }
    ]
  },
  {
    category: 'TESTING',
    skills: [
      { name: 'Jest', icon: 'jest' },
      { name: 'Vitest', icon: 'vitest' }
    ]
  }
];

export const EXPERIENCES = [
  {
    id: 'fullstack-dev',
    role: 'Full-Stack Developer',
    company: 'Independent Web Engineering & Projects',
    navMeta: 'Full-Stack Developer · 2024 – Present',
    period: '2024 – Present',
    location: 'Tamil Nadu, India',
    lede: 'Architecting and developing full-stack web applications with React, Python, Django, and MySQL.',
    points: [
      'Architected and deployed <b>Eventifyy</b>, an end-to-end event management platform integrating a <b>Django REST framework</b> backend with a responsive <b>React</b> frontend on Vercel.',
      'Designed normalized relational schemas on <b>MySQL</b> with optimized queries and indexes to ensure ACID consistency during concurrent ticket booking and seat reservation.',
      'Engineered a <b>Food Ordering System (Tomato)</b> with real-time cart state management, category filtering, and clean RESTful API integration.',
      'Implemented secure user authentication workflows, session handling, and responsive cross-browser layouts with Bootstrap and custom CSS.'
    ],
    chips: ['React', 'Django', 'Python', 'MySQL', 'JavaScript', 'Bootstrap']
  },
  {
    id: 'sethu-developer',
    role: 'Student Software Developer',
    company: 'Sethu Institute of Technology',
    navMeta: 'B.E. Computer Science · 2020 – 2024',
    period: '2020 – 2024',
    location: 'Tamil Nadu, India',
    lede: 'Graduated with a Bachelor of Engineering in Computer Science, mastering core engineering fundamentals and building academic software solutions.',
    points: [
      'Completed rigorous coursework in Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, and Software Engineering.',
      'Collaborated on team projects to develop web applications and database-backed management portals.',
      'Conducted unit testing, database normalization, and version control workflows with Git and GitHub.'
    ],
    chips: ['Python', 'MySQL', 'HTML5', 'CSS3', 'Git', 'GitHub']
  }
];

export const PROJECTS = [
  {
    id: 'eventify',
    no: '01 / 2025 · Full-Stack',
    title: 'Eventifyy',
    tag: 'Event Management & Ticket Booking System',
    lede: 'A full-stack event management and ticket reservation platform built with React and Django. Features secure authentication, real-time ticket availability, and interactive event discovery.',
    award: '🚀 Full-Stack Production Deployment',
    chips: ['React', 'Django', 'MySQL', 'Bootstrap', 'REST API'],
    linkText: 'View Live App',
    liveUrl: 'https://eventify-event-management-system.vercel.app/',
    githubUrl: 'https://github.com/vasanth246810/Eventify-Event-Management-System'
  },
  {
    id: 'food-project',
    no: '02 / 2025 · Full-Stack',
    title: 'Food Ordering Platform (Tomato)',
    tag: 'Food Delivery & Cart System',
    lede: 'A full-stack food ordering application featuring interactive restaurant menus, real-time cart state, order checkout, and Django REST backend integration.',
    award: '🍔 Full-Stack Web Application',
    chips: ['React', 'Django', 'MySQL', 'Bootstrap', 'JavaScript'],
    linkText: 'View Source',
    liveUrl: 'https://github.com/vasanth246810',
    githubUrl: 'https://github.com/vasanth246810'
  },
  {
    id: 'portfolio-3d',
    no: '03 / 2026 · Interactive System',
    title: 'Interactive 3D Skills Sphere & CMS Engine',
    tag: 'Physics Math & Firebase Synchronization',
    lede: 'An interactive 3D spherical skills cloud with dynamic physics rotation, responsive particle math, and real-time Firebase Firestore content management sync.',
    award: '🌐 3D Data Visualization',
    chips: ['React', 'JavaScript', 'Firebase', 'CSS3', 'Vite'],
    linkText: 'Explore Features',
    liveUrl: 'https://github.com/vasanth246810',
    githubUrl: 'https://github.com/vasanth246810'
  }
];

export const DEFAULT_PROFILE = {
  name: 'Vasanth S',
  initials: 'VS',
  roles: ['Full-Stack Developer', 'Software Engineer', 'Python Developer', 'Software Developer'],
  status: 'Actively Seeking Job Opportunities',
  location: 'Tamil Nadu, India',
  leadText: 'Creating modern web applications with clean code and elegant solutions. Passionate about performance, user experience, and developer tools.',
  showcaseHeadline: 'Full-Stack Developer building modern, dynamic web applications with React, Python, Django, and MySQL.',
  resumeUrl: '/Vasanth_Resume.pdf',
  avatarUrl: '',
  aboutTitle: 'Hello! I am Vasanth S',
  aboutBio: 'Passionate Full-Stack Developer specializing in building robust web applications with React and Django. I love designing clean user interfaces, architecting relational databases, and solving complex problems with efficient code.',
  aboutParas: [
    "Computer Science and Engineering graduate from Sethu Institute of Technology (2020 – 2024), passionate about full-stack engineering and software craftsmanship.",
    "Experienced across modern web technologies: building interactive user interfaces with React, JavaScript, and Bootstrap, developing secure RESTful APIs with Python and Django, and designing optimized MySQL databases.",
    "Driven by solving real-world challenges, writing clean, maintainable code, and creating seamless user experiences. Currently seeking full-time opportunities as a Full-Stack Developer or Software Engineer."
  ],
  classicAbout: "I'm a passionate Full-Stack Developer who loves building dynamic, user-friendly applications. I thrive on solving problems, creating seamless experiences, and continuously expanding my skills. Always eager to learn and grow, I'm currently looking for new opportunities to contribute and innovate.",
  flipCardTitle: 'Vasanth S ⚡',
  flipCardBack: 'Full-Stack Developer | Python · Django · React · MySQL | Sethu Institute of Technology'
};

export const DEFAULT_SOCIALS = {
  email: 'vasanthKumar49480@gmail.com',
  whatsapp: 'https://wa.me/9600245586',
  github: 'https://github.com/vasanth246810',
  linkedin: 'https://www.linkedin.com/in/vasanth-s-8a6461269/',
  instagram: 'https://www.instagram.com/__vasanth_kumar/?hl=en',
  twitter: '',
  emailjsServiceId: 'service_hjl3bd9',
  emailjsTemplateId: 'template_87e0oye',
  emailjsPublicKey: 'eFJytcy4HeMVp-6I0'
};

export const EDUCATION = [
  {
    id: 'sethu-it',
    institution: 'Sethu Institute of Technology',
    degree: 'B.E. Computer Science and Engineering',
    period: '2020 – 2024',
    score: 'CGPA: 7.8',
    highlights: 'Full-stack web development, Python programming, Relational database architecture (MySQL), Data structures & algorithms.'
  }
];

export const AWARDS = [
  {
    id: 'award-fullstack',
    title: 'Full-Stack Web Development Certification',
    issuer: 'Python & Django Development',
    year: '2024',
    link: 'https://github.com/vasanth246810'
  },
  {
    id: 'award-eventify',
    title: 'Production Web App Deployment — Eventifyy',
    issuer: 'Vercel & Open Source',
    year: '2025',
    link: 'https://eventify-event-management-system.vercel.app/'
  },
  {
    id: 'award-academic',
    title: 'Bachelor of Engineering in Computer Science',
    issuer: 'Sethu Institute of Technology',
    year: '2024',
    link: ''
  }
];

export const WRITINGS = [
  {
    id: 'writing-eventify',
    title: 'Eventifyy — Full-Stack Event Management & Booking Architecture',
    subtitle: 'Connecting React with Django REST Framework for real-time ticket reservations.',
    meta: 'Full-Stack Case Study · 2025',
    url: 'https://github.com/vasanth246810/Eventify-Event-Management-System'
  },
  {
    id: 'writing-mysql-schema',
    title: 'Designing Normalized MySQL Schemas for Web Applications',
    subtitle: 'Best practices for relational database models, indexing, and transactional integrity.',
    meta: 'Database Engineering · 2025',
    url: 'https://github.com/vasanth246810'
  }
];
