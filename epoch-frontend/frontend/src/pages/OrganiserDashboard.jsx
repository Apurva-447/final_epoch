import { useEffect, useState } from "react";
import "./organiser.css";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const OrganiserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [editEvent, setEditEvent] = useState(null); // State for editing
  const [stats, setStats] = useState(null);

const fetchStats = async () => {
  const res = await fetch(`${API_URL}/api/events/organiser/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  setStats(data);
};

useEffect(() => {
  fetchEvents();
  fetchStats();
}, []);

  const [editForm, setEditForm] = useState({ title: "", location: "", date: "" });
  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    const res = await fetch(`${API_URL}/api/events/my-events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await fetch(`${API_URL}/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEvents();
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setEditForm({ title: event.title, location: event.location, date: event.date });
  };
const exportCSV = () => {
  if (!stats?.bookings) return;

  const rows = [
    ["Event", "User", "Email", "Seats", "Amount"],
    ...stats.bookings.map(b => [
      b.event.title,
      b.user.name,
      b.user.email,
      b.seats,
      b.seats * b.event.price,
    ]),
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map(e => e.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "bookings.csv";
  link.click();
};

  const saveEdit = async () => {
    await fetch(`${API_URL}/api/events/${editEvent._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });
    setEditEvent(null);
    fetchEvents();
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalSeats = events.reduce((s, e) => s + e.totalSeats, 0);
  const availableSeats = events.reduce((s, e) => s + e.availableSeats, 0);

  return (
    <div className="org-dashboard">
      <h1>Organiser Dashboard</h1>
      <p className="org-subtitle">Manage your events & bookings</p>

      {/* STATS */}
      {stats && (
  <div className="chart-box">
    <h2>Bookings per Event</h2>

   <Bar
  data={{
    labels: stats.bookings.map(b => b.event.title),
    datasets: [
      {
        label: "Seats Booked",
        data: stats.bookings.map(b => b.seats),

        // 🎨 BAR COLOR
        backgroundColor: "#4f46e5",   // blue-violet
        borderColor: "#6366f1",

        // 📏 BAR SIZE
        barThickness: 36,             // thickness of each bar
        maxBarThickness: 42,

        // ✨ STYLE
        borderRadius: 10,             // rounded bars
      },
    ],
  }}
  options={{
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ddd",
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#aaa",
          font: { size: 12 },
        },
        grid: {
          color: "#222",
        },
      },
      y: {
        ticks: {
          color: "#aaa",
          font: { size: 12 },
        },
        grid: {
          color: "#222",
        },
      },
    },
  }}
/>

  </div>
)}

      <div className="org-stats">
        <div className="stat-box">
          <h3>Total Events</h3>
          <p>{events.length}</p>
        </div>
        <div className="stat-box">
          <h3>Total Seats</h3>
          <p>{totalSeats}</p>
        </div>
        <div className="stat-box">
          <h3>Seats Available</h3>
          <p>{availableSeats}</p>
        </div>
        <div className="stat-box">
  <h3>Total Revenue</h3>
  <p>₹{stats?.revenue || 0}</p>
</div>

      </div>

      {/* ACTION BAR */}
      <div className="org-actions-bar">
        <input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link to="/admin/add-event">
          <button className="add-btn">+ Add New Event</button>
        </Link>
      </div>

      {/* EDIT FORM */}
      {editEvent && (
        <div className="edit-form">
          <h3>Edit Event</h3>
          <input
            placeholder="Title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <input
            placeholder="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
          />
          <input
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditEvent(null)}>Cancel</button>
        </div>
      )}

      {/* EVENTS */}
      <div className="event-list">
        {filteredEvents.map((event) => (
          <div className="event-card" key={event._id}>
            <img src={`${API_URL}/${event.image}`} alt={event.title} />

            <div className="event-content">
              <h3>{event.title}</h3>
              <p>📍 {event.location}</p>
              <p>📅 {new Date(event.date).toDateString()}</p>
              <p>💺 {event.availableSeats}/{event.totalSeats}</p>

              <div className="event-actions">
                <button onClick={() => handleEdit(event)}>Edit</button>
                <button onClick={() => deleteEvent(event._id)}>Delete</button>
                <button className="add-btn" onClick={exportCSV}>
  ⬇ Export Bookings CSV
</button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganiserDashboard;
