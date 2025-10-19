# Full-Stack JavaScript Developer Practical Test

This repository contains my submission for the **Full-Stack JavaScript Developer Practical Test**

It includes both backend and frontend implementations for the **mini admin panel** challenge — featuring user management, protobuf export, and cryptographic verification.

---

## Project Overview

The project consists of two apps:

| Folder | Description |
|---------|--------------|
| **backend/** | Node.js + Express typescript server with SQLite database, protobuf export, and RSA signing |
| **frontend/** | React (Vite + TypeScript) app with user CRUD UI, protobuf decoding, signature verification, and 7-day user stats visualization |

---

## Requirements Implemented

✅ **User Management (CRUD)**  
- Create, update, delete, and list users  
- Fields: `id`, `email`, `role`, `status`, `createdAt`  
- Stored in SQLite for persistence  

✅ **User Graph (7-Day Stats)**  
- Dashboard chart showing number of users created each day over the last 7 days.
- KPI cards showing Total User created past 7 days, the average/day, and the the peak day  

✅ **Protocol Buffers**  
- `.proto` schema for `User` defined in backend  
- `/users/export` endpoint returns serialized data  
- Frontend decodes via `protobuf.js` and displays verified users  

✅ **Crypto (SHA-384 + RSA)**  
- Backend: hashes email, signs with RSA private key  
- Frontend: verifies signature using public key before rendering user list  

✅ **UI/UX**  
- Modern UI built with **shadcn/ui**, and **Tailwind CSS**
- Components: user table, modal forms, stats cards, 7-day chart  
- Responsive layout and clear visual feedback

---

## Tech Stack

### Backend
- **Node.js + Express**
- **SQLite** for lightweight persistence
- **Protocol Buffers (protobufjs)**
- **Crypto** (`node:crypto`)
- TypeScript for strong typing

### Frontend
- **React (Vite + TypeScript)**
- **React Query**
- **React Router DOM**
- **shadcn/ui** & **Tailwind CSS**
- **protobufjs**
- Custom crypto + fetch helpers

---

## Architecture Overview

```
frontend/
 ├─ src/
 │   ├─ components/          # UI & reusable elements
 │   ├─ hooks/               # Data fetching hooks
 │   ├─ services/            # API and crypto services
 │   ├─ lib/                 # Utilities (fetcher, protobuf, crypto, logger)
 │   ├─ pages/               # Page components
 │   └─ routes.tsx           # Router definition
backend/
 ├─ src/
 │   ├─ modules/users/       # User CRUD & protobuf export
 │   ├─ utils/               # Validation & helpers
 │   └─ index.ts             # App entrypoint
 └─ scripts/seed-admin.ts    # Seed default admin user
```

---

## Setup & Run Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

---

### 2️⃣ Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

### 3️⃣ Run in development mode

#### Start backend
```bash
npm run dev
```

#### Start frontend
```bash
cd ../frontend
npm run dev
```

Frontend runs by default on **http://localhost:5173**  
Backend runs by default on **http://localhost:4000**

---

### 4️⃣ Build for production

```bash
# Backend
cd backend
npm run build

# Frontend
cd ../frontend
npm run build
```

---

## 🔐 Environment Variables

`.env` is required for backend, use example.env file or reference.  
All keys and configurations are generated automatically at runtime.  
(Set api port on frontend in constants/api.ts file)

---

## Example API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/users` | List all users |
| `POST` | `/users` | Create user |
| `PATCH` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |
| `GET` | `/users/export` | Export users in protobuf format |
| `GET` | `/publicKey` | Get RSA public key for signature verification |

---

## Developer Notes

- Validation handled via a simple utility (`validate.ts`) — no external libs.  
- Logging handled via a lightweight helper (`logger.ts`) disabled in production.  
- Charts built using **shadcn/ui + recharts**.  
- Fully modular, typed, and optimized for clarity.

---

## Author

**Patrick NAYITURIKI**  
Senior Software Developer
