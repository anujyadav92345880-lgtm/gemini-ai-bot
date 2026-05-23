# Setup Instructions

## Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- npm or yarn

## Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/data-recharge
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
```

### 4. Run backend
```bash
npm start
```

## Frontend Setup

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run frontend
```bash
npm start
```

## Database Setup

### MongoDB Connection
1. Use MongoDB Atlas for cloud: https://www.mongodb.com/cloud/atlas
2. Or install MongoDB locally
3. Update MONGODB_URI in .env

## API Documentation
See `API_DOCS.md` for all endpoints