import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Govt. Higher Secondary School, Ichaul</h3>
          <p>Empowering education through technology</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: ghssichaul12@gmail.com</p>
          <p>Phone: +917999645449</p>
          <p>Address: 123 School Street, City, State 12345</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

