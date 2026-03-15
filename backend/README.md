# Nevk Yachts

Full-stack yacht rental and listing platform for **Nevk Yachts**, a Turkish yacht charter company based in Fethiye. The project consists of a Node.js/Express REST API backend and a React SPA frontend.

---

## Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Backend](#backend)
  - [Project Structure](#backend-project-structure)
  - [Data Models](#data-models)
  - [API Reference](#api-reference)
  - [Authentication & Authorization](#authentication--authorization)
  - [Image Upload](#image-upload)
  - [Email Integration](#email-integration)
- [Frontend](#frontend)
  - [Project Structure](#frontend-project-structure)
  - [Pages & Routes](#pages--routes)
  - [Components](#components)
  - [Styling](#styling)
- [Admin Panel](#admin-panel)
  - [Project Structure](#admin-panel-project-structure)
  - [Pages & Routes](#admin-pages--routes)
  - [Components](#admin-components)
  - [Auth Flow](#auth-flow)
  - [API Integration](#api-integration)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)

---

## Overview

Nevk Yachts is a customer-facing yacht charter platform. Visitors can browse and filter the full yacht fleet, view each vessel's specifications and image gallery with an embedded harbor map, and send inquiries via a contact form. A separate admin panel allows authorized users to manage the yacht inventory.

**Backend** — Node.js/Express REST API that handles:
- Yacht listing management (CRUD) with filtering, sorting, and pagination
- Admin-only protected routes via JWT authentication and role-based access control
- Cloud image storage via Cloudinary (up to 5 images per yacht, auto-compressed)
- Contact form email delivery via Gmail SMTP

**Frontend** — React SPA that provides:
- Browsable, filterable yacht grid and detailed yacht pages
- Auto-rotating hero slider, responsive navigation, floating contact buttons
- Contact form with KVKK (Turkish data protection) consent flow
- Language selector structure (TR, EN, AR, DE, RU) ready for i18n

**Admin Panel** — React SPA for internal management:
- JWT-based login for admin accounts
- Yacht listing with thumbnail preview
- Create, edit, and delete yachts with image upload support
- Protected routes — all pages require a valid token

---

## Repository Structure

```
nevk-yachts-backend/     ← This repository (API server)
nevk-yachts-frontend/    ← Customer-facing React SPA
admin-panel-frontend/    ← Admin management panel
```

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 |
| Database | MongoDB (via Mongoose) |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Image Storage | Cloudinary + multer-storage-cloudinary |
| File Uploads | Multer v2 |
| Email | Nodemailer (Gmail SMTP) |
| Environment | dotenv |
| CORS | cors |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Routing | React Router 7 |
| HTTP Client | Axios |
| Icons | React Icons 5 |
| Image Gallery | react-image-gallery |
| Styling | Plain CSS (one file per component) |
| Linting | ESLint 9 |

### Admin Panel

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Routing | React Router 7 |
| HTTP Client | Axios (with auth interceptor) |
| Styling | Plain CSS + inline styles |
| Linting | ESLint 9 |

---

## Architecture

```
Browser (customer)          Browser (admin)
       │                          │
       ▼                          ▼
React SPA                  Admin Panel SPA
(nevk-yachts-frontend)     (admin-panel-frontend)
  localhost:5173              localhost:5174
       │                          │
       └──────────┬───────────────┘
                  │  Axios HTTP requests
                  ▼
     Express API (nevk-yachts-backend)
           localhost:5000
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
  Mongoose   Cloudinary   Nodemailer
 (MongoDB)  (images)    (Gmail SMTP)
```

### Backend request flow

```
HTTP Request
    │
    ▼
Express Router (routes/)
    │
    ▼
Middleware (middleware/)
  ├─ protect    → verifies JWT, attaches req.user
  └─ authorize  → checks role against allowed roles
    │
    ▼
Controller (controllers/)
  ├─ reads/writes via Mongoose models
  ├─ triggers image upload via utils/imageUploader.js
  └─ sends emails via Nodemailer
    │
    ▼
Model (models/)
  └─ Mongoose schemas → MongoDB Atlas
```

### Frontend request flow

```
Browser URL change → React Router → App layout (Navbar + Hero + Footer)
    │
    ▼
Page component — useEffect → axiosInstance.get/post('/api/...')
    │
    ▼
Component state (useState) → re-render
```

### Admin panel request flow

```
Browser URL change → React Router → PrivateRoute (checks localStorage token)
    │ (if no token → redirect to /login)
    ▼
Page component — useEffect → axiosInstance.get/post('/api/...')
    │  (Authorization: Bearer {token} added automatically by interceptor)
    ▼
Component state (useState) → re-render
```

---

## Backend

### Backend Project Structure

```
nevk-yachts-backend/
├── config/
│   └── cloudinary.js          # Cloudinary SDK initialisation
├── controllers/
│   ├── authController.js      # register / login
│   ├── yachtController.js     # full CRUD for yachts
│   └── contactController.js   # contact form → email
├── middleware/
│   └── authMiddleware.js      # JWT protect + role-based authorize
├── models/
│   ├── User.js                # User schema (bcrypt pre-save hook)
│   └── Yacht.js               # Yacht schema with specs sub-document
├── routes/
│   ├── authRoutes.js          # /api/auth
│   ├── yachtRoutes.js         # /api/yachts
│   └── contactRoutes.js       # /api/contact
├── utils/
│   └── imageUploader.js       # multer + Cloudinary storage adapter
├── server.js                  # Entry point — Express app, DB connection
├── package.json
└── .env                       # Environment variables (do not commit)
```

---

## Data Models

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, validated by regex |
| `password` | String | Required, min 6 chars, hidden by default (`select: false`) |
| `role` | String | Enum: `user` \| `admin`, default `user` |
| `createdAt` | Date | Auto-generated |

Passwords are automatically hashed with bcrypt (10 salt rounds) via a pre-save hook. The model exposes a `matchPassword(enteredPassword)` instance method used at login.

### Yacht

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, trimmed |
| `description` | String | Optional |
| `yachtId` | String | Internal reference ID |
| `yachtType` | String | Enum: `MOTOR YAT`, `TRAWLER`, `YELKENLİ TEKNE`, `GULET`, `KATAMARAN` |
| `buildYear` | Number | Year of construction |
| `liman` | String | Home port: `Göcek`, `Fethiye`, `Marmaris`, `Kaş`, `Bodrum` |
| `specs.length` | Number | Length in metres |
| `specs.width` | Number | Width in metres |
| `specs.cabins` | Number | Number of cabins |
| `specs.capacity` | Number | Max passenger capacity |
| `specs.bathrooms` | Number | Number of bathrooms |
| `specs.personnel` | Number | Crew size |
| `images` | [String] | Array of Cloudinary URLs |
| `hasAirConditioning` | Boolean | Default `false` |
| `hasGenerator` | Boolean | Default `false` |
| `createdAt` | Date | Auto-generated |

---

## API Reference

Base URL: `http://localhost:5000`

### Authentication

#### `POST /api/auth/register`
Register a new user (intended for admin account creation).

**Request body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "admin"
}
```

**Response:** `201 Created`
```json
{ "success": true, "message": "User registered successfully." }
```

---

#### `POST /api/auth/login`
Authenticate and receive a JWT.

**Request body:**
```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "<JWT — valid for 30 days>"
}
```

---

### Yachts

#### `GET /api/yachts`
Retrieve all yachts. Supports filtering, sorting, and pagination via query parameters.

**Query parameters:**

| Param | Example | Description |
|---|---|---|
| `yachtType` | `GULET` | Filter by yacht type |
| `liman` | `Fethiye` | Filter by home port |
| `buildYear[gte]` | `2010` | Comparison operators: `gt`, `gte`, `lt`, `lte` |
| `specs[cabins][gte]` | `4` | Filter on nested spec fields |
| `hasAirConditioning` | `true` | Boolean filter |
| `sort` | `-buildYear,name` | Sort fields (prefix `-` for descending) |
| `page` | `2` | Page number (default: `1`) |
| `limit` | `12` | Items per page (default: `10`) |

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 12,
  "total": 45,
  "page": 1,
  "pages": 4,
  "data": [ /* array of yacht objects */ ]
}
```

---

#### `GET /api/yachts/:id`
Retrieve a single yacht by its MongoDB ObjectId.

**Response:** `200 OK` — yacht object.

---

#### `POST /api/yachts`
Create a new yacht. **Requires admin authentication.**

**Headers:** `Authorization: Bearer <token>`

**Content-Type:** `multipart/form-data`

| Field | Type | Notes |
|---|---|---|
| `name` | text | Required |
| `yachtType` | text | One of the allowed enum values |
| `liman` | text | One of the allowed port values |
| `buildYear` | text | Year as number |
| `description` | text | Optional |
| `specs[cabins]` | text | Nested spec fields |
| `hasAirConditioning` | text | `"true"` or `"false"` |
| `images` | file | Up to 5 image files |

**Response:** `201 Created` — created yacht object.

---

#### `PUT /api/yachts/:id`
Update an existing yacht. **Requires admin authentication.**

**Headers:** `Authorization: Bearer <token>`

**Content-Type:** `multipart/form-data`

Send only the fields you want to update. New images are **appended** to the existing image array.

**Response:** `200 OK` — updated yacht object.

---

#### `DELETE /api/yachts/:id`
Delete a yacht. **Requires admin authentication.**

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{ "success": true, "message": "Yacht deleted." }
```

---

### Contact

#### `POST /api/contact`
Submit the contact form. Sends an HTML-formatted email to the configured recipient.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+90 555 000 00 00",
  "gsm": "+90 555 111 11 11",
  "message": "I am interested in the Gulet for July."
}
```

`name`, `email`, and `message` are required.

**Response:** `200 OK`
```json
{ "success": true, "message": "Email sent successfully." }
```

---

## Authentication & Authorization

All write operations on the `/api/yachts` resource require a valid JWT sent in the `Authorization` header using the Bearer scheme:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Two middleware functions are applied in order:

1. **`protect`** — Extracts and verifies the token. Attaches the decoded user object to `req.user`. Returns `401 Unauthorized` if the token is missing, malformed, or expired.
2. **`authorize(...roles)`** — Checks that `req.user.role` is included in the allowed roles list. Returns `403 Forbidden` if not.

Tokens are issued at login and expire after **30 days**.

---

## Image Upload

Images are handled by **Multer** using the `multer-storage-cloudinary` adapter. The pipeline is:

1. Client sends `multipart/form-data` with up to **5 image files** (JPEG, PNG, JPG).
2. Multer streams each file directly to Cloudinary without writing to disk.
3. Cloudinary applies a transformation: resize to max **1200×800 px**, auto quality compression.
4. Cloudinary returns a public URL for each image.
5. The controller stores these URLs in the `images` array of the Yacht document.

Configuration lives in `config/cloudinary.js` (credentials from environment variables) and `utils/imageUploader.js` (multer + storage adapter setup).

---

## Email Integration

Contact form submissions trigger an email sent via **Nodemailer** using Gmail SMTP with an app-specific password. The email is HTML-formatted and includes the sender's name, phone numbers, email address, and message body.

The email is sent from the configured Gmail account to the recipient address defined in `EMAIL_RECEIVER` environment variable.

---

---

## Frontend

### Frontend Project Structure

```
nevk-yachts-frontend/
├── public/
│   ├── logo.png
│   └── backgrounds/
│       ├── slider-1.jpg … slider-9.jpg   # Hero slider images
│       └── sabit-arkaplan.jpg            # Static hero background
├── src/
│   ├── api/
│   │   └── axiosConfig.js               # Axios base URL config
│   ├── components/
│   │   ├── Filter.jsx / .css            # Yacht list filter form
│   │   ├── FloatingButtons.jsx / .css   # Fixed phone/WhatsApp/Instagram/Maps buttons
│   │   ├── Footer.jsx / .css            # Site footer
│   │   ├── Hero.jsx / .css              # Homepage slider / page header
│   │   ├── Navbar.jsx / .css            # Top navigation bar
│   │   ├── SpecsGrid.jsx / .css         # Yacht specification grid
│   │   ├── TopBar.jsx / .css            # Language selector bar
│   │   └── YachtCard.jsx               # Yacht listing card
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── YachtsListPage.jsx / .css
│   │   ├── YachtDetailPage.jsx / .css
│   │   ├── ContactPage.jsx / .css
│   │   ├── HakkimizdaPage.jsx
│   │   ├── RotaPage.jsx
│   │   ├── FotoGaleriPage.jsx
│   │   └── KvkkPage.jsx
│   ├── App.jsx / .css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

### Pages & Routes

All routes are children of the `App` layout component (shared Navbar, Hero, Footer).

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | Landing page with full-screen hero slider |
| `/yachts` | `YachtsListPage` | Filterable yacht grid |
| `/yachts/:id` | `YachtDetailPage` | Image gallery, specs, harbor map |
| `/contact` | `ContactPage` | Contact form + embedded Google Map |
| `/hakkimizda` | `HakkimizdaPage` | About the company |
| `/rota` | `RotaPage` | Charter routes and itineraries |
| `/foto-galeri` | `FotoGaleriPage` | Photo gallery |
| `/kvkk` | `KvkkPage` | Turkish KVKK data protection policy |

**Hero behavior:** On `/` renders a full-screen (100vh) auto-rotating slider (9 images, 4-second interval). On all other routes renders a 40vh static header with the page title.

**Navbar behavior:** Transparent and absolutely positioned over the hero on the homepage. Solid background on all other pages.

### Components

| Component | Description |
|---|---|
| `Navbar` | Responsive nav with hamburger menu (breakpoint: 960px) |
| `TopBar` | Language selector bar (TR, EN, AR, DE, RU) — UI placeholder, i18n not yet wired |
| `Hero` | Full-screen slider on homepage; 40vh static header on other pages |
| `Filter` | Stateless filter form — yacht type dropdown + minimum cabins input |
| `YachtCard` | Yacht summary card linking to `/yachts/:id` |
| `SpecsGrid` | Responsive CSS Grid of yacht specifications, conditionally rendered fields |
| `FloatingButtons` | Fixed right-edge buttons: phone, WhatsApp, Instagram, Google Maps |
| `Footer` | Three-column layout (logo, contact info, copyright), collapses on mobile |

### Styling

Plain CSS — one `.css` file per component/page, no preprocessor or CSS-in-JS.

**Color palette:**

| Color | Value | Usage |
|---|---|---|
| Primary blue | `#3f759f` | Section backgrounds |
| Dark blue | `#3a5785` | Darker section variants |
| Link blue | `#007bff` | Buttons and CTAs |
| WhatsApp green | `#25D366` | WhatsApp floating button |
| Maps blue | `#4285F4` | Google Maps button |

**Responsive breakpoints:** 768px (hero/form), 820px (footer), 960px (navbar hamburger).

---

## Admin Panel

### Admin Panel Project Structure

```
admin-panel-frontend/
├── public/
│   └── logo.png
├── src/
│   ├── api/
│   │   └── axiosConfig.js     # Axios instance with auth interceptor
│   ├── components/
│   │   ├── YachtForm.jsx      # Create/edit yacht form
│   │   └── YachtForm.css      # Form styles
│   ├── pages/
│   │   ├── LoginPage.jsx      # Admin login
│   │   ├── DashboardPage.jsx  # Yacht list + actions
│   │   └── YachtFormPage.jsx  # Create/edit page wrapper
│   ├── App.jsx                # Router + PrivateRoute guard
│   ├── index.css              # Global reset and base styles
│   └── main.jsx               # Entry point
├── index.html
├── vite.config.js
└── package.json
```

### Admin Pages & Routes

| Path | Component | Auth | Description |
|---|---|---|---|
| `/login` | `LoginPage` | Public | Email + password login form |
| `/dashboard` | `DashboardPage` | Protected | Yacht table with edit/delete actions |
| `/yacht/new` | `YachtFormPage` | Protected | Create a new yacht |
| `/yacht/edit/:id` | `YachtFormPage` | Protected | Edit an existing yacht |
| `*` | — | — | Redirects to `/dashboard` |

Route protection is handled by a `PrivateRoute` component in `App.jsx` that reads `authToken` from `localStorage`. Unauthenticated users are redirected to `/login`.

### Admin Components

**`LoginPage`**
- Email and password fields with loading state
- On success: stores JWT in `localStorage` as `authToken`, navigates to `/dashboard`
- Displays API error messages inline

**`DashboardPage`**
- Fetches and displays all yachts in a table (thumbnail, name, type, year, actions)
- **Add** button → `/yacht/new`
- **Edit** button → `/yacht/edit/:id`
- **Delete** button → confirms then calls `DELETE /api/yachts/:id`
- **Logout** → clears `authToken` from localStorage, redirects to `/login`

**`YachtFormPage`**
- Detects create vs. edit mode from URL params
- Fetches existing yacht data in edit mode and passes it to `YachtForm`
- Submits `multipart/form-data` via `POST /yachts` or `PUT /yachts/:id`
- Navigates back to `/dashboard` on success

**`YachtForm`**
- Full yacht creation/editing form with fields for all model properties
- Handles: name, yacht ID, type, year, port, all spec fields, description, air conditioning, generator, images
- Collects spec fields into a nested object before submitting
- Supports multiple image file selection

### Auth Flow

```
1. Admin visits /dashboard
2. PrivateRoute checks localStorage for authToken
3. If missing → redirect to /login
4. Admin submits credentials → POST /api/auth/login
5. Backend returns JWT → stored in localStorage as authToken
6. All subsequent Axios requests automatically include:
   Authorization: Bearer {authToken}   (added by request interceptor)
7. Logout → localStorage.removeItem('authToken') → redirect to /login
```

### API Integration

The Axios instance in `src/api/axiosConfig.js` has a **request interceptor** that automatically attaches the `Authorization: Bearer {token}` header to every request.

**Endpoints used by the admin panel:**

| Method | Endpoint | Page | Notes |
|---|---|---|---|
| `POST` | `/auth/login` | LoginPage | No auth header |
| `GET` | `/yachts` | DashboardPage | Lists all yachts |
| `GET` | `/yachts/:id` | YachtFormPage | Pre-fills edit form |
| `POST` | `/yachts` | YachtFormPage | `multipart/form-data` |
| `PUT` | `/yachts/:id` | YachtFormPage | `multipart/form-data` |
| `DELETE` | `/yachts/:id` | DashboardPage | Confirmed before sending |

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Cloudinary account
- A Gmail account with an app-specific password enabled

### 1. Backend

```bash
cd nevk-yachts-backend

npm install

# Create and fill in environment file
cp .env.example .env

node server.js
```

The API will be available at `http://localhost:5000`.

### 2. Frontend (customer)

```bash
cd nevk-yachts-frontend

npm install
npm run dev
```

Available at `http://localhost:5173`.

### 3. Admin Panel

```bash
cd admin-panel-frontend

npm install
npm run dev
```

Available at `http://localhost:5174` (or the next free port Vite assigns).

> The backend must be running before starting either frontend application.

---

## Environment Variables

Create a `.env` file inside `nevk-yachts-backend/` with the following variables:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_RECEIVER=recipient@yourdomain.com
```

> **Security note:** Never commit `.env` to version control. Add it to `.gitignore`.

Both frontend applications have the backend URL hardcoded. For production, replace with environment variables:

**`nevk-yachts-frontend/src/api/axiosConfig.js`** and **`admin-panel-frontend/src/api/axiosConfig.js`**:
```js
baseURL: import.meta.env.VITE_API_URL,
```

```env
# .env in each frontend directory
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Running the Project

### Backend

```bash
# Production
node server.js

# Development (auto-restart on file change)
npx nodemon server.js
```

### Frontend & Admin Panel

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Compile and bundle for production into `/dist` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Production deployment

Deploy each `/dist` folder to any static hosting provider (Vercel, Netlify, Nginx, etc.). Configure the server to redirect all routes to `index.html` to support client-side routing.
