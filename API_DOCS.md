# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication Endpoints

### 1. User Signup
**POST** `/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

### 2. User Login
**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "jwt_token_here",
  "user": { "id", "name", "email" }
}
```

## Recharge Endpoints

### 3. Get Recharge Plans
**GET** `/recharge/plans`

Response:
```json
[
  { "id": 1, "mb": 1000, "price": 99, "days": 28 },
  { "id": 2, "mb": 2000, "price": 199, "days": 28 }
]
```

### 4. Create Recharge
**POST** `/recharge/create`
**Headers:** `Authorization: Bearer {token}`
```json
{
  "planId": 1,
  "paymentId": "razorpay_payment_id"
}
```

### 5. Get User Data
**GET** `/recharge/user-data`
**Headers:** `Authorization: Bearer {token}`

Response:
```json
{
  "currentMB": 1000,
  "storedMB": 500,
  "expiryDate": "2026-06-23",
  "transactions": []
}
```

## Storage Endpoints

### 6. Store MB
**POST** `/storage/store`
**Headers:** `Authorization: Bearer {token}`
```json
{
  "mbAmount": 200
}
```

### 7. Use Stored MB
**POST** `/storage/use`
**Headers:** `Authorization: Bearer {token}`
```json
{
  "mbAmount": 100
}
```

### 8. Get Storage History
**GET** `/storage/history`
**Headers:** `Authorization: Bearer {token}`

## Admin Endpoints

### 9. Get All Users (Admin Only)
**GET** `/admin/users`
**Headers:** `Authorization: Bearer {admin_token}`

### 10. Get Dashboard Stats
**GET** `/admin/stats`
**Headers:** `Authorization: Bearer {admin_token}`