import React from "react";
import { MapPin } from "lucide-react";
import "../Styles/About.css";
import Profile1 from "../assets/Profile1.jpg";
import { useInView } from "react-intersection-observer";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function About() {
  const { profile, education, experiences } = usePortfolioData();

  const aboutText = profile?.classicAbout || 
    "I'm a passionate Full-Stack Developer who loves building dynamic, user-friendly applications. I thrive on solving problems, creating seamless experiences, and continuously expanding my skills. Always eager to learn and grow, I'm currently looking for new opportunities to contribute and innovate.";
  const location = profile?.location || "Tamil Nadu, India";

  /** SECTION TRIGGER */
  const { ref: sectionRef, inView: sectionVisible } = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  /** INDIVIDUAL ELEMENT TRIGGERS */
  const { ref: imgRef, inView: imgVisible } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: textRef, inView: textVisible } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: locationRef, inView: locationVisible } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: eduRef, inView: eduVisible } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: expRef, inView: expVisible } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section ref={sectionRef} id="about" className="px-4 pt-3 pb-5">
      <div className="text-white position-relative font-base AboutSection">
        <div className="container py-3" style={{ maxWidth: "900px" }}>

          {/* --- Section Header Animates Early --- */}
          <h4 className={`fade-in-down text-center mb-2 fs-6 text-light ${sectionVisible ? "show" : ""}`}>
            GET TO KNOW ME
          </h4>

          <h1 className={`Aboutme fade-up-left fw-bold text-center mb-5 text-light ${sectionVisible ? "show" : ""}`}>
            About Me
          </h1>

          <div className="row g-4">

            {/* LEFT COLUMN */}
            <div className="col-md-5 text-center border-end border-secondary">

              {/* IMAGE */}
              <div
                ref={imgRef}
                className={`rounded-circle fade-in-up-right border d-inline-block overflow-hidden mb-4 Profile ${imgVisible ? "show" : ""}`}
              >
                <img 
                  src={profile?.avatarUrl || Profile1} 
                  alt={profile?.name || "My Profile"} 
                  height="180"
                  width="180"
                  style={{ objectFit: "cover", borderRadius: "50%" }} 
                />
              </div>

              {/* DESCRIPTION TEXT */}
              <p
                ref={textRef}
                className={`fade-in-up-right text-light mb-4 pb-4 border-bottom ${textVisible ? "show" : ""}`}
              >
                {aboutText}
              </p>

              {/* LOCATION */}
              <div
                ref={locationRef}
                className={`fade-in-up-right d-flex justify-content-center gap-2 ${locationVisible ? "show" : ""}`}
              >
                <MapPin size={18} /> {location}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-md-7 ps-4">

              {/* EDUCATION */}
              <div ref={eduRef} className={`education fade-up-left mb-5 ${eduVisible ? "show" : ""}`}>
                <h2 className="h4 fw-semibold">Education</h2>
                {education && education.length > 0 ? (
                  education.map((item, idx) => (
                    <div key={item.id || idx} className="border-bottom border-secondary pb-3 mb-3">
                      <p className="d-flex justify-content-between align-items-center mb-0">
                        <span className="fw-semibold text-white mb-1">{item.institution}</span>
                        <span className="small mb-0 text-light">{item.period}</span>
                      </p>
                      <p className="d-flex justify-content-between mb-0">
                        <span className="small mb-0">{item.degree}</span>
                        <span className="text-white small mb-0">{item.score}</span>
                      </p>
                      {item.highlights && (
                        <p className="small text-secondary mt-1 mb-0">{item.highlights}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="border-bottom border-secondary pb-3 mb-3">
                    <p className="d-flex justify-content-between align-items-center mb-0">
                      <span className="fw-semibold text-white mb-1">Sethu Institute of Technology</span>
                      <span className="small mb-0">2020 - 2024</span>
                    </p>
                    <p className="d-flex justify-content-between mb-0">
                      <span className="small mb-0">B.E Computer Science and Engineering</span>
                      <span className="text-white small mb-0">CGPA: 7.8</span>
                    </p>
                  </div>
                )}
              </div>

              {/* EXPERIENCE */}
              <div ref={expRef} className={`experience fade-up-left mb-5 ${expVisible ? "show" : ""}`}>
                <h2 className="h4 fw-semibold">Experience</h2>
                {experiences && experiences.length > 0 ? (
                  experiences.map((exp, idx) => (
                    <div key={exp.id || idx} className="pb-3 border-bottom border-secondary mb-3">
                      <h2 className="d-flex justify-content-between align-items-start fs-6 mb-1">
                        <span className="fw-semibold text-white mb-0">{exp.role} · <small className="text-secondary">{exp.company}</small></span>
                        <span className="small mb-0 text-light">{exp.period}</span>
                      </h2>
                      {exp.lede && (
                        <p className="text-secondary small mb-2">{exp.lede}</p>
                      )}
                      {exp.points && exp.points.length > 0 && (
                        <ul className="aboutul text-light small mb-0 ps-3">
                          {exp.points.map((pt, pIdx) => (
                            <li key={pIdx} dangerouslySetInnerHTML={{ __html: pt }} />
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="pb-3 border-bottom border-secondary mb-3">
                    <h2 className="d-flex justify-content-between align-items-start">
                      <span className="fw-semibold text-white mb-0">Full-Stack Developer</span>
                      <span className="small mb-0 text-light">Jul 2024 - Jun 2025</span>
                    </h2>
                    <ul className="aboutul text-light small mb-0 ps-1">
                      <li>Developed and maintained Python/Django modules.</li>
                      <li>Built REST APIs using DRF.</li>
                      <li>Improved UI responsiveness and UX.</li>
                      <li>Integrated secure authentication flows.</li>
                    </ul>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
