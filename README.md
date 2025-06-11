# 🗂️ Task Management App

A simple project management tool to create, assign, and manage tasks collaboratively.

---

## 🚀 Live Demo

**Access the deployed app here:**  
👉 [Task Management App on Vercel](https://task-management-app-kappa-kohl.vercel.app/)

---

## 📝 Assumptions

- Users can assign tasks to others or themselves.
- Users **cannot** edit tasks they've assigned to others.
- Users **can** edit tasks they have assigned to themselves.
- Users **can** edit tasks that are assigned to them by others.
- Users **cannot** delete tasks assigned to them by others.
- Users **can** delete tasks they've created themselves.

---

## ✨ Features

- User registration and authentication
- Assign tasks to self or other users
- Edit own tasks or tasks assigned to you
- Role-based restrictions for editing/deleting tasks
- Responsive UI with React & Chakra UI
- RESTful API with Swagger documentation
- Sample data seeding for demo/testing
- Dockerized for easy local and cloud deployment

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (AWS RDS)
- **ORM:** Prisma
- **Frontend:** React, Redux, Chakra UI
- **Deployment:**
  - Backend: AWS EC2
  - Frontend: Vercel
- **Containerization:** Docker
- **CI/CD:** GitHub Actions

---

## 🔁 CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and deployment.

- **main branch:** Deploys to the development environment on push
- **master branch:** Deploys to production on push/merge

Monitor workflow runs in your GitHub repository’s **Actions** tab.

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) asz
- [PostgreSQL](https://www.postgresql.org/) (local or AWS RDS recommended)

---

## 🔑 Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<db>?schema=public
JWT_SECRET=your_jwt_secret
```

## Access API documentation (Swagger) (For Development)

```
 http://localhost:3001/api-docs
```

```bash
## Install dependencies
npm install

# Start in development mode
npm run start:dev

# Seed the database
npm run seed

# Run tests
npm run test

# Install dependencies
npm install

```
