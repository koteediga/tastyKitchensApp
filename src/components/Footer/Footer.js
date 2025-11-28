import React from 'react'
import {
  FaPinterestSquare,
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
} from 'react-icons/fa'
import './Footer.css'

const Footer = () => (
  <footer className="footer">
    <div className="footer-brand">
      <img
        src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759582225/Group_7420_e4ynxt.png"
        alt="website-footer-logo"
        className="footer-logo"
      />
      <h1 className="footer-title">Tasty Kitchen</h1>
    </div>

    <p className="footer-caption">
      The only thing we are serious about is food. Contact us on
    </p>

    <div className="footer-socials">
      <FaPinterestSquare
        size={32}
        data-testid="pintrest-social-icon"
        className="footer-social-icon"
      />
      <FaInstagram
        size={32}
        data-testid="instagram-social-icon"
        className="footer-social-icon"
      />
      <FaTwitter
        size={32}
        data-testid="twitter-social-icon"
        className="footer-social-icon"
      />
      <FaFacebookSquare
        size={32}
        data-testid="facebook-social-icon"
        className="footer-social-icon"
      />
    </div>
  </footer>
)

export default Footer
