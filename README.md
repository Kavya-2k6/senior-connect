# 🎓 Senior Connect

> A full-stack mentorship platform connecting students with senior industry professionals for 1-on-1 guidance, mock interviews, and resume reviews.

---

## 🌟 Tech Stack

- **Frontend:** React + Vite, Axios, React Router, Modern CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) + bcryptjs password hashing

---

## 🚀 Key Features

- 🔐 **Role-based Authentication:** Register and login as a **Student** or **Senior Mentor** with secure JWT and salted password hashing.
- 🔍 **Mentor Discovery & Multi-Filter Search:** Filter mentors by domain (*Software Engineering, AI/ML, Cloud, Data Science*), skill tags, or keyword.
- 📅 **Session Booking Engine:** Schedule 1-on-1 mentorship sessions with topic, date, time, and auto-generated meeting links.
- 📋 **Session Management & Notes:** Track upcoming, completed, and cancelled sessions. Add and edit live session agenda/questions.
- ⭐ **Rating & Review System:** Leave ratings (1-5 stars) and reviews for mentors with automatic score recalculation.
- 📊 **Dynamic Dashboard:** Real-time metrics overview (Total Sessions, Upcoming, Completed, Mentor Ratings).
- 👤 **Profile & Availability Controls:** Mentors can update bio, skills, company details, and toggle real-time booking availability.

---

## 📁 Project Structure

```text
senior-connect/
├── backend/
│   ├── models/         # User.js, Session.js, Review.js
│   ├── routes/         # auth.js, mentors.js, sessions.js, reviews.js
│   ├── middleware/     # authMiddleware.js
│   ├── seed.js         # Sample database seeder
│   ├── .env.example
│   └── server.js       # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Navbar.jsx, MentorCard.jsx, SessionCard.jsx
│   │   ├── pages/      # LoginPage, RegisterPage, DashboardPage, MentorsPage, SessionsPage, ProfilePage
│   │   ├── context/    # AuthContext.jsx
│   │   ├── api.js      # Axios instance with auth interceptor
│   │   ├── App.jsx     # Router & Protected routes
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── .gitignore
├── start.bat           # 1-click startup script for Windows
└── README.md
```

---

## 🛠️ Local Setup & Installation

### 1. Backend Setup
```bash
cd backend
npm install
# Configure your MongoDB URI in backend/.env (see backend/.env.example)
npm run seed     # Seeds demo accounts
npm run dev      # Runs backend on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Runs frontend on http://localhost:5173
```

---

## 🔑 Demo Credentials (Seeded)
- **Mentor (Google):** `sarah@google.com` | `password123`
- **Student:** `alex@student.edu` | `password123`

---

## 📄 License
This project is licensed under the MIT License.
