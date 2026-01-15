import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../index.css";
import { API_URL } from "../config"; // ✅ ADD THIS
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ events: 0, bookings: 0, users: 0 });
  const [chartData, setChartData] = useState([]);

  const [date, setDate] = useState(new Date());
  const [eventDates, setEventDates] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/admin/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.role === "admin" && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
        fetchData();
      } else {
        navigate("/admin/login");
      }
    } catch {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/events`),
        fetch(`${API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`${API_URL}/api/auth/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const events = await eventsRes.json();
      const bookings = await bookingsRes.json();
      const users = await usersRes.json();

      // store all events
      setAllEvents(events);

      // stats
      setStats({
        events: events.length,
        bookings: bookings.length,
        users: users.length,
      });

      // line graph data
      const eventCounts = {};
      events.forEach((event) => {
        const month = new Date(event.date).toLocaleString("default", {
          month: "short",
        });
        eventCounts[month] = (eventCounts[month] || 0) + 1;
      });

      setChartData(
        Object.keys(eventCounts).map((month) => ({
          month,
          events: eventCounts[month],
        }))
      );

      // calendar highlight dates
      const eventDateList = events.map((event) => {
        const d = new Date(event.date);
        d.setHours(0, 0, 0, 0);
        return d.toDateString();
      });

      setEventDates(eventDateList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // when clicking a date
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);

    const selectedDay = selectedDate.toDateString();

    const filtered = allEvents.filter((event) => {
      const d = new Date(event.date);
      d.setHours(0, 0, 0, 0);
      return d.toDateString() === selectedDay;
    });

    setDayEvents(filtered);
  };

  const handleAddOrganizer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const organizerData = Object.fromEntries(formData.entries());

    if (!organizerData.name || !organizerData.email || !organizerData.password) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/add-organizer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(organizerData),
        }
      );

      if (response.ok) {
        alert("Organizer added successfully");
        e.target.reset();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to add organizer");
      }
    } catch (error) {
      alert("An error occurred while adding the organizer");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      <div className="dashboard-grid">
        {/* SIDEBAR */}
        <div className="sidebar">
          <h3>Options</h3>
          <Link to="/admin/add-event">
            <button>Add New Event</button>
          </Link>
          <Link to="/admin/events">
            <button>Manage Events</button>
          </Link>
          <Link to="/admin/bookings">
            <button>View Bookings</button>
          </Link>
          <Link to="/admin/users">
            <button>View Users</button>
          </Link>
          <Link to="/admin/organizers">
            <button>View Organizers</button>
          </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
          <div className="chart-section">
            <h3>Events Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="#ff4d6d"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="stats-section">
            <div className="stat-card">
              <h4>Total Events</h4>
              <p>{stats.events}</p>
            </div>
            <div className="stat-card">
              <h4>Total Bookings</h4>
              <p>{stats.bookings}</p>
            </div>
            <div className="stat-card">
              <h4>Total Users</h4>
              <p>{stats.users}</p>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="calendar-section">
          <h3>Calendar</h3>

          <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={({ date, view }) =>
              view === "month" &&
              eventDates.includes(date.toDateString())
                ? "event-highlight"
                : null
            }
          />

          <p style={{ marginTop: "10px" }}>
            Selected Date: {date.toDateString()}
          </p>

          {/* EVENTS ON SELECTED DATE */}
          <div className="calendar-events">
            <h4>Events on this day</h4>

            {dayEvents.length === 0 ? (
              <p>No events on this day</p>
            ) : (
              dayEvents.map((event) => (
                <div key={event._id} className="calendar-event-card">
                  <strong>{event.title}</strong>
                  <p>📍 {event.location}</p>
                  <p>💰 ₹{event.price}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
