import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import '../Styles/Footer.css';
import { useAnimation } from '../component/summa';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Footer() {
  const { profile, socials } = usePortfolioData();
  const { ref: Right, classname: RightClass } = useAnimation("fade-in-up-right");

  const name = profile?.name || 'Vasanth S';
  const instagram = socials?.instagram || 'https://www.instagram.com/__vasanth_kumar/?hl=en';
  const linkedin = socials?.linkedin || 'https://www.linkedin.com/in/vasanth-s-8a6461269/';
  const github = socials?.github || 'https://github.com/vasanth246810';
  const currentYear = new Date().getFullYear();

  return (
    <div ref={Right} className={`${RightClass} footer-container`}>
      <div className="social-icons d-flex justify-content-center w-100">
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        )}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" title="GitHub">
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
        )}
      </div>
      <div className="footer-text">© {currentYear} {name}. All rights reserved.</div>
    </div>
  );
}
