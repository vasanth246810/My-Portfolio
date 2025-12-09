import React, { useState, useEffect } from 'react';

const TypewriterText = ({ words, typingSpeed = 120, deletingSpeed = 70, pauseBetweenWords = 2200 }) => {
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

const Hero = () => {
  return (
    <section className="min-vh-100 d-flex flex-column align-items-center justify-content-center px-3 px-md-4 pt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="text-center">
              <div className="font-monospace small text-light mb-4">
                console.log('Hello, World!')
              </div>
              
              <h1 className="display-3 display-md-1 fw-bold mb-4 text-light">
               Vasanth S
                <br />
                <span className="d-inline-block fs-2 fs-md-1 fw-normal text-light">
                  <TypewriterText
                    words={["Full-Stack Developer", "Software Engineer", "Cloud Engineer"]}
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
    </section>
  );
};

export default Hero;