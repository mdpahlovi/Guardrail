# Guardrail - Online Examination Platform

## 🔗 Live URLs

- **Frontend:** [https://guardrail-azure.vercel.app](https://guardrail-azure.vercel.app)
- **Backend:** [https://guardrail-hfqf.onrender.com](https://guardrail-hfqf.onrender.com)

---

## 🎥 Video Demo

[Watch the demo recording](https://drive.google.com/file/d/14g-WxFzeKWPR0lD5nvYCqxVqm-cCo_-Z/view?usp=sharing)

---

## 📋 Project Overview

Guardrail is a comprehensive online examination platform designed to facilitate secure and efficient remote testing. It provides a robust environment for conducting examinations with advanced proctoring features to ensure academic integrity.

---

## 🛠️ Tech Stack

| Layer    | Technologies                                               |
| -------- | ---------------------------------------------------------- |
| Backend  | TypeScript, Node.js, Express, Prisma, PostgreSQL           |
| Frontend | TypeScript, React, TailwindCSS, Shadcn UI, TanStack Router |

---

## ⚙️ Installation Steps

> **Prerequisites:** Node.js 18+, PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/mdpahlovi/Guardrail.git
cd Guardrail
```

### 2. Setup the Backend

```bash
cd backend
npm install
# Create .env file (see Environment Variables section below)
npm run dev
```

### 3. Setup the Frontend

```bash
cd frontend
npm install
# Create .env file (see Environment Variables section below)
npm run dev
```

---

## 🔐 Environment Variables

### Backend

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL='your-postgresql-connection-string'

# CORS
CORS_ORIGIN=http://localhost:3000

# Auth
BETTER_AUTH_SECRET=C5y53rtYTuvSXir1agc76xmtWIKl5PGh
BETTER_AUTH_URL=http://localhost:3000
```

### Frontend

```env
VITE_APP_CLIENT=http://localhost:3000
VITE_APP_SERVER=http://localhost:5000
```

---

## 🔑 Test Credentials

| Role      | Email               | Password |
| --------- | ------------------- | -------- |
| Employer  | employer@gmail.com  | 12345678 |
| Candidate | candidate@gmail.com | 12345678 |

---

## 📁 Project Structure

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── features/
│   │   │   ├── attempt/
│   │   │   ├── auth/
│   │   │   └── test/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── app.ts
│   │   ├── route.ts
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
└── README.md
```

## ❓ Additional Questions

### 🔌 MCP (Model Context Protocol) Integration

I have not worked with MCP in a real project yet. But i have some basic idea working with 'Figma MCP' and 'Supabase MCP'.

### 🤖 AI Tools I Used for Development

These AI tools helped me build this project faster:

- **Claude (claude.ai)** — I mostly used claude to generate code and fix bugs. I also used it to generate dummy data for testing.

- **Antigravity** — I use it to write code.

### 📡 Offline Mode — How I Would Handle It

If internet connection lost during exam, then I can use zustand to manage state and persist data to local storage.
