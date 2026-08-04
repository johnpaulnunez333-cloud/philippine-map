import { useState } from "react";

const CATEGORIES = ["general", "beach", "mountain", "food", "heritage", "city"];

export default function Sidebar({ favorites, pendingPin, onSave, onCancelPending, onDelete, onSelect }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [province, setProvince] = useState("");
  const [category, setCategory] = useState("general");

  function handleSave(e) {
    e.preventDefault();
    if (!pendingPin || !name.trim()) return;
    onSave({
      name: name.trim(),
      description,
      province,
      category,
      latitude: pendingPin.lat,
      longitude: pendingPin.lng
    });
    setName("");
    setDescription("");
    setProvince("");
    setCategory("general");
  }

  return (
    <div className="sidebar">
      <h3>Mag-save ng spot</h3>

      {pendingPin ? (
        <form className="spot-form" onSubmit={handleSave}>
          <div className="hint">
            {pendingPin.lat.toFixed(5)}, {pendingPin.lng.toFixed(5)}
          </div>
          <input
            type="text"
            placeholder="Pangalan ng lugar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Probinsya"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <textarea
            placeholder="Maikling deskripsyon (optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn-primary" type="submit">Save Spot</button>
          <button
            type="button"
            className="logout-btn"
            style={{ width: "100%", marginTop: "0.5rem", color: "#5a6a63", borderColor: "#d8d0bd" }}
            onClick={onCancelPending}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="empty-state">
          Mag-click sa map para mag-drop ng pin at magsave ng bagong spot.
        </div>
      )}

      <h3>Saved spots ({favorites.length})</h3>
      {favorites.length === 0 && (
        <div className="empty-state">Wala ka pang saved spot.</div>
      )}
      {favorites.map((spot) => (
        <div className="spot-card" key={spot.id} onClick={() => onSelect(spot)}>
          <div className="name">{spot.name}</div>
          <div className="meta">
            {spot.category} {spot.province ? `· ${spot.province}` : ""}
          </div>
          {spot.description && <div className="desc">{spot.description}</div>}
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(spot.id);
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
