# Kateryu 🍽️
### A Full Stack Catering Service Booking Platform

Kateryu is a role-based catering service booking web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It connects **customers** who need catering services with **caterers** who offer them — enabling seamless discovery, booking, and management of catering engagements through a single platform.

---

## 🚀 Features

### Customer
- Register and log in securely
- Browse and search caterer listings
- View caterer profiles, menus, and pricing
- Submit booking requests with event details (date, location, guest count)
- Track booking status in real time (Pending → Confirmed → Completed)
- Leave reviews and ratings after a completed booking

### Caterer
- Register and set up a business profile (bio, cuisine types, service area)
- Create, edit, and delete menu items
- View and manage incoming booking requests
- Accept or decline bookings
- View dashboard with booking history

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Context API, Axios, Bootstrap |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Dev Tools | VS Code, Postman, MongoDB Compass, Git |

---

## 📁 Project Structure

```
Kateryu/
├── client/                  # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable components (Navbar, PrivateRoute, etc.)
│   │   ├── context/         # AuthContext for global auth state
│   │   ├── pages/
│   │   │   ├── customer/    # Customer portal pages
│   │   │   └── caterer/     # Caterer portal pages
│   │   └── App.js
│   └── package.json
│
├── server/                  # Node.js + Express.js backend
│   ├── controllers/         # Route handler logic
│   ├── middleware/          # JWT auth + role guard middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   └── index.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Kateryu.git
cd Kateryu
```

### 2. Set up the Server
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend:
```bash
npm run dev
```

### 3. Set up the Client
```bash
cd ../client
npm install
npm start
```

The app will run at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## 🔐 Environment Variables

Create a `.env` file in the `server/` directory with the following keys:

| Key | Description |
|-----|-------------|
| `PORT` | Port for the Express server (default: 5000) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secret string used to sign JWT tokens |

> ⚠️ Never commit your `.env` file. It is already included in `.gitignore`.

---

## 📡 API Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Both | Register a new user |
| POST | `/api/auth/login` | Both | Login and receive JWT |
| GET | `/api/caterers` | Customer | Browse all caterers |
| GET | `/api/caterers/:id` | Customer | View caterer profile |
| PUT | `/api/caterers/:id` | Caterer | Update own profile |
| GET | `/api/menus/:catererId` | Both | View a caterer's menu |
| POST | `/api/menus/:catererId` | Caterer | Add a menu item |
| PUT | `/api/menus/:id` | Caterer | Update a menu item |
| DELETE | `/api/menus/:id` | Caterer | Delete a menu item |
| POST | `/api/bookings` | Customer | Submit a booking request |
| GET | `/api/bookings` | Both | Get own bookings |
| PATCH | `/api/bookings/:id/status` | Both | Update booking status |
| POST | `/api/reviews` | Customer | Submit a review |

---

## 🔄 Booking Status Flow

```
Customer submits request → PENDING
        ↓
Caterer accepts → CONFIRMED    or    Caterer declines → DECLINED
        ↓
Event completed → COMPLETED
        ↓
Customer leaves review
```

---

## 👤 Author

**Harshitha A Pai :)**  
B.E. Computer Science and Design Engineering  
Canara Engineering College  

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
