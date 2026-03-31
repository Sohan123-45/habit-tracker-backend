# Habit Tracker Backend API 🚀

A robust and scalable Node.js/Express backend for a Habit Tracking application. This API provides secure authentication, habit management, streak tracking, image uploads, and administrative controls.

---

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication with password hashing using `bcryptjs`.
- **📅 Habit Management**: Full CRUD operations for habits, including custom colors and streak tracking.
- **🖼️ Image Logging**: Log habits with image uploads supported by **ImageKit**.
- **🔥 Dynamic Streaks**: Automatic calculation of current and longest streaks based on user logs.
- **🛡️ RBAC (Role-Based Access Control)**: Admin and Owner roles with specialized permissions.
- **🚫 Admin Dashboard**: Ban/Unban users and manage administrative privileges.
- **⚡ Performance & Security**: Built-in rate limiting and security middlewares.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.x)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Cookie-parser
- **File Storage**: ImageKit.io
- **Middleware**: Multer, CORS, Express-rate-limit
- **Security**: Bcryptjs

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- An [ImageKit](https://imagekit.io/) account for image uploads.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd habit-tracker-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
PORT=your_port_number
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key (if applicable)
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint (if applicable)
```

### 4. Run the application

**Development Mode (with Nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

---

## 📡 API Documentation

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | Login user and set JWT cookie | No |
| `POST` | `/logout` | Logout user and clear cookies | Yes |

### 2. Habit Management (`/api/habits`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/gethabits` | Get all habits for the logged-in user | Yes |
| `POST` | `/` | Create a new habit | Yes |
| `PATCH` | `/:id/color` | Update habit color (HEX) | Yes |
| `POST` | `/:id/log` | Log a habit (supports single file upload) | Yes |
| `PATCH` | `/nameChange/:habitId` | Change habit name | Yes |
| `DELETE` | `/:habitId` | Delete a habit and its logs | Yes |
| `GET` | `/:habitId/posts` | Get all logs (posts) for a specific habit | Yes |
| `PATCH` | `/titleChange/:postId` | Update the title of a specific log | Yes |
| `DELETE` | `/post/:postId` | Delete a specific log entry | Yes |

### 3. Administrative Operations (`/api/admin`)

| Method | Endpoint | Description | Permitted Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/all-users` | Get a list of all registered users | `admin`, `owner` |
| `PATCH` | `/ban/:userId` | Ban a user from the platform | `admin`, `owner` |
| `PATCH` | `/unban/:userId` | Unban a restricted user | `admin`, `owner` |
| `PATCH` | `/make-admin/:userId`| Promote a user to Admin role | `owner` |
| `PATCH` | `/remove-admin/:userId`| Demote an Admin to User role | `owner` |
| `GET` | `/all-data/:userId` | Get comprehensive data for any user | `owner` |

---

## 📂 Project Structure

```text
src/
├── controllers/    # Route controllers (Request handling logic)
├── db/             # Database connection setup
├── middlewares/    # Custom middlewares (Auth, Roles, Validation)
├── models/         # Mongoose schemas (User, Habit, HabitPost)
├── routes/         # Express route definitions
├── services/       # External services integration (ImageKit)
└── utils/          # Helper functions (Streak calculation)
```

---

## 🛡️ Security Features

- **Rate Limiting**: Protects authentication routes from brute-force attacks.
- **Input Validation**: Ensures correct data formats for registration and updates.
- **Secure Sessions**: Uses HTTP-only cookies for token storage.
- **Banned User Protection**: Middlewares prevent banned users from accessing the API.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `package.json` for more information.