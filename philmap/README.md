# Philippine Map

Google Maps-inspired na website, focused sa Pilipinas lang. May login/register, at pwedeng mag-save ng favorite spots per user (click sa map → drop pin → save).

## Stack

- **Frontend:** React (Vite), React Router, vanilla Leaflet.js para sa map, plain CSS (design tokens sa `src/index.css`)
- **Backend:** Flask (API only), Flask-SQLAlchemy, Flask-JWT-Extended (JWT auth), Flask-Bcrypt, SQLite (default) — pwede palitan ng PostgreSQL sa Railway

## Paano patakbuhin (local / Termux)

### 1. Backend

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Tatakbo yan sa `http://localhost:5000`. Gagawa siya ng `philmap.db` (SQLite) automatically sa unang run.

### 2. Frontend

```
cd frontend
npm install
cp .env.example .env
npm run dev
```

Tatakbo yan sa `http://localhost:5173`. Sisiguraduhin lang na tugma yung `VITE_API_URL` sa `.env` sa URL ng backend mo.

## Flow ng app

1. `/register` o `/login` — kailangan mag-account bago makapasok sa map
2. `/map` — protected route, dito lang makikita kung naka-login
3. Click kahit saan sa map → lalabas yung form sa sidebar → save → mase-save sa database, tied sa user account
4. Click sa saved spot sa sidebar → mag-fly-to yung map papunta doon
5. Logout button sa topbar

## Deploy sa Railway

Backend: i-deploy as normal Flask service (gunicorn `app:app`), set env vars na `SECRET_KEY`, `JWT_SECRET_KEY`, at `DATABASE_URL` (kung PostgreSQL na).

Frontend: `npm run build` tapos i-deploy yung `dist/` folder, o gawing static site. Siguraduhin na naka-set yung `VITE_API_URL` papunta sa deployed backend URL bago mag-build.

## Susunod na pwedeng idagdag

- Search bar / geocoding para sa specific address
- Province boundary overlay (GeoJSON ng Pilipinas)
- Photo upload per spot
- Public/shared spots (hindi lang private per user)
