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
- **Query Parameters:**
  - `page` (integer, optional): Page number (default: 1)
  - `limit` (integer, optional): Number of results per page (default: 10)
  - `search` (string, optional): Search by name, packageName, address, email, phone, or ID
  - `status` (string, optional): Filter by delivery status
- **Response Example (200):**
```json
{
  "results": [
    {
      "_id": "664f1c...",
      "name": "John Doe",
      "packageName": "Books",
      "pickupAddress": "123 Main St, City",
      "dropoffAddress": "456 Market St, City",
      "note": "Handle with care",
      "photoUrl": "/uploads/photo.jpg",
      "status": "Pending"
    },
    ...
  ],
  "total": 42
}
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
- **Query Parameters:**
  - `page` (integer, optional): Page number (default: 1)
  - `limit` (integer, optional): Number of results per page (default: 10)
  - `search` (string, optional): Search by name, packageName, address, email, phone, or ID
  - `status` (string, optional): Filter by delivery status
- **Response Example (200):**
```json
{
  "results": [
    {
      "_id": "664f1c...",
      "name": "John Doe",
      "packageName": "Laptop",
      "pickupAddress": "123 Main St, City",
      "dropoffAddress": "456 Market St, City",
      "status": "Accepted",
      "photoUrl": "/uploads/photo.jpg"
    },
    ...
  ],
  "total": 17
}
```

---

## 5. List My Deliveries (Customer)

- **Endpoint:** `GET /api/delivery/customer`
- **Auth:** Bearer Token (customer)
- **Description:** Get all deliveries created by the authenticated customer.
- **Query Parameters:**
  - `page` (integer, optional): Page number (default: 1)
  - `limit` (integer, optional): Number of results per page (default: 10)
  - `search` (string, optional): Search by name, packageName, address, email, phone, or ID
  - `status` (string, optional): Filter by delivery status
- **Response Example (200):**
```json
{
  "results": [
    {
      "_id": "664f1c...",
      "name": "John Doe",
      "packageName": "Shoes",
      "pickupAddress": "123 Main St, City",
      "dropoffAddress": "456 Market St, City",
      "status": "Pending",
      "photoUrl": "/uploads/photo.jpg"
    },
    ...
  ],
  "total": 8
}
```

---

## Notes
- All responses are in JSON.
- All endpoints require a valid JWT Bearer token in the `Authorization` header.
- Error messages are returned with appropriate HTTP status codes.
- Ensure correct routing