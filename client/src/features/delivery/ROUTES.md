# Delivery API Endpoints

All endpoints are prefixed with `/api/delivery`.

---

## 1. Create Delivery Request

- **Endpoint:** `POST /api/delivery/create`
- **Auth:** Bearer Token (customer)
- **Content-Type:** `multipart/form-data`
- **Description:** Create a new delivery request. Optionally upload a photo.
- **Request Body Example:**

```
name: "John Doe"
email: "john@example.com"
phone: "9876543210"
pickupAddress: "123 Main St, City"
dropoffAddress: "456 Market St, City"
note: "Handle with care"
photo: (file upload, optional)
```

- **Response Example (201):**
```json
{
  "_id": "664f1c...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "pickupAddress": "123 Main St, City",
  "dropoffAddress": "456 Market St, City",
  "note": "Handle with care",
  "photoUrl": "/uploads/photo.jpg",
  "status": "Pending",
  "customer": "664f1b...",
  "createdAt": "2025-06-10T10:00:00.000Z",
  "updatedAt": "2025-06-10T10:00:00.000Z"
}
```
- **Error (400):**
```json
{ "error": "Missing required fields." }
```

---

## 2. List Pending Delivery Requests (for Drivers)

- **Endpoint:** `GET /api/delivery/pending`
- **Auth:** Bearer Token (driver)
- **Description:** Get all pending delivery requests available for drivers.
- **Response Example (200):**
```json
[
  {
    "_id": "664f1c...",
    "name": "John Doe",
    "pickupAddress": "123 Main St, City",
    "dropoffAddress": "456 Market St, City",
    "note": "Handle with care",
    "photoUrl": "/uploads/photo.jpg",
    "status": "Pending"
  },
  ...
]
```
- **Error (401):**
```json
{ "error": "Unauthorized" }
```

---

## 3. Accept Delivery Request (Driver)

- **Endpoint:** `POST /api/delivery/accept/:id`
- **Auth:** Bearer Token (driver)
- **Description:** Accept a pending delivery request by ID.
- **Request Params:**
  - `id`: Delivery request ID
- **Response Example (200):**
```json
{
  "_id": "664f1c...",
  "status": "Accepted",
  "driver": "664f1d..."
}
```
- **Error (400):**
```json
{ "error": "Request already accepted or not found." }
```

---

## 4. List My Deliveries (Driver)

- **Endpoint:** `GET /api/delivery/my`
- **Auth:** Bearer Token (driver)
- **Description:** Get all deliveries assigned to the authenticated driver.
- **Response Example (200):**
```json
[
  {
    "_id": "664f1c...",
    "name": "John Doe",
    "pickupAddress": "123 Main St, City",
    "dropoffAddress": "456 Market St, City",
    "status": "Accepted",
    "photoUrl": "/uploads/photo.jpg"
  },
  ...
]
```

---

## 5. List My Deliveries (Customer)

- **Endpoint:** `GET /api/delivery/customer`
- **Auth:** Bearer Token (customer)
- **Description:** Get all deliveries created by the authenticated customer.
- **Response Example (200):**
```json
[
  {
    "_id": "664f1c...",
    "name": "John Doe",
    "pickupAddress": "123 Main St, City",
    "dropoffAddress": "456 Market St, City",
    "status": "Pending",
    "photoUrl": "/uploads/photo.jpg"
  },
  ...
]
```

---

## Notes
- All responses are in JSON.
- All endpoints require a valid JWT Bearer token in the `Authorization` header.
- Error messages are returned with appropriate HTTP status codes.
- Ensure correct routing