import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { API_URL } from "../config";
const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registered successfully!");
        navigate("/login");
      } else {
        setMessage(data.message || "❌ Registration failed");
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="auth-container centered">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {message && <p className="msg">{message}</p>}
    </div>
  );
};

export default Register;
