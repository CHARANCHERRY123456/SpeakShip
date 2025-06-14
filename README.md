# SpeakShip

A modern, full-stack delivery management platform for customers and drivers. SpeakShip enables users to create, track, and manage delivery requests with real-time status updates, authentication, and photo uploads. Built with a React frontend and a Node.js/Express/MongoDB backend.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **User Authentication**: Register/login as Customer, Driver, or Admin (JWT-based, Google OAuth supported)
- **Role-based Access**: Separate flows for customers and drivers
- **Delivery Requests**: Customers can create delivery requests with optional photo upload
- **Driver Dashboard**: Drivers can view, accept, and update delivery requests
- **Status Tracking**: Real-time delivery status updates (Pending, Accepted, In-Transit, Delivered)
- **Profile Management**: View and update user profile
- **RESTful API**: Well-documented endpoints for all major actions
- **Modern UI**: Responsive, accessible React interface with beautiful design

---

## Architecture
- **Frontend**: React (Vite), Context API for auth, modular feature-based structure
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth, REST API
- **File Uploads**: Multer for handling delivery item photos
- **Authentication**: JWT for all roles, Google OAuth for easy sign-in

---

## Screenshots
> _Add screenshots of the main UI pages here (Home, Auth, Delivery Form, Driver Dashboard, etc.)_

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/SpeakShip.git
cd SpeakShip
```

### 2. Setup Environment Variables
Create `.env` files in both `server/` and `client/` as needed. See [Environment Variables](#environment-variables).

### 3. Install Dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 4. Start the Development Servers
- **Backend**:
  ```bash
  cd server
  npm run dev
  # or: npm start
  ```
- **Frontend**:
  ```bash
  cd client
  npm run dev
  ```

- The frontend will run on `http://localhost:5173` (default Vite port)
- The backend will run on `http://localhost:3000` (default Express port)

---

## Environment Variables

### Server (`server/.env`)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/speakship
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### Client (`client/.env`)
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## API Overview

### Authentication
- `POST /api/auth/signup/customer` — Register as customer
- `POST /api/auth/signup/driver` — Register as driver
- `POST /api/auth/login/customer` — Login as customer
- `POST /api/auth/login/driver` — Login as driver
- `POST /api/auth/login/admin` — Login as admin
- `POST /api/auth/logout` — Logout (stateless)
- `GET  /api/auth/google` — Google OAuth
- `GET  /api/auth/me` — Get current user info

### Delivery
- `POST   /api/delivery/create` — Create delivery request (customer)
- `GET    /api/delivery/pending` — List pending requests (driver)
- `POST   /api/delivery/accept/:id` — Accept request (driver)
- `PATCH  /api/delivery/status/:id` — Update delivery status (driver)
- `GET    /api/delivery/my` — List deliveries for driver
- `GET    /api/delivery/customer` — List deliveries for customer

> See `server/src/features/delivery/ROUTES.md` for full API details and request/response examples.

---

## Project Structure

```
SpeakShip/
├── client/         # React frontend (Vite)
│   ├── src/
│   │   ├── features/         # Feature modules (auth, delivery, etc.)
│   │   ├── components/       # Shared UI components
│   │   ├── contexts/         # React Contexts (Auth, etc.)
│   │   ├── api/              # Axios config and API calls
│   │   └── ...
│   └── public/
├── server/         # Node.js/Express backend
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/         # Auth logic, schemas, controllers
│   │   │   └── delivery/     # Delivery logic, schemas, controllers
│   │   ├── middleware/       # Auth, logger, upload
│   │   ├── config/           # DB, env config
│   │   └── ...
│   └── uploads/              # Uploaded delivery item photos
└── README.md
```

---

## Contributing
1. Fork the repo and create your branch
2. Make your changes (with clear commits)
3. Submit a pull request

---

## License

This project is licensed under the MIT License.

---

## Credits
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer)
- [Lucide Icons](https://lucide.dev/)

---

> _For questions or support, open an issue or contact the maintainer._
