import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config"; // ✅ ADD THIS

const AdminManageEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "admin" && decoded.exp * 1000 > Date.now()) {
          fetchEvents();
        } else {
          navigate("/admin/login");
        }
      } catch {
        navigate("/admin/login");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await fetch(`${API_URL}/api/events/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          alert("Event deleted successfully");
          fetchEvents();
        } else {
          alert("Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="admin-page">
      <h1>Manage Events</h1>

      <Link to="/admin/add-event">
        <button className="add-btn">Add New Event</button>
      </Link>

      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-item">
            <img
              src={`${API_URL}/${event.image}`}
              alt={event.title}
              style={{
                width: "50%",
                height: "300px",
                objectFit: "cover",
              }}
            />

            <div className="event-details">
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <p>₹{event.price}</p>
              <p>Seats: {event.availableSeats}</p>

              <button onClick={() => handleDelete(event._id)}>Delete</button>

              <Link to={`/admin/edit-event/${event._id}`}>
                <button>Edit</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminManageEvents;
