# 🎯 SmartTask - Full Stack Team Management System

SmartTask is a full-stack web application designed to help teams manage projects and tasks efficiently. It features Role-Based Access Control (RBAC), JWT Authentication, and an interactive Kanban board.

## 🚀 Live Demo


## ✨ Features
1.  Authentication: Secure Register & Login using JWT and BCrypt.
2.  Role-Based Access Control (RBAC):
    *   **Manager:** Can create/delete projects, add team members, and assign tasks.
    *   **Member:** Can view assigned projects and update task statuses.
3.  Kanban Board: Interactive UI to move tasks between "To Do", "Doing", and "Done".
4.  Security: Stateless authentication, environment variables for secrets, and CORS configuration.

## 💻 Tech Stack
Frontend: React 18, Vite, React Router, Axios, CSS3
Backend: Java 17, Spring Boot, Spring Security, JWT, Spring Data JPA
Database: MySQL (Railway Cloud)

## ⚙️ How to Run Locally
1. Clone the repository.
2. Setup the database and add environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`).
3. Run Backend: `cd smarttask-backend` -> `./mvnw spring-boot:run`
4. Run Frontend: `cd smarttask-frontend` -> `npm install` -> `npm run dev`

## 👨‍💻 Author
