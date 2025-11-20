import { Home, User, Briefcase, Mail, Linkedin, Github, MapPin } from "lucide-react";
import "../Styles/About.css";
import Profile1 from "../assets/Profile1.jpg";
import { 
  FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaGithub, FaFigma 
} from 'react-icons/fa';
import { 
  SiTailwindcss, SiJavascript, SiTypescript, SiNextdotjs, 
  SiFramer, SiExpress, SiMongodb, SiRedux, SiGit, 
  SiVercel, SiPostman, SiCplusplus 
} from 'react-icons/si'; 
import { useInView } from "react-intersection-observer";

export default function About() {
  const techStack = [
  { name: "HTML", icon: FaHtml5, color: "#E34F26" },
  { name: "CSS", icon: FaCss3Alt, color: "#1572B6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "React.JS", icon: FaReact, color: "#61DAFB" },
  { name: "Next.JS", icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "Framer Motion", icon: SiFramer, color: "#FF0055" },
  { name: "Node.JS", icon: FaNodeJs, color: "#339933" },
  { name: "Express.JS", icon: SiExpress, color: "#FFFFFF" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Redux Toolkit", icon: SiRedux, color: "#764ABC" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GitHub", icon: FaGithub, color: "#FFFFFF" },
  { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
  { name: "Postman", icon: SiPostman, color: "#FF6C37" },
  { name: "C++", icon: SiCplusplus, color: "#00599C" },
  { name: "Figma", icon: FaFigma, color: "#F24E1E" }
  ];

  const {ref,inView}=useInView({threshold:0.1});


  return (
    <section id="about" className="px-4 py-5">
    <div className="min-vh-100 text-white position-relative font-base AboutSection">
      <div className="container py-5" style={{maxWidth:"900px"}}>
        <h4 className="text-center mb-2 fs-6 text-light" style={{maxWidth:"none"}}>GET TO KNOW ME</h4>
        <h1 className="d-flex align-items-center justify-content-center fw-bold  mb-5 text-light bg-clip-text Aboutme">
          About Me
        </h1>
        <div className="row g-4">
          {/*ledt section*/}
            <div className="col-md-5 text-center border-end border-secondary">
            {/* Profile Image */}
              <div ref={ref} className={`rounded-circle fade-in-up-right ${inView ? "show" : ""} border overflow-hidden border-secondary d-inline-block mb-4 Profile`}>
                    <div className="w-100 h-100 d-flex justify-content-center align items-center bg-secondary bg-opacity-25">
                      <img 
                          src={Profile1} 
                          alt="My Profile" 
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} 
                        />
                    </div>
              </div>
            {/* <div className="rounded-circle overflow-hidden border border-secondary d-inline-block mb-4" style={{ width: "180px", height: "180px" }}>
              <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-secondary bg-opacity-25">
                <User size={90} className="text-secondary" />
              </div>
            </div> */}
            <p ref={ref} className={`fade-in-up-right ${inView ? "show" : ""} text-light mb-4 pb-4 border-bottom`}> I'm a passionate Full-Stack Developer who loves building dynamic, user-friendly applications. 
              I thrive on solving problems, creating seamless experiences, and continuously expanding my skills. 
              Always eager to learn and grow, I'm currently looking for new opportunities to contribute and innovate.</p>

            {/* Bio */}
            {/* <p className="text-light opacity-75 mb-4">
              I'm a passionate Full-Stack Developer who loves building dynamic, user-friendly applications. 
              I thrive on solving problems, creating seamless experiences, and continuously expanding my skills. 
              Always eager to learn and grow, I'm currently looking for new opportunities to contribute and innovate.
            </p> */}

            <div ref={ref} className={`fade-in-up-right ${inView ? "show" : ""} d-flex justify-content-center gap-4 align-items-center text-secondary`}>
              <MapPin size={18} />
              <span>TamilNadu, India</span>
            </div>
            {/* Location */}
            {/* <div className="d-flex align-items-center justify-content-center gap-2 text-secondary">
              <MapPin size={18} />
              <span>Punjab, India</span>
            </div> */}
          </div>
          <div className="col-md-7 ps-4">
            <div ref={ref} className={`fade-up-left ${inView ? "show" : ""} mb-5`}>
              <h2 className="h4 fw- semibold">Education</h2>
              <div className="border-bottom border-secondary d-flex justify-content-between align-items-center pb-3  mb-3">
                <div>
                  <h5 className="fw-semibold text-white mb-1">Sethu Institute of Technology</h5>
                  <p className="text-secondary mb-0 small">B.E Computer Science and Engineering</p>
                </div>
                <div className="text-end">
                  <p className="text-secondary mb-0 small">2020 - 2024</p>
                  <p className="text-white mb-0 small">CGPA: 7.8</p>
                </div>
              </div>

            </div>


            <div className="mb-5">
              <div ref={ref} className={`fade-up-left ${inView ? "show" : ""} mb-5`}>
              <h2 className="h4 fw-semibold">Experience</h2>
               <div className="pb-3 mb-3 border-bottom border-secondary">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-semibold text-white mb-0">Full-Stack Developer</h5>
                  <p className="text-secondary small mb-0">Jul 2024 - Jun 2025</p>
                </div>
                <ul className="text-light opacity-75 small mb-0 ps-3">
                  <li>Developed and maintained Python/Django modules for IsoTracker, improving system reliability for 130+ companies.</li>
                  <li>Built and optimized RESTful APIs using Django REST Framework, improving API response time by 20%.</li>
                  <li>Integrated third-party APIs and implemented secure authentication and session management.</li>
                  <li>Wrote clean, modular, reusable code following Django MVT and OOP principles.</li>
                  <li>Debugged and resolved production issues, reducing error occurrences and improving overall platform stability.</li>
                  <li>Used Git/GitHub for version control and contributed to code reviews and unit testing.</li>
                  <li>Improved front-end responsiveness using Bootstrap, jQuery, and AJAX, reducing page load time by 40%.</li>

                </ul>
              </div>
              {/* <div className="pb-3 mb-3 border-bottom border-secondary">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-semibold text-white mb-0">Freelance Full-Stack Developer</h5>
                  <p className="text-secondary small mb-0">Feb 2025 - Present</p>
                </div>
                <ul className="text-light opacity-75 small mb-0 ps-3">
                  <li>Built 4+ full-stack web applications using MERN stack for diverse clients.</li>
                  <li>Delivered high-performance, responsive solutions with exceptional UX.</li>
                </ul>
              </div> */}
              </div>
              <div ref={ref} className={`fade-up-left ${inView ? "show" : ""}`}>
              <h2 className="h4 fw-semibold mb-3">Tech Stack</h2>
              <div className="d-flex gap-2 flex-wrap gap-2">
                {techStack.map((tech,i)=>(<span key={i} className={` Techstack rotate-y ${inView ? "show" : ""} gap-2 badge rounded-pill bg-secondary px-3 py-2 bg-opacity-25 border border-secondary d-flex align-items-center`}>
                  <tech.icon style={{color:tech.color}} size={18}/>
                  {tech.name}
                </span>))}
              </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
    </section>
  );
}
