import React from "react";
import '../styles/Footer.css';
import { Link } from 'react-router-dom';
import fb from '../assets/fb.png';
import twitter from '../assets/twitter.png';
import insta from '../assets/insta.png';
import linkedin from '../assets/linkedin.png';
import yt from '../assets/yt.png';

const Footer = () => {
  return (
    <div className="footer">
      <div className="sb_footer section_padding">

        <div className="footer_links_centered">
          <Link to="/"><p>Home</p></Link>
          <Link to="/alumni"><p>Alumni</p></Link>
        
          <Link to="/gallery"><p>Gallery</p></Link>
          <Link to="/jobs"><p>Jobs</p></Link>
          <Link to="/forums"><p>Forums</p></Link>
          <Link to="/about"><p>About</p></Link>
          <Link to="/my-network"><p>My Network</p></Link>

          {/* <a
    href="https://mvmsamiti.org/donation/"
    className="donate-button"
    onClick={() => window.location.href = "https://mvmsamiti.org/donation/"}
  >
    <p>Donate</p>
  </a> */}
        </div>

        <div className="socialmedia_centered">
          <a href="https://www.facebook.com/VidyarthiSahayakSamiti" target="_blank" rel="noopener noreferrer">
            <img src={fb} alt="fb" />
          </a>
         
          <a href="https://x.com/i/flow/login?redirect_after_login=%2FSamitiOfficial" target="_blank" rel="noopener noreferrer">
            <img src={twitter} alt="twitter" />
          </a>
          <a href="https://www.linkedin.com/company/vidyarthi-sahayyak-samiti-pune/" target="_blank" rel="noopener noreferrer">
            <img src={linkedin} alt="linkedin" />
          </a>
          <a href="https://www.instagram.com/vidyarthi_sahayyak_samiti/" target="_blank" rel="noopener noreferrer">
            <img src={insta} alt="insta" />
          </a>
          <a href="https://www.youtube.com/channel/UC2Eo8WW7qWz7ki2QyPR5NxA" target="_blank" rel="noopener noreferrer">
            <img src={yt} alt="yt" />
          </a>
          
        </div>

        <hr />

        <div className="sb_footer-below centered_text">
          <p>
            Vidyarthi Sahayyak Samiti | @ 2025 All Rights Reserved | Developed By Students
          </p>
        </div>

      </div>
    </div>
  );
}

export default Footer;
