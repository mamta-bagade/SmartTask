import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

    return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to SmartTask</h2>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="text" 
            placeholder="Username" 
            className="input-field"
            onChange={(e) => setForm({ ...form, username: e.target.value })} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field"
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
            required 
          />
          <button type="submit" className="btn-primary">Log In</button>
        </form>
        <p style={{ marginTop: "15px" }}>
  Don't have an account? <Link to="/register" style={{ color: "#007bff" }}>Sign Up</Link>
</p>
      </div>
    </div>
  );
}