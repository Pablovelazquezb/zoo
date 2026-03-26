import React, { useEffect, useState } from 'react';
import { getUpcomingEvents } from '../../../api/public';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPaw } from 'react-icons/fa';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getUpcomingEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBD';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Group events by month for better organization
  const groupEventsByMonth = () => {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.event_date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByMonth();

  if (loading) {
    return (
      <div className="events-page">
        <div className="container">
          <div className="loading-spinner">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero">
        <div className="container">
          <h1 className="events-hero-title">Upcoming Events</h1>
          <p className="events-hero-subtitle">
            Discover exciting animal encounters, keeper talks, and special programs at Coog Zoo.
          </p>
        </div>
      </section>

      {/* Events List */}
      <div className="container">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="no-events">
            <h2>No Upcoming Events</h2>
            <p>Check back soon for exciting events and programs at Coog Zoo!</p>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <section key={monthYear} className="events-month-section">
              <h2 className="month-title">{monthYear}</h2>
              <div className="events-grid">
                {monthEvents.map((event) => (
                  <div key={event.event_id} className="event-card">
                    <div className="event-date-badge-large">
                      <span className="event-month">
                        {new Date(event.event_date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="event-day">
                        {new Date(event.event_date).getDate()}
                      </span>
                    </div>
                    <div className="event-details">
                      <h3 className="event-name">{event.event_name}</h3>
                      <p className="event-description">{event.event_description || 'Join us for this exciting event!'}</p>
                      <div className="event-meta">
                        <div className="meta-item">
                          <FaCalendarAlt className="meta-icon" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        {event.event_time && (
                          <div className="meta-item">
                            <FaClock className="meta-icon" />
                            <span>{formatTime(event.event_time)}</span>
                          </div>
                        )}
                        {event.venue && (
                          <div className="meta-item">
                            <FaMapMarkerAlt className="meta-icon" />
                            <span>{event.venue}</span>
                          </div>
                        )}
                      </div>
                      <a href={`/events/${event.event_id}`} className="event-button">
                        Learn More →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}