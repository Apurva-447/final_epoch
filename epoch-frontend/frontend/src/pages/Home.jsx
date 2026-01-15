import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config"; // ✅ IMPORTANT

const Home = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [userName, setUserName] = useState("");

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setEvents([]);
          setTimelineEvents([]);
          return;
        }

        setEvents(data);

        const sorted = [...data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setTimelineEvents(sorted);
      })
      .catch(() => {
        setEvents([]);
        setTimelineEvents([]);
      });
  }, []);

  /* ================= USER NAME ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUserName(decoded.name);
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  /* ================= GALLERY ================= */
  const images = [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((i) => (i + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1>{userName ? `Hello ${userName}!` : "Welcome to EPOCH 🎉"}</h1>
          <p>Discover, book & manage events effortlessly</p>
          <button
            className="primary-btn"
            onClick={() =>
              document.getElementById("events")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Explore Events
          </button>
        </div>
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="timeline-section">
        <h2>Program Schedule</h2>
        <div className="timeline">
          {timelineEvents.slice(0, 3).map((event, index) => (
            <div
              key={event._id}
              className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="timeline-content">
                <span>{new Date(event.date).toDateString()}</span>
                <img
                  src={`${API_URL}/${event.image}`}   // ✅ FIX
                  alt={event.title}
                />
                <h3>{event.title}</h3>
                <p>📍 {event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <section className="events" id="events">
        <h2>Live Events</h2>

        <div className="event-grid">
          {events.length > 0 ? (
            events.map((event) => (
              <div className="event-card" key={event._id}>
                <img
                  src={`${API_URL}/${event.image}`}   // ✅ FIX
                  alt={event.title}
                />
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>📍 {event.location}</p>
                  <p>₹{event.price}</p>
                  <p>Seats Left: {event.availableSeats}</p>

                  <Link to={`/events/${event._id}`}>View Details</Link>
                  <button onClick={() => navigate(`/book/${event._id}`)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No events available</p>
          )}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="About EPOCH"
            />
          </div>

    <div className="about-content">
      <h2>About EPOCH</h2>
      
  <p>
    EPOCH is a modern event management platform designed to simplify the way
    people discover, explore, and book events. Whether it’s concerts,
    workshops, conferences, or social meetups, EPOCH brings all events
    together in one easy-to-use platform.
  </p>

  <p>
    Our goal is to eliminate the complexity involved in event discovery and
    ticket booking by providing a clean, fast, and user-friendly experience.
    Users can browse live events, view event details, check seat availability,
    and book tickets securely within seconds.
  </p>

  <p>
    EPOCH is built using the MERN stack (MongoDB, Express.js, React, and
    Node.js), ensuring high performance, scalability, and reliability. The
    platform also includes a dedicated admin dashboard that allows event
    organizers to manage events, track bookings, and monitor user activity
    efficiently.
  </p>

  <p>
    With a strong focus on usability, security, and modern design, EPOCH aims
    to bridge the gap between event organizers and attendees, creating a
    seamless and engaging event experience for everyone.
  </p>
    </div>
  </div>
</section>
{/* GALLERY SLIDER */}
<section className="gallery-section" id="gallery">
  <h2>Event Gallery</h2>
  <p className="gallery-subtext">
    Moments captured from our amazing events
  </p>

  <div className="slider">
    <img
      src={images[currentIndex]}
      alt="Event Gallery"
      className="slider-image"
    />
  </div>
</section>
{/* CONTACT US */}
<section className="contact-section" id="contact">
  <h2>Contact Us</h2>
  <p className="contact-subtext">
    Have questions or need support? We’d love to hear from you.
  </p>

  <div className="contact-container">
    <div className="contact-info">
      <p><strong>📍 Address:</strong> BMS COLLEGE OF ENGINEERING, India</p>
      <p><strong>📧 Email:</strong> support@epoch.com</p>
      <p><strong>📞 Phone:</strong> +91 98765 43210</p>
    </div>
</div>
  
  
</section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <p>© 2025 EPOCH. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
