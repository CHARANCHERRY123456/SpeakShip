# Feedback API Routes

## Base Path
`/api/feedback`

---

## POST `/`
- **Description:** Submit feedback (review) for a delivery.
- **Auth:** customer
- **Expected Input (JSON body):**
  ```json
  {
    "deliveryId": "<deliveryId>",
    "rating": 1-5,
    "comment": "string",
    "driverId": "<driverId>"
  }
  ```
- **Expected Output:**
  ```json
  {
    "_id": "<feedbackId>",
    "deliveryId": "<deliveryId>",
    "customerId": "<customerId>",
    "driverId": "<driverId>",
    "rating": 1-5,
    "comment": "string",
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
  }
  ```

---

## GET `/`
- **Description:** Get all feedback (admin only).
- **Auth:** admin
- **Expected Output:**
  ```json
  [ { ...feedbackObject }, ... ]
  ```

---

## GET `/delivery/:deliveryId`
- **Description:** Get all feedback for a specific delivery.
- **Auth:** customer, driver
- **Expected Output:**
  ```json
  [ { ...feedbackObject }, ... ]
  ```

---

## GET `/delivery/:deliveryId/customer/:customerId`
- **Description:** Get feedback for a delivery by a specific customer.
- **Auth:** customer, admin
- **Expected Output:**
  ```json
  { ...feedbackObject }
  ```

---

## GET `/delivery/:deliveryId/me`
- **Description:** Get the current user's feedback for a delivery.
- **Auth:** customer
- **Expected Output:**
  ```json
  { ...feedbackObject }
  ```

---

## GET `/driver/:driverId`
- **Description:** Get all feedback for a specific driver.
- **Auth:** driver, admin
- **Expected Output:**
  ```json
  [ { ...feedbackObject }, ... ]
  ```

---

**Note:**
- `feedbackObject` fields: `_id`, `deliveryId`, `customerId`, `driverId`, `rating`, `comment`, `createdAt`, `updatedAt`.
- All endpoints return errors in the form `{ "error": "message" }` on failure.
