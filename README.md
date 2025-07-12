 # SpeakShip 🚀

## Why SpeakShip is a Game-Changer

SpeakShip is a cutting-edge, full-stack delivery management platform engineered for speed, reliability, and seamless user experience. Our platform empowers customers and drivers with:

- **Lightning-Fast Real-Time Tracking:** Instantly monitor every delivery with live status updates and GPS precision.
- **Ultra-Secure Authentication:** Multi-role login (Customer, Driver, Admin) with JWT and Google OAuth for maximum security and convenience.
- **Photo-Enabled Delivery Requests:** Attach images to every order for transparency and trust.
- **Dynamic Driver Dashboard:** Drivers can view, accept, and manage deliveries in a single, intuitive interface.
- **Role-Based Access Control:** Tailored experiences for customers, drivers, and admins—no clutter, just what you need.
- **Modern, Responsive UI:** Beautiful, mobile-first design powered by React and Vite for a flawless experience on any device.
- **RESTful, Well-Documented API:** Effortless integration and rapid development for any use case.
- **Profile Management:** Update and personalize your profile, including secure image uploads.
- **Robust Feedback System:** Customers can rate and review drivers, building a trusted delivery network.
- **AI-Ready Architecture:** Built to integrate with advanced analytics, smart routing, and more.

---

## Backend API Overview

### Auth (`/api/auth`)
- `POST /send-otp` — Send OTP for email verification (customer/driver)
- `POST /verify-otp` — Verify OTP for email (customer/driver)
- `POST /signup/customer` — Register as customer (after OTP verification)
- `POST /signup/driver` — Register as driver (after OTP verification)
- `POST /login/customer` — Login as customer
- `POST /login/driver` — Login as driver
- `POST /login/admin` — Login as admin
- `POST /logout` — Logout (stateless)
- `GET /google` — Google OAuth login
- `GET /google/callback` — Google OAuth callback
- `GET /me` — Get current user info (from JWT)

### Delivery (`/api/delivery`)
- `POST /create` — Create delivery request (customer, with photo upload)
- `GET /pending` — List pending delivery requests (driver)
- `POST /accept/:id` — Accept a delivery request (driver)
- `GET /my` — List deliveries assigned to the driver
- `GET /customer` — List deliveries created by the customer
- `PATCH /status/:id` — Update delivery status (driver/customer)
- `POST /verify-otp/:id` — Verify delivery OTP (customer/driver)
- `GET /:id` — Get delivery by ID (customer/driver)

### Feedback (`/api/feedback`)
- `POST /` — Submit feedback for a delivery (customer)
- `GET /` — Get all feedback (admin)
- `GET /delivery/:deliveryId` — Get all feedback for a delivery (customer/driver)
- `GET /delivery/:deliveryId/customer/:customerId` — Get feedback for a delivery by a specific customer (customer/admin)
- `GET /delivery/:deliveryId/me` — Get current user's feedback for a delivery (customer)
- `GET /driver/:driverId` — Get all feedback for a driver (driver/admin)
- `GET /user/:userId` — Get all feedback given by a user (customer/driver/admin)

### Profile (`/api/profile`)
- `GET /` — Get current user's profile (customer/driver/admin)
- `PUT /` — Update current user's profile
- `POST /upload-image` — Upload profile image
- `PUT /edit-image` — Edit/replace profile image
- `DELETE /remove-image` — Remove profile image

### Price (`/api/price`)
- `POST /gemini` — Get price estimate using Gemini AI

### Upload (`/api/upload`)
- `POST /profile` — Upload profile picture
- `POST /order` — Upload order photo

---

## Scalable, Maintainable Architecture

SpeakShip is built with a **feature-based folder structure** for both frontend and backend, ensuring maximum scalability, maintainability, and developer velocity. Each feature (auth, delivery, feedback, profile, etc.) is modularized, encapsulating all logic, routes, controllers, and services. This enables:
- Effortless onboarding for new developers
- Rapid feature expansion
- Clean, organized codebase
- Easy testing and refactoring

We rigorously apply **SOLID** and **DRY** principles, resulting in:
- Highly reusable and testable code
- Minimal duplication
- Clear separation of concerns
- Future-proof extensibility

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

## Future Developments

SpeakShip is engineered for innovation. Upcoming features include:
- **AI-Powered Delivery Optimization:** Smart routing, ETA prediction, and dynamic pricing
- **Voice Assistant Integration:** Hands-free delivery management
- **Live Map Tracking:** Real-time geolocation and delivery visualization
- **In-App Chat & Notifications:** Instant communication for all users
- **Advanced Analytics Dashboard:** Actionable insights for business owners and drivers
- **Multi-Language Support:** Global-ready with i18n
- **Modular Plugin System:** Extend SpeakShip with custom modules

Stay tuned for the next evolution in delivery management!

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
