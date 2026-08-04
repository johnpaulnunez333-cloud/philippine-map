import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { favoritesApi } from "../api";

const PH_CENTER = [12.8797, 121.7740];
const PH_BOUNDS = [[4.5, 114.0], [21.5, 127.5]];

const CATEGORY_COLORS = {
  general: "#E4572E",
  beach: "#14746F",
  mountain: "#6B4226",
  food: "#D4A017",
  heritage: "#8E44AD",
  city: "#2C3E50"
};

function makeIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16]
  });
}

export default function MapPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);
  const pendingMarker = useRef(null);

  const [favorites, setFavorites] = useState([]);
  const [pendingPin, setPendingPin] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: PH_CENTER,
      zoom: 6,
      maxBounds: PH_BOUNDS,
      maxBoundsViscosity: 0.6,
      minZoom: 5
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18
    }).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);

    map.on("click", (e) => {
      setPendingPin({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstance.current = map;

    loadFavorites();

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    if (pendingMarker.current) {
      mapInstance.current.removeLayer(pendingMarker.current);
      pendingMarker.current = null;
    }

    if (pendingPin) {
      pendingMarker.current = L.marker([pendingPin.lat, pendingPin.lng], {
        icon: makeIcon("#0A2942")
      }).addTo(mapInstance.current);
    }
  }, [pendingPin]);

  useEffect(() => {
    if (!markersLayer.current) return;
    markersLayer.current.clearLayers();

    favorites.forEach((spot) => {
      const marker = L.marker([spot.latitude, spot.longitude], {
        icon: makeIcon(CATEGORY_COLORS[spot.category] || CATEGORY_COLORS.general)
      });
      marker.bindPopup(
        `<strong>${escapeHtml(spot.name)}</strong><br/>${escapeHtml(spot.province || "")}`
      );
      marker.addTo(markersLayer.current);
    });
  }, [favorites]);

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadFavorites() {
    try {
      const data = await favoritesApi.list();
      setFavorites(data.favorites);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveSpot(payload) {
    try {
      await favoritesApi.create(payload);
      setPendingPin(null);
      await loadFavorites();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await favoritesApi.remove(id);
      await loadFavorites();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSelect(spot) {
    if (mapInstance.current) {
      mapInstance.current.flyTo([spot.latitude, spot.longitude], 12);
    }
  }

  return (
    <div className="app-shell">
      <Topbar />
      <div className="main-layout">
        <Sidebar
          favorites={favorites}
          pendingPin={pendingPin}
          onSave={handleSaveSpot}
          onCancelPending={() => setPendingPin(null)}
          onDelete={handleDelete}
          onSelect={handleSelect}
        />
        <div className="map-container" ref={mapRef} />
      </div>
      {error && <div style={{ position: "absolute", bottom: 16, left: 16 }} className="error-msg">{error}</div>}
    </div>
  );
}
