import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin, faGithub, faEnvelope } from '@fortawesome/free-brands-svg-icons';
import '../Styles/Footer.css';
import {useAnimation} from '../component/summa'

export default function Footer() {
    const { ref: Right, classname: RightClass } = useAnimation("fade-in-up-right");
  return (
    <div ref ={Right} className={` ${RightClass} footer-container`}>
      <div className="social-icons d-flex justify-content-center w-100">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} size="2x" />
        </a>
        <a href="https://www.instagram.com/__vasanth_kumar/?hl=en" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
        <a href="https://www.linkedin.com/in/vasanth-s-8a6461269/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </a>
        <a href="https://github.com/vasanth246810" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
        {/* <a href="mailto:your-email@example.com" className="email-link">
          <FontAwesomeIcon icon={faEnvelope} size="2x" />
        </a> */}
      </div>
      <div className="footer-text">© 2025 Vasanth S. All rights reserved.</div>
    </div>
  );
}
