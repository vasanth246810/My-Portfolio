import React, { useState } from 'react';
import '../Styles/Projects.css';
import { ProjectInfo as DEFAULT_PROJECT_INFO } from './ProjectInfo';
import { useInView } from 'react-intersection-observer';
import { usePortfolioData } from '../context/PortfolioDataContext';
import github from '../assets/github.png';
import previewFallback from '../assets/preview.webp';

export default function Projects() {
  const { projects: liveProjects } = usePortfolioData();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  // Format list from live context or fallback to static ProjectInfo
  const projectList = (liveProjects && liveProjects.length > 0)
    ? liveProjects.map((p, idx) => {
        // Find matching static fallback if needed for images
        const staticMatch = DEFAULT_PROJECT_INFO[idx % DEFAULT_PROJECT_INFO.length];
        return {
          title: p.title,
          description: p.lede || p.description || '',
          image: p.image || staticMatch?.image || previewFallback,
          Link: p.linkUrl || p.Link || '',
          GithubLink: p.githubUrl || p.GithubLink || 'https://github.com/vasanth246810',
          chips: p.chips || (staticMatch?.techStack ? staticMatch.techStack.map(t => t.name) : []),
          award: p.award || '',
          tag: p.tag || ''
        };
      })
    : DEFAULT_PROJECT_INFO.map(p => ({
        ...p,
        chips: p.techStack ? p.techStack.map(t => t.name) : []
      }));

  const [hoveredCards, setHoveredCards] = useState(new Array(projectList.length).fill(false));

  return (
    <section id="projects" className="px-4 py-5">
      <div className="ProjectHeader min-vh-100">
        <h4 ref={ref} className={`fade-right ${inView ? "show" : ""} text-center mb-2 fs-6 text-light`}>
          EXPLORE MY CREATIONS
        </h4>
        <h1 ref={ref} className={`${inView ? "show" : ""} fade-in-up ProjectName d-flex align-items-center justify-content-center fw-bold mb-5 text-light bg-clip-text`}>
          Projects
        </h1>

        <div ref={ref} className={`${inView ? "show" : ""} fade-up-large container`}>
          {projectList.map((project, index) => (
            <div
              key={index}
              className="portfolio-project-card text-light border rounded-8 position-sticky my-5"
              style={{
                maxWidth: "900px",
                margin: "auto",
                minHeight: "400px",
                borderRadius: "1rem",
                top: `calc(72px + ${index * 30}px)`,
                backgroundColor: "#0a0a0a"
              }}
            >
              <div className="row g-4" style={{ minHeight: "400px" }}>
                <div className="project col-lg-6">
                  <h3 className="fw-semibold border-bottom pb-2">{project.title}</h3>
                  {project.tag && (
                    <div className="text-secondary small mt-1 mb-2">{project.tag}</div>
                  )}
                  <p className="mt-2">{project.description}</p>

                  {project.award && (
                    <div className="small text-warning fw-semibold mb-2">
                      {project.award}
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {(project.chips || []).map((chip, chipIndex) => (
                      <span
                        key={chipIndex}
                        className="badge rounded-pill px-3 py-2 bg-opacity-25 border border-secondary d-flex align-items-center"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="ProjectSourceMain d-flex gap-4 mt-3">
                    {project.GithubLink && (
                      <a href={project.GithubLink} target="_blank" rel="noopener noreferrer" className="ProjectSource">
                        <img src={github} alt="Project GitHub" className="mt-1" height="14px" />
                        Github
                      </a>
                    )}
                    {project.Link && (
                      <a href={project.Link} target="_blank" rel="noopener noreferrer" className="ProjectSource">
                        <svg
                          stroke="currentColor"
                          className="mt-1"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Live
                      </a>
                    )}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div
                    className="image-container"
                    style={{ height: '100%', overflow: 'hidden', borderRadius: '8px' }}
                    onMouseEnter={() => setHoveredCards(prev => prev.map((h, i) => i === index ? true : h))}
                    onMouseLeave={() => setHoveredCards(prev => prev.map((h, i) => i === index ? false : h))}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = previewFallback;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={`project-overlay ${hoveredCards[index] ? 'show' : ''}`}>
                <img src={project.image} alt="Full project" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
