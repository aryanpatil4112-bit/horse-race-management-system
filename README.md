# Horse Race Management System (HRMS)

A full-stack, academic-grade web application built for Horse Racing Clubs to manage horses, jockeys, race scheduling, participant registrations, official finish results, leaderboards, and user access levels.

> **IMPORTANT DISCLAIMER**: This application is strictly an **Event/Club Race Management System**. It contains **ZERO betting, gambling, wagering, odds calculation, or monetary transaction features**.

---

## 🌟 Key Features

1. **Role-Based Access Control**:
   - **ADMIN**: Unrestricted access to CRUD management for horses, jockeys, races, registrations, results, and user accounts.
   - **RACE_OFFICIAL**: Schedule races, view registered participants, and record official finish results & timings.
   - **VIEWER**: Read-only access to public club dashboard, race schedules, horse profiles, results, and leaderboards.
2. **Horse Directory (CRUD)**: Manage thoroughbred profiles, age, breed, gender, and status (`ACTIVE` / `INACTIVE`).
3. **Jockey Directory (CRUD)**: Manage jockey profiles, age, riding experience years, and status.
4. **Race Event Management (CRUD)**: Schedule races with date, time, location, distance, and status transitions (`SCHEDULED` → `ONGOING` → `COMPLETED`).
5. **Participant Registration**: Associate horses and jockeys with scheduled races while enforcing integrity constraints (prevent duplicate horse entry per race, verify active statuses).
6. **Official Result Entry**: Record finish positions (1st, 2nd, 3rd, etc.) and finish times. Automatically updates race status to `COMPLETED`.
7. **Ranked Leaderboard**: Computes horse rankings dynamically derived from official 1st, 2nd, and 3rd place finishes.
8. **Real-time Dashboard**: Displays real-time database-derived metrics, upcoming race events, and recent podium finishers.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), HTML5, JavaScript, Vanilla CSS Design Tokens, Axios, Lucide React |
| **Backend Framework** | Java 17+, Spring Boot 3, Spring Web, Spring Security |
| **Persistence / ORM** | Spring Data JPA, Hibernate ORM |
| **Database** | MySQL 8.0+ (relational, 1NF/2NF/3NF normalized) |
| **Security & Auth** | BCrypt Password Hashing, JWT (JSON Web Tokens) |
| **Build Tools** | Maven, Vite |

---

## 📂 Project Architecture & Directory Structure

```
horse-race-management-system/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/horserace/
│   │   ├── config/              # DataLoader (Automatic DB seeder)
│   │   ├── controller/          # REST API Controllers
│   │   ├── dto/                 # Data Transfer Objects & ApiResponse
│   │   ├── entity/              # JPA Domain Entities (User, Horse, Race, etc.)
│   │   ├── exception/           # GlobalExceptionHandler & Custom Exceptions
│   │   ├── repository/         # Spring Data JPA Repositories with JPQL JOINs
│   │   ├── security/           # JWT Security Config, Auth Filter & UserDetails
│   │   └── service/            # Business Logic Services
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/          # Sidebar, Header, StatCard, DataTable, Modal, ConfirmDialog
│       ├── context/             # AuthContext provider
│       ├── pages/               # Login, Dashboard, Horses, Jockeys, Races, Registrations, Results, Leaderboard, Users
│       └── services/            # Axios API helper
├── database/
│   ├── schema.sql              # Relational DDL tables & indexes
│   └── seed.sql                # Demo sample dataset
├── docs/
│   ├── waterfall-model.md       # SDLC Waterfall Phase Breakdown
│   ├── database-design.md      # ER Diagram, Normalization & SQL JOINs
│   └── api-documentation.md    # REST API Endpoint Catalog
├── .env.example
└── README.md
```

---

## 🔑 Demo Login Accounts

All demo passwords are pre-configured to `admin123`, `official123`, or `viewer123`.

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@horserace.com` | `admin123` | Full System & User Management |
| **RACE OFFICIAL** | `official@horserace.com` | `official123` | Race Scheduling & Result Entry |
| **VIEWER** | `viewer@horserace.com` | `viewer123` | Read-Only Dashboard & Leaderboard |

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- **Java Development Kit (JDK 17 or higher)**
- **Node.js (v18 or higher) & npm**
- **MySQL Server (v8.0 or higher)**

---

### Step 1: Database Setup (MySQL)

1. Open your MySQL client (MySQL Workbench, Command Line, or DBeaver).
2. Execute the DDL schema file:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. (Optional) Execute the seed data script:
   ```bash
   mysql -u root -p < database/seed.sql
   ```
> *Note*: The Spring Boot application also features an automatic `DataLoader` component that will auto-seed demo users, horses, jockeys, races, and results if the database is empty upon launch!

---

### Step 2: Backend Setup (Spring Boot)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure database credentials in `src/main/resources/application.properties` (or set environment variables `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/horserace_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
3. Compile and launch the Spring Boot server:
   Using installed Maven:
   ```bash
   mvn spring-boot:run
   ```
   Or compiling directly:
   ```bash
   "C:\Program Files\Java\jdk-17\bin\java.exe" -jar target/horse-race-backend-1.0.0.jar
   ```
4. The REST API server will start on `http://localhost:8080`.

---

### Step 3: Frontend Setup (React + Vite)

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🎯 Capgemini / Capstone Requirement Mapping

| Capgemini Requirement | Implementation Details |
| :--- | :--- |
| **CRUD Operations** | Complete CREATE, READ, UPDATE, DELETE implemented across Horses, Jockeys, Races, Registrations, and Results. |
| **Spring Boot Backend** | Layered architecture (`Controller` → `Service` → `Repository` → `Entity`) built with Spring Boot 3. |
| **React Frontend** | Built with React 18, React Router v6, Axios, and Vanilla CSS design tokens with dark/gold glassmorphism. |
| **JPA / Hibernate** | Object-Relational Mapping with custom JPQL queries and database constraints. |
| **MySQL Relational Database** | Normalized 6-table database schema with primary keys, foreign keys, unique indices, and cascade rules. |
| **Database Normalization** | Meets 1NF, 2NF, and 3NF design standards. |
| **SQL JOINs** | Multi-table JOIN queries implemented in `RegistrationRepository` and `ResultRepository`. |
| **Role-Based Access** | Enforced roles (`ADMIN`, `RACE_OFFICIAL`, `VIEWER`) via Spring Security and React route guards. |
| **Waterfall Methodology** | Comprehensive SDLC documentation included under `docs/waterfall-model.md`. |

---

## 📜 License & Academic Attribution
Created as an academic capstone project demonstrating modern full-stack web application development with React, Java Spring Boot, and MySQL.
