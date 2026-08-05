import { useAuth } from "../AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="brand">Philippine Map</div>
      <div className="user-area">
        <span>{user ? user.username : ""}</span>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
