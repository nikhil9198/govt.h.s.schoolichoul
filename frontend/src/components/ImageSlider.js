import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ImageSlider.css';

const ImageSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const fetchSlides = async () => {
    try {
      const response = await api.get('/slides');
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  if (loading) {
    return <div className="slider-loading">Loading slides...</div>;
  }

  if (slides.length === 0) {
    return null;
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    return baseUrl.replace('/api', '') + imageUrl;
  };

  return (
    <div className="image-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${getImageUrl(slide.imageUrl)})`,
            }}
          >
            <div className="slide-overlay">
              {slide.title && <h2>{slide.title}</h2>}
              {slide.description && <p>{slide.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button className="slider-btn prev" onClick={goToPrevious}>
            &#8249;
          </button>
          <button className="slider-btn next" onClick={goToNext}>
            &#8250;
          </button>

          <div className="slider-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;

