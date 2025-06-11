# Task Management App

## Introduction

The Task Management App is a simple project management tool designed to help users create, assign, and manage tasks.

### Assumptions

- Users can assign tasks to other users.
- Users can assign tasks to themselves.
- Users **cannot** edit tasks they have assigned to others.
- Users **can** edit tasks they have assigned to themselves.
- Users **can** edit tasks that are assigned to them by others.
- Users **cannot** delete tasks that have been assigned to them by others.
- Users **can** delete tasks they have created themselves.

---

## Working Deployed App

Access the live application here:  
👉 [https://task-management-app-kappa-kohl.vercel.app/](https://task-management-app-kappa-kohl.vercel.app/)

---

## Features

- User registration and authentication
- Assign tasks to self or other users
- Edit own tasks or tasks assigned to you
- Role-based restrictions on editing/deleting tasks
- Responsive UI built with React and Chakra UI
- RESTful API documented with Swagger
- Seed sample data for quick demo/testing
- Dockerized for easy deployment

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (AWS RDS)
- **ORM:** Prisma
- **Frontend:** React, Redux, Chakra UI
- **Deployment:**
  - Backend: AWS EC2
  - Frontend: Vercel
- **Containerization:** Docker
- **CI/CD:** GitHub Actions workflow

---

## CI/CD with GitHub Actions

This project uses **GitHub Actions** for automated build, test, and deployment.

- **main branch:** Deploys to development environment on push.
- **master branch:** Deploys to production environment on push/merge.

You can monitor workflow runs in the **Actions** tab of the GitHub repository.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for containerization)
- [PostgreSQL](https://www.postgresql.org/) (local or remote, AWS RDS recommended)

---

## 🔑 Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<db>?schema=public
JWT_SECRET=your_jwt_secret
```

## Access API documentation (Swagger) (For Development)

[http://localhost:3001/api-docs](http://localhost:3001/api-docs)

## Run Backend Locally

```bash
## Install dependencies
npm install

# Start in development mode
npm run start:dev

# Seed the database
npm run seed

# Run tests
npm run test

```

## Run Frontend Locally

```bash
## Install dependencies
npm install

# Start in development mode
npm run start
```

## Running Frontend and Backend via Docker

You can start both the frontend and backend services using Docker Compose:

```
docker compose up
```
