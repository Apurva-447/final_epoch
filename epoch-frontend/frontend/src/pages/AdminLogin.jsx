import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config"; // ✅ ADD THIS

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful!");
        navigate("/");
      } else {
        setMessage(data.message || "❌ Login failed");
      }
    } catch {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="auth-container">
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
        <Link to="/admin">Admin Login</Link>
      </p>
    </div>
  );
};

export default Login;
