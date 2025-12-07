import { MapPin } from "lucide-react";
import "../Styles/About.css";
import Profile1 from "../assets/Profile1.jpg";
import { useInView } from "react-intersection-observer";

export default function About() {

  const techStack = [
    // (...keeping your array unchanged)
  ];

  /** SECTION TRIGGER */
  const { ref: sectionRef, inView: sectionVisible } = useInView({
    threshold: 0.05,
  });

  /** INDIVIDUAL ELEMENT TRIGGERS */
  const { ref: imgRef, inView: imgVisible } = useInView({ threshold: 0.2 });
  const { ref: textRef, inView: textVisible } = useInView({ threshold: 0.2 });
  const { ref: locationRef, inView: locationVisible } = useInView({ threshold: 0.2 });
  const { ref: eduRef, inView: eduVisible } = useInView({ threshold: 0.2 });
  const { ref: expRef, inView: expVisible } = useInView({ threshold: 0.2 });
  const { ref: skillsRef, inView: skillsVisible } = useInView({ threshold: 0.2 });

  return (
    <section ref={sectionRef} id="about" className="px-4 py-5">
      <div className="min-vh-100 text-white position-relative font-base AboutSection">
        <div className="container py-5" style={{ maxWidth: "900px" }}>

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
                  src={Profile1} 
                  alt="My Profile" 
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
                I'm a passionate Full-Stack Developer who loves building dynamic, user-friendly applications. 
                I thrive on solving problems, creating seamless experiences, and continuously expanding my skills. 
                Always eager to learn and grow, I'm currently looking for new opportunities to contribute and innovate.
              </p>

              {/* LOCATION */}
              <div
                ref={locationRef}
                className={`fade-in-up-right d-flex justify-content-center gap-2 text-secondary ${locationVisible ? "show" : ""}`}
              >
                <MapPin size={18} /> Tamil Nadu, India
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-md-7 ps-4">

              {/* EDUCATION */}
              <div ref={eduRef} className={`fade-up-left mb-5 ${eduVisible ? "show" : ""}`}>
                <h2 className="h4 fw-semibold">Education</h2>
                <div className="border-bottom border-secondary d-flex justify-content-between align-items-center pb-3 mb-3">
                  <div>
                    <h5 className="fw-semibold text-white mb-1">Sethu Institute of Technology</h5>
                    <p className="text-secondary small mb-0">B.E Computer Science and Engineering</p>
                  </div>
                  <div className="text-end">
                    <p className="text-secondary small mb-0">2020 - 2024</p>
                    <p className="text-white small mb-0">CGPA: 7.8</p>
                  </div>
                </div>
              </div>

              {/* EXPERIENCE */}
              <div ref={expRef} className={`fade-up-left mb-5 ${expVisible ? "show" : ""}`}>
                <h2 className="h4 fw-semibold">Experience</h2>
                <div className="pb-3 border-bottom border-secondary mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="fw-semibold text-white mb-0">Full-Stack Developer</h5>
                    <p className="text-secondary small mb-0">Jul 2024 - Jun 2025</p>
                  </div>

                  <ul className="text-light opacity-75 small mb-0 ps-3">
                    <li>Developed and maintained Python/Django modules.</li>
                    <li>Built REST APIs using DRF.</li>
                    <li>Improved UI responsiveness and UX.</li>
                    <li>Integrated secure authentication flows.</li>
                  </ul>
                </div>
              </div>

              {/* FUTURE TECH STACK AREA */}
              <div ref={skillsRef} className={`fade-up-left ${skillsVisible ? "show" : ""}`}>
                {/* uncomment later if needed */}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
