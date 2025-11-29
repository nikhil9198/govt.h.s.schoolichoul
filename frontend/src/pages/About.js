import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>About Our School</h1>
          <p className="hero-subtitle">Excellence in Education Since 1990</p>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <div className="about-content">
            <h2>Our Mission</h2>
            <p>
              Our mission is to provide a comprehensive, high-quality education that prepares students
              for success in college, career, and life. We are committed to fostering a learning
              environment that encourages critical thinking, creativity, and personal growth.
            </p>
          </div>

          <div className="about-content">
            <h2>Our Vision</h2>
            <p>
              We envision a school where every student is empowered to reach their full potential,
              where diversity is celebrated, and where learning is a lifelong journey. We strive to
              be a leading educational institution that sets the standard for excellence in teaching
              and student achievement.
            </p>
          </div>

          <div className="about-content">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🎓</div>
                <h3>Excellence</h3>
                <p>We strive for excellence in all aspects of education and student development.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Integrity</h3>
                <p>We maintain the highest standards of honesty, ethics, and moral principles.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌟</div>
                <h3>Innovation</h3>
                <p>We embrace innovative teaching methods and cutting-edge educational technology.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">❤️</div>
                <h3>Respect</h3>
                <p>We foster a culture of mutual respect, understanding, and appreciation for diversity.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h3>Growth</h3>
                <p>We encourage continuous learning and personal growth for students and staff.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌍</div>
                <h3>Community</h3>
                <p>We build strong connections with families and the broader community.</p>
              </div>
            </div>
          </div>

          <div className="about-content">
            <h2>Our History</h2>
            <p>
              Founded in 1990, our school has been a cornerstone of educational excellence in the
              community. Over the years, we have grown from a small institution to a comprehensive
              educational facility serving thousands of students. Our commitment to quality education
              has remained unwavering, and we continue to evolve to meet the changing needs of our
              students and the world.
            </p>
          </div>

          <div className="about-content">
            <h2>Our Achievements</h2>
            <div className="achievements-list">
              <div className="achievement-item">
                <strong>95%</strong> Graduation Rate
              </div>
              <div className="achievement-item">
                <strong>1000+</strong> Successful Alumni
              </div>
              <div className="achievement-item">
                <strong>50+</strong> Qualified Teachers
              </div>
              <div className="achievement-item">
                <strong>30+</strong> Years of Excellence
              </div>
            </div>
          </div>

          <div className="about-content">
            <h2>Why Choose Us?</h2>
            <ul className="features-list">
              <li>✅ Experienced and dedicated faculty members</li>
              <li>✅ State-of-the-art facilities and technology</li>
              <li>✅ Comprehensive curriculum aligned with modern standards</li>
              <li>✅ Strong focus on student support and guidance</li>
              <li>✅ Extracurricular activities and clubs</li>
              <li>✅ Safe and inclusive learning environment</li>
              <li>✅ College and career preparation programs</li>
              <li>✅ Active parent and community involvement</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

