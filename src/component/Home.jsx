import "../Styles/Home.css";
import {useInView} from "react-intersection-observer";

export function Home() {
  const {ref,inView}=useInView({threshold:0.1});

  return (
    <section  id="home" className="px-4">
    <div className="min-vh-100 position-relative d-flex flex-column justify-content-center align-items-center text-center overflow-hidden ">
      <p ref={ref} className={`fade-in-down ${inView ? "show":""} shine common rounded-pill px-3 py-1`}>Actively Seeking Job Opportunities</p>
      <h1 ref={ref} className={`fade-in-up ${inView ? "show":""} MainHeading`}>Crafting Beautiful & Functional Web Experiences</h1>
      <h4 ref={ref} className={`fade-in-up ${inView ? "show":""} Subheading`}>Hey, I'm Vasanth S, a Full Stack Developer passionate about building performance, user-friendly, and scalable applications.</h4>
      <div ref={ref} className={`fade-in-up ${inView ? "show":""} d-flex gap-4 mt-4`}>
        <a href="#contact" className=" d-flex gap-2 Connect common rounded-pill">
          <span className="rotated-emoji">👋</span>
          Let's Connect
        </a>
        <a href="/Vasanth_Resume.pdf" className="d-flex gap-2 Resume common rounded-pill">My Resume
          <svg className="mt-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path fill="#f9f5f5ff" d="m9 16.172l-6.071-6.071l-1.414 1.414L10 20l.707-.707l7.778-7.778l-1.414-1.414L11 16.172V0H9z"/></svg>
        </a>
      </div>
      {/* Curved section */}
              <div
        style={{
          position: "relative",
          zIndex: 10,
          pointerEvents: "none",
          marginX: "auto",
          marginTop: "-128px",
          height: "384px",
          width: "100vw",
          maxWidth: "100%",
          overflow: "hidden",
          maskImage:
            "radial-gradient(50% 50%, rgba(255,255,255,1), rgba(255,255,255,0))",
          WebkitMaskImage:
            "radial-gradient(50% 50%, rgba(255,255,255,1), rgba(255,255,255,0))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at bottom center, #1a237e, transparent 80%)",
            opacity: 0.6,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            width: "100vw",
            height: "1100px",
            borderTopLeftRadius: "700px",
            borderTopRightRadius: "700px",
            border: "3px solid #d0e8ff",
            borderBottom: "none",
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: "transparent",
            boxShadow:
              "0 -10px 30px rgba(208, 232, 255, 0.5), 0 -20px 50px rgba(208, 232, 255, 0.3)",
          }}
        ></div>
      </div>
              </div>
    </section>
  );
}
