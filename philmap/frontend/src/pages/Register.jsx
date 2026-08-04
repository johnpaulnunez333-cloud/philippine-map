import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuth } from "../AuthContext";

const PIN_POSITIONS = [
  { top: "24%", left: "35%", delay: "0.4s" },
  { top: "40%", left: "62%", delay: "1.5s" },
  { top: "55%", left: "28%", delay: "0.9s" },
  { top: "65%", left: "72%", delay: "2.0s" },
  { top: "78%", left: "45%", delay: "0.1s" }
];

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.register(form);
      login(data.token, data.user);
      navigate("/map");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="pin-field">
          {PIN_POSITIONS.map((p, i) => (
            <span
              key={i}
              className="pin-dot"
              style={{ top: p.top, left: p.left, animationDelay: p.delay }}
            />
          ))}
        </div>
        <div className="brand">Philippine<br />Map</div>
        <div className="tagline">Mark your own islands</div>
      </div>
      <div className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Create account</h2>
          <p className="sub">Libre lang, ilang seconds lang ang setup.</p>
          {error && <div className="error-msg">{error}</div>}
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <p className="switch-link">
            May account ka na? <Link to="/login">Sign in dito</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
