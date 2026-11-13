import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try different username.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input type="text" placeholder="Username" className="input-field" onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input type="email" placeholder="Email" className="input-field" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" className="input-field" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select 
            className="input-field"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <option value="MEMBER">Register as: Member</option>
            <option value="MANAGER">Register as: Manager</option>
          </select>
          <button type="submit" className="btn-primary">Sign Up</button>
        </form>
        <p style={{ marginTop: "15px" }}>
          Already have an account? <Link to="/login" style={{ color: "#007bff" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}