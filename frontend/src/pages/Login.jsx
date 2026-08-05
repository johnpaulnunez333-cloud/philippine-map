import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuth } from "../AuthContext";

const PIN_POSITIONS = [
  { top: "20%", left: "30%", delay: "0s" },
  { top: "35%", left: "55%", delay: "1.2s" },
  { top: "50%", left: "22%", delay: "0.6s" },
  { top: "60%", left: "68%", delay: "1.8s" },
  { top: "72%", left: "40%", delay: "0.3s" },
  { top: "28%", left: "75%", delay: "2.1s" }
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.login({ username, password });
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
        <div className="tagline">7,641 islands. One account.</div>
      </div>
      <div className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="sub">Mag-login para makita ang saved mong mga spot.</p>
          {error && <div className="error-msg">{error}</div>}
          <div className="field">
            <label>Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="switch-link">
            Wala ka pang account? <Link to="/register">Register dito</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
