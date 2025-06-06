# API Routes Documentation

This document describes all available API endpoints for the SpeakShip server.

---

## Base URL

    http://localhost:<PORT>/api/auth

---

### 1. POST `/api/auth/signup/user`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "name": "string (optional)",
    "phone": "string (optional, 10 digits)"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Registration successful.",
    "user": { /* user object */ }
  }
  ```
- **Error (400):**
  ```json
  { "error": "User already exists." }
  ```

---

### 2. POST `/api/auth/signup/driver`
- **Description:** Register a new driver.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "name": "string",
    "phone": "string (10 digits)"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Registration successful.",
    "driver": { /* driver object */ }
  }
  ```
- **Error (400):**
  ```json
  { "error": "Driver already exists." }
  ```

---

### 3. POST `/api/auth/login/user`
- **Description:** Login as a user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Login successful.",
    "user": { /* user object */ },
    "token": "jwt_token"
  }
  ```
- **Error (401):**
  ```json
  { "error": "Invalid username or password." }
  ```

---

### 4. POST `/api/auth/login/driver`
- **Description:** Login as a driver.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Login successful.",
    "driver": { /* driver object */ },
    "token": "jwt_token"
  }
  ```
- **Error (401):**
  ```json
  { "error": "Invalid username or password." }
  ```

---

### 5. POST `/api/auth/logout`
- **Description:** Logout (stateless, just a client-side token removal).
- **Request Body:** _None_
- **Response (200):**
  ```json
  { "message": "Logout successful." }
  ```

---

### 6. GET `/`
- **Description:** Health check or welcome route.
- **Response (200):**
  ```
  Hello, World!
  ```

---

## Notes
- All responses are in JSON unless otherwise specified.
- JWT authentication is used for protected routes (not shown here).
- Error messages are returned with appropriate HTTP status codes.

---

_Last updated: 2025-06-06_
