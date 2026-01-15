import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { API_URL } from "../config"; // ✅ ADD THIS

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
 // Include role in the request
      });
      const data = await res.json();

      if (res.ok) {
  setToken(data.token);
  localStorage.setItem("token", data.token);

  const userRole = data.user.role;

  setMessage("✅ Login successful!");

  if (userRole === "admin") {
    navigate("/admin/dashboard");
  } else if (userRole === "organiser") {
    navigate("/organiser/dashboard");
  } else {
    navigate("/");
  }
}
      else {
        setMessage(data.message || "❌ Login failed");
      }       
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="login-page">
  <div className="auth-container glass">

      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
       
        <button type="submit">Login</button>
      </form>
      {message && <p className="msg">{message}</p>}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  </div>
  );
};

export default Login;
