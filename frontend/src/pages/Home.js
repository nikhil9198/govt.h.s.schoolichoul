import React from 'react';
import ImageSlider from '../components/ImageSlider';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <ImageSlider />
      
      <div className="container">
        <section className="welcome-section">
          <h2>Welcome to Our School</h2>
          <p>
            We are committed to providing quality education and fostering a learning environment
            that helps students achieve their full potential. Our comprehensive curriculum and
            experienced faculty ensure that every student receives the best education possible.
          </p>
        </section>

        <section className="features-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Quality Education</h3>
              <p>Comprehensive curriculum designed to meet modern educational standards</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Expert Faculty</h3>
              <p>Experienced and dedicated teachers committed to student success</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Modern Technology</h3>
              <p>State-of-the-art facilities and technology-enhanced learning</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Student Support</h3>
              <p>Comprehensive support services for academic and personal growth</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

