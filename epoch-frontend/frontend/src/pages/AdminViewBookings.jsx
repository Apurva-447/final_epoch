import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config"; // ✅ ADD THIS

const AdminViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "admin" && decoded.exp * 1000 > Date.now()) {
          fetchBookings();
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

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  return (
    <div className="admin-page">
      <h1>View Bookings</h1>

      <table className="bookings-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>User</th>
            <th>Seats</th>
            <th>Total Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.event?.title || "N/A"}</td>
              <td>{booking.user?.name || "N/A"}</td>
              <td>{booking.seats}</td>
              <td>₹{booking.totalPrice}</td>
              <td>
                {new Date(booking.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminViewBookings;
