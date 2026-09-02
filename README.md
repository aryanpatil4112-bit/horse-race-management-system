# Horse Race Management System (HRMS) — Apex Racing Club

A full-stack, academic-grade web application built for Horse Racing Clubs to manage horses, jockeys, race scheduling, participant registrations, official finish results, leaderboards, and user access levels.

> **IMPORTANT DISCLAIMER**: This application is strictly an **Event/Club Race Management System**. It contains **ZERO betting, gambling, wagering, odds calculation, or monetary transaction features**.

---

## 🌐 Live Deployment URLs

- **Frontend**: [https://horse-race-management-system.vercel.app](https://horse-race-management-system.vercel.app)
- **Backend REST API**: [https://horse-race-management-system.onrender.com/api](https://horse-race-management-system.onrender.com/api)

---

## 🌟 Key Features

1. **Production-Grade Authentication**:
   - **Public Registration (`/signup`)**: Anyone can sign up using their full name, email (including Gmail), and a password (minimum 8 characters). Public signups are **strictly assigned `VIEWER` status by the backend** to prevent privilege escalation.
   - **Clean Sign In (`/login`)**: Unfilled, clean inputs with show/hide password toggles.
   - **Password Hashing**: Securely hashed with **BCryptPasswordEncoder**.
   - **JWT Tokens**: Stateless authentication with JSON Web Tokens.
2. **Role-Based Access Control (RBAC)**:
   - **ADMIN**: Unrestricted access to CRUD management for horses, jockeys, races, registrations, results, and user account privilege escalation.
   - **RACE_OFFICIAL**: Schedule races, view registered participants, and record official finish results & timings.
   - **VIEWER**: Read-only access to public club dashboard, race schedules, horse profiles, results, and leaderboards.
3. **Horse Directory (CRUD)**: Manage thoroughbred profiles, age, breed, gender, and status (`ACTIVE` / `INACTIVE`).
4. **Jockey Directory (CRUD)**: Manage jockey profiles, age, riding experience years, and status.
5. **Race Event Management (CRUD)**: Schedule races with date, time, location, distance, and status transitions (`SCHEDULED` → `ONGOING` → `COMPLETED`).
6. **Participant Registration**: Associate horses and jockeys with scheduled races while enforcing integrity constraints (prevent duplicate horse entry per race, verify active statuses).
7. **Official Result Entry**: Record finish positions (1st, 2nd, 3rd, etc.) and finish times. Automatically updates race status to `COMPLETED`.
8. **Ranked Leaderboard**: Computes horse rankings dynamically derived from official 1st, 2nd, and 3rd place finishes.
9. **User Privilege Management**: Admins can view registered users and dynamically elevate or modify system roles (`VIEWER`, `RACE_OFFICIAL`, `ADMIN`).

---

## 🔑 Pre-Seeded Demo Accounts

The system includes pre-seeded demo accounts for testing all system role levels:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@horserace.com` | `admin123` | Full System & User Privilege Management |
| **RACE OFFICIAL** | `official@horserace.com` | `official123` | Race Scheduling & Result Entry |
| **VIEWER** | `viewer@horserace.com` | `viewer123` | Read-Only Dashboard & Leaderboard |

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), HTML5, JavaScript, Vanilla CSS Design Tokens, Axios, Lucide React |
| **Backend Framework** | Java 17+, Spring Boot 3, Spring Web, Spring Security |
| **Persistence / ORM** | Spring Data JPA, Hibernate ORM |
| **Database** | MySQL 8.0+ / H2 MySQL-compatibility mode |
| **Security & Auth** | BCrypt Password Hashing, JWT (JSON Web Tokens) |
| **Build Tools** | Maven, Vite, Docker |

---

## 🎯 Security & Anti-Privilege Escalation Architectural Guarantee

- **Backend Enforcement**: Public registration requests via `POST /api/auth/register` automatically strip and ignore any client-supplied `role` parameter. The backend hard-codes `Role.VIEWER` for all public registrations.
- **Role Assignment**: Promotion to `RACE_OFFICIAL` or `ADMIN` can only be performed by an authenticated `ADMIN` user via the `/users` management endpoint.
- **Unique Emails**: Enforced at both the JPA/database level and service validation layer.

---

## 📜 License & Academic Attribution
Created as an academic capstone project demonstrating modern full-stack web application development with React, Java Spring Boot, and MySQL.
