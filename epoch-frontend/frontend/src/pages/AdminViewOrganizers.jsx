import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./AdminViewOrganizers.css";
import { API_URL } from "../config"; // ✅ ADD THIS

const AdminViewOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "admin" && decoded.exp * 1000 > Date.now()) {
          fetchOrganizers();
        } else {
          navigate("/admin/login");
        }
      } catch (error) {
        navigate("/admin/login");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchOrganizers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      // Filter for admins (organizers)
      const orgs = data.filter((user) => user.role === "admin");
      setOrganizers(orgs);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    }
  };

  const handleAddOrganizer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const organizerData = Object.fromEntries(formData.entries());

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
        setShowForm(false);
        fetchOrganizers();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert("Failed to add organizer");
    }
  };

  return (
    <div className="admin-page">
      <h1>View Organizers</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Organizer"}
      </button>

      {showForm && (
        <form onSubmit={handleAddOrganizer}>
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <label>
            Password:
            <input type="password" name="password" required />
          </label>
          <button type="submit">Add Organizer</button>
        </form>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((org) => (
            <tr key={org._id}>
              <td>{org.name}</td>
              <td>{org.email}</td>
              <td>{new Date(org.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminViewOrganizers;