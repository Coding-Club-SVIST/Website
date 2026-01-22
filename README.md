#  Coder Ride

A full-stack ecosystem designed to manage community memberships, showcase collaborative projects, and automate administrative workflows. Built with a focus on transparency, scalability, and seamless GitHub integration.

---

## ✨ Key Features

* **GitHub OAuth Integration:** Secure and instant login for developers.
* **Project Showcase:** A centralized gallery of member-built projects with tech-stack tagging.
* **Automated Onboarding:** Streamlined member application process with Admin approval loops.
* **Discord Sync:** Real-time notifications via webhooks for new signups and project submissions.
* **Role Management:** Granular permissions (Admin, Lead, Member) with custom role support.
* **Type-Safe Backend:** Robust API built with TypeScript, Prisma ORM, and PostgreSQL.

---

## 🛠 Tech Stack

| Component    | Technology                          |
| :----------- | :---------------------------------- |
| **Frontend** | Next.js 14 (App Router), Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript        |
| **Database** | PostgreSQL, Prisma ORM             |
| **DevOps** | Docker, Docker Compose              |
| **Services** | Resend (Email), Discord Webhooks    |

---

## 🚦 Getting Started (Local Development)

The easiest way to get this running is using **Docker**. This sets up the database, backend, and frontend containers automatically.

### 1. Prerequisites
* Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* GitHub OAuth App credentials (to enable login)

### 2. Launch the App
Run the following command in the root directory:

```Bash
docker compose up --build
```

-Frontend: http://localhost:3000

-Backend API: http://localhost:3001

### 🏗 System Architecture
The application follows a containerized architecture to ensure the environment remains consistent from local development to production.

### 🌐 Live Demo
Experience the live version of the platform here: 👉 Live Project Link (Note: Use GitHub login to explore the member dashboard features.)

### 📂 Project Structure
Plaintext
├── backend/            # Express API & Prisma Schema
│   ├── prisma/         # Database migrations & models
│   ├── src/            # TypeScript source code
│   └── Dockerfile      # Backend container config
├── frontend/           # Next.js Application
│   ├── src/            # Components & Pages
│   └── Dockerfile      # Frontend container config
└── docker-compose.yml  # Orchestration for the whole stack

### 🤝 Contributing
1.Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3 .Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.Push to the Branch (`git push origin feature/AmazingFeature`)
5.Open a Pull Request
