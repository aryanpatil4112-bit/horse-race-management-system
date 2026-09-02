# Waterfall Software Development Lifecycle — Horse Race Management System

The **Horse Race Management System (HRMS)** was built adhering strictly to the classical **Waterfall Development Methodology**. Each stage of the software lifecycle was systematically completed with explicit artifacts produced before transitioning to the subsequent phase.

---

## 1. Phase 1: Requirement Analysis & Specification
- **Objective**: Gather comprehensive functional, non-functional, and role-based domain requirements from stakeholders (Race Club Management, Referees, Public Viewers).
- **Deliverables**: SRS (Software Requirements Specification) document specifying entity models, access tiers, security constraints, and forbidden scope (strictly zero betting/wagering features).

## 2. Phase 2: System Architecture & Design
- **Objective**: Design the multi-tier software architecture and system components.
- **Architecture**: React.js SPA Frontend → RESTful Controller Layer → Spring Boot Service Layer → JPA Repository Layer → MySQL Relational Database.
- **Deliverables**: Module interaction diagrams, Use Case specifications, and Class hierarchy models.

## 3. Phase 3: Database Design & Normalization
- **Objective**: Design a robust, scalable relational database schema.
- **Normalization**: Enforced 1NF, 2NF, and 3NF across 6 relational tables (`users`, `horses`, `jockeys`, `races`, `registrations`, `results`).
- **Deliverables**: Relational Entity-Relationship (ER) model, SQL DDL `schema.sql`, and initial seed dataset `seed.sql`.

## 4. Phase 4: Implementation (Coding Phase)
- **Objective**: Translate design specifications into functional code without architectural deviation.
- **Technologies**: Java 17, Spring Boot 3, Hibernate JPA, MySQL 8, React.js (Vite), Axios, Vanilla CSS design tokens.
- **Deliverables**: Runnable `backend` Maven codebase and `frontend` Vite application.

## 5. Phase 5: Verification & Testing
- **Objective**: Validate functional correctness, API status responses, foreign key constraints, and user interface workflows.
- **Test Scenarios**:
  - CRUD operations on Horses, Jockeys, and Races.
  - Validation rules (e.g., duplicate horse registration prevention, active jockey status verification).
  - Role-based security authorization (Admin, Race Official, Viewer).
- **Deliverables**: Test execution reports and validated Postman REST endpoint suite.

## 6. Phase 6: Deployment & Integration
- **Objective**: Package the backend JAR executable and frontend production build.
- **Deliverables**: Environment configuration files (`.env.example`, `application.properties`) and setup deployment guides.

## 7. Phase 7: Maintenance & Support
- **Objective**: Establish post-deployment monitoring, database indexing optimizations, and future enhancements scope.
