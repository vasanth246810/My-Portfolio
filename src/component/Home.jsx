import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import '../Styles/Home.css';

export function Home() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const TypewriterText = ({
    words, 
    typingSpeed = 120, 
    deletingSpeed = 70, 
    pauseBetweenWords = 2200 
  }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
      const word = words[currentWordIndex];
      const timeout = setTimeout(() => {
        if (!isDeleting) {
          if (currentText.length < word.length) {
            setCurrentText(word.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseBetweenWords);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(word.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      }, isDeleting ? deletingSpeed : typingSpeed);

      return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseBetweenWords]);
    useEffect(() => {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(cursorInterval);
    }, []);
    return (
      <span>
        {currentText}
        <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
      </span>
    );
  };
  return (
    <section id="home" className="px-4"style={{marginTop:"40px"}}>
      <div className="min-vh-100 position-relative d-flex flex-column justify-content-center align-items-center text-center overflow-hidden">
        <p
          ref={ref}
          className={`fade-in-down ${inView ? 'show' : ''} shine common rounded-pill px-3 py-1`}
        >
          Actively Seeking Job Opportunities
        </p>
        <div  className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <div className="text-center">
                <h1 ref={ref} className={`homename fade-in-down ${inView ? 'show' : ''} display-3 display-md-1 fw-bold mb-4 text-light`}>
                  Vasanth S
                  <br />
                  <span className="d-inline-block fs-2 fs-md-1 fw-normal text-light">
                    <TypewriterText
                      words={['Full-Stack Developer', 'Software Engineer', 'Python Developer','Software Developer']}
                      typingSpeed={120}
                      deletingSpeed={70}
                      pauseBetweenWords={2200}
                    />
                    <span className="font-monospace fs-4 align-top">\</span>
                  </span>
                </h1>
                <p className="lead text-light mx-auto" style={{ maxWidth: '42rem' }}>
                  Creating modern web applications with clean code and elegant solutions.
                  Passionate about performance, user experience, and developer tools.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={`fade-in-up ${inView ? 'show' : ''} homeinfo d-flex gap-4 mt-4`}>
          <a href="#contact" className="d-flex gap-2 Connect common rounded-pill">
            <span className="rotated-emoji">👋</span>
            Let's Connect
          </a>
          <a href="/Vasanth_Resume.pdf" className="d-flex gap-2 Resume common rounded-pill">
            My Resume
            <svg 
              className="mt-1" 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 20 20"
            >
              <path 
                fill="#f9f5f5ff" 
                d="m9 16.172l-6.071-6.071l-1.414 1.414L10 20l.707-.707l7.778-7.778l-1.414-1.414L11 16.172V0H9z"
              />
            </svg>
          </a>
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            pointerEvents: 'none',
            marginX: 'auto',
            marginTop: '-128px',
            height: '384px',
            width: '100vw',
            maxWidth: '100%',
            overflow: 'hidden',
            maskImage: 'radial-gradient(50% 50%, rgba(255,255,255,1), rgba(255,255,255,0))',
            WebkitMaskImage: 'radial-gradient(50% 50%, rgba(255,255,255,1), rgba(255,255,255,0))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at bottom center, #1a237e, transparent 80%)',
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              width: '100vw',
              height: '1100px',
              borderTopLeftRadius: '700px',
              borderTopRightRadius: '700px',
              border: '3px solid #d0e8ff',
              borderBottom: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              backgroundColor: 'transparent',
              boxShadow: '0 -10px 30px rgba(208, 232, 255, 0.5), 0 -20px 50px rgba(208, 232, 255, 0.3)',
            }}
          />
        </div>
      </div>
    </section>
  );
}