import { useState } from "react";
import { API_URL } from "../config"; // ✅ ADD THIS

const AdminAddEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    totalSeats: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("❌ Please select an image");
      return;
    }

    setLoading(true);
    setMessage("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("image", image);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Event created successfully!");
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          price: "",
          totalSeats: "",
        });
        setImage(null);
        document.querySelector('input[type="file"]').value = "";
      } else {
        setMessage(`❌ Error: ${result.message || "Failed to create event"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("❌ Network error. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2>Add New Event</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
          min="0"
        />

        <input
          type="number"
          name="totalSeats"
          placeholder="Total Seats"
          value={formData.totalSeats}
          onChange={handleChange}
          min="1"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {message && <p className="msg">{message}</p>}
    </div>
  );
};

export default AdminAddEvent;
