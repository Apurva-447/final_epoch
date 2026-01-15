import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Event.css";
import { API_URL } from "../config";
const Event = () => {
  const [events, setEvents] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const navigate = useNavigate();

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

  return (
    <section className="events" id="events">
      <h2>Live Events</h2>

      <div className="event-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <div className="event-card" key={event._id}>
              <img
                src={`${API_URL}/${event.image}`}
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
  );
};

export default Event;