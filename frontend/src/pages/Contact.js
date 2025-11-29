import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="hero-subtitle">We'd love to hear from you</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have questions? We're here to help! Reach out to us through any of the following
              methods, and we'll get back to you as soon as possible.
            </p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Address</h3>
                <p>123 School Street</p>
                <p>City, State 12345</p>
                <p>United States</p>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>Phone</h3>
                <p>Main Office: +918574159461</p>
                <p>Admissions: +919424372136</p>
              </div>

              <div className="info-card">
                <div className="info-icon">✉️</div>
                <h3>Email</h3>
                <p>General: ghssichaul12@gmail.com</p>
                <p>Admissions: ghssichaul12@gmail.com</p>
                <p>Support: ghssichaul12@gmail.com</p>
              </div>

              <div className="info-card">
                <div className="info-icon">🕒</div>
                <h3>Office Hours</h3>
                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 1:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
          <div className="contact-form-container">
            <h2>Send us a Message</h2>
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>Thank you for your message! We'll get back to you soon.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    required
                  />
                </div>

                <button type="submit" className="btn-submit">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="map-section">
          <h2>Find Us</h2>
          <div className="map-placeholder">
            <p>📍 Map Location</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Interactive map would be integrated here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

