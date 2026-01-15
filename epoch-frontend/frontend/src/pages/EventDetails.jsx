import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetails.css";
import { API_URL } from "../config";
const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="loading">Loading event...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div className="event-details-container">
      <div className="event-details-card">
        <img
          src={`${API_URL}/${event.image}`}
          alt={event.title}
          className="event-image"
        />

        <div className="event-info">
          <h1>{event.title}</h1>
          <p>📅 {new Date(event.date).toDateString()}</p>
          <p>📍 {event.location}</p>
          <p>{event.description}</p>

          <div className="event-meta">
            <span>💺 Seats Left: {event.availableSeats}</span>
            <span>💰 Price: ₹{event.price}</span>
          </div>

          <button onClick={() => navigate(`/book/${event._id}`)}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
