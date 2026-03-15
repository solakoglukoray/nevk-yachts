# Nevk Yachts

Full-stack yacht rental and listing platform for **Nevk Yachts**, a Turkish yacht charter company based in Fethiye.

## Repository Structure

```
nevk-yachts/
├── backend/      ← Node.js / Express REST API
├── frontend/     ← Customer-facing React SPA
└── admin-panel/  ← Admin management panel (React SPA)
```

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster
- Cloudinary account
- Gmail account with an app-specific password

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in all values
node server.js         # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

### 3. Admin Panel
```bash
cd admin-panel
npm install
npm run dev            # runs on http://localhost:5174
```

> Start the backend first — both frontend apps fetch data from it.

## Tech Stack

| | Technology |
|---|---|
| **Backend** | Node.js, Express v5, MongoDB (Mongoose), JWT, Cloudinary, Nodemailer |
| **Frontend** | React 19, Vite 7, React Router 7, Axios, React Icons |
| **Admin Panel** | React 19, Vite 7, React Router 7, Axios |

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>
JWT_SECRET=your_secret
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_RECEIVER=recipient@domain.com
```

See each sub-project's README for more details.
