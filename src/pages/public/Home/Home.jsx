import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { getUpcomingEvents, getHomeStats } from '../../../api/public';

// Import React Icons
import { FaClock, FaTicketAlt, FaMap } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';


export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [homeStats, setHomeStats] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const events = await getUpcomingEvents();
        setUpcomingEvents(events);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const slides = [
    {
      image: 'src/images/elephant2.jpg',
      title: 'Welcome to the zoo!',
      subtitle: 'Experience over x species from around the world',
      buttons: [{ text: '🎟️ Buy Tickets', link: '/tickets', variant: 'primary' }]
    },
    {
      image: 'src/images/giraffe.jpg',
      title: 'Daily Animal Encounters',
      subtitle: 'Get up close with our friendly animals',
      buttons: [{ text: '⏰ View Schedule', link: '/schedule', variant: 'secondary' }]
    },
    {
      image: 'src/images/lion.jpg',
      title: 'New Lion Exhibit',
      subtitle: 'Now open! Visit our majestic lions',
      buttons: [{ text: '🦁 Learn More', link: '/exhibits/lions', variant: 'primary' }]
    },
    {
      image: 'src/images/penguin.jpg',
      title: 'Join us for a lunch with the Zoo Keepers!',
      subtitle: 'Learn more about how you can support the zoo!',
      buttons: [{ text: '🍽️ RVSP for the lunch!', link: '/RSVP', variant: 'secondary' }]
    }
  ];

  return (
    <div className="home">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/tickets" className="navbar-link navbar-link-primary">
            🎟️ Buy Tickets
          </a>
          <a href="/map" className="navbar-link">
            🗺️ Zoo Map
          </a>
          <a href="/events" className="navbar-link">
            📅 Events
          </a>
          <a href="/shop" className="navbar-link">
            🛍️ Shop
          </a>
          <a href="/dashboard" className="navbar-link">
            🔑 Login
          </a>
        </div>
      </nav>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="container">
          <h1 className="welcome-title">Welcome to Coog Zoo</h1>
          <p className="welcome-subtitle">
            Discover amazing wildlife, attend exciting events, and support animal conservation.
          </p>
        </div>
      </section>

      {/* Slideshow Section */}
      <section className="slideshow-section">
        <div className="container">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          loop={true}
          className="hero-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="hero-slide">
                <img 
                  src={slide.image}
                  alt={slide.title}
                  className="hero-image"
                />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h2 className="hero-title">{slide.title}</h2>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                    <div className="hero-buttons">
                      {slide.buttons.map((button, btnIndex) => (
                        <a 
                          key={btnIndex}
                          href={button.link}
                          className={`hero-button hero-button-${button.variant}`}
                        >
                          {button.text}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      </section>

      {/* Today's Information Bar */}
      <section className="info-bar">
        <div className="container">
          <div className="info-grid">
            <a href="/hours" className="info-card">
              <FaClock className="info-icon" size={50} />
              <p className="info-label">Today's Hours</p>
              <p className="info-value">9am - 5pm</p>
            </a>
            
            <a href="/tickets" className="info-card">
              <FaTicketAlt className="info-icon" size={50} />
              <p className="info-label">Buy Tickets</p>
              <p className="info-value">Click here</p>
            </a>
            
            <a href="/map" className="info-card">
              <FaMap className="info-icon" size={50} />
              <p className="info-label">Zoo Map</p>
              <p className="info-value">View Map</p>
            </a>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Upcoming Events */}
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
            <a href="/events" className="section-link">
              View all events →
            </a>
          </div>
          <div className="card">
            <p className="card-placeholder">Event calendar will go here.</p>
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Today's Schedule</h2>
            <a href="/schedule" className="section-link">
              Full schedule →
            </a>
          </div>
          <div className="card">
            <p className="card-placeholder">Animal shows and feeding times will appear here.</p>
          </div>
        </section>

        {/* Support Wildlife */}
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Support Wildlife</h2>
            <a href="/conservation" className="section-link">
              Learn more →
            </a>
          </div>
          <div className="card card-conservation">
            <p className="card-text">
              Donations help protect endangered animals and fund conservation programs.
            </p>
            <a href="/donations" className="button button-primary">
              Donate Now
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}