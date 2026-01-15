import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config"; // ✅ ADD THIS

const AdminEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    totalSeats: "",
    availableSeats: "",
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events/${id}`);
        const data = await res.json();

        setFormData({
          title: data.title || "",
          location: data.location || "",
          price: data.price || "",
          totalSeats: data.totalSeats || "",
          availableSeats: data.availableSeats || "",
          description: data.description || "",
          date: data.date ? data.date.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error loading event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Event updated successfully");
        navigate("/admin/events");
      } else {
        const err = await res.json();
        alert(err.message || "❌ Failed to update event");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Server error");
    }
  };

  if (loading) return <p>Loading event...</p>;

  return (
    <div className="admin-page">
      <h1>Edit Event</h1>

      <form onSubmit={handleUpdate} className="admin-form">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          min="0"
        />

        <input
          name="totalSeats"
          type="number"
          placeholder="Total Seats"
          value={formData.totalSeats}
          onChange={handleChange}
          min="1"
          required
        />

        <input
          name="availableSeats"
          type="number"
          placeholder="Available Seats"
          value={formData.availableSeats}
          onChange={handleChange}
          min="0"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default AdminEditEvent;
