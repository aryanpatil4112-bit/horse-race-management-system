# REST API Documentation — Horse Race Management System

Base URL: `http://localhost:8080/api`

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "admin@horserace.com",
    "password": "admin123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "userId": 1,
      "name": "System Administrator",
      "email": "admin@horserace.com",
      "role": "ADMIN"
    }
  }
  ```

---

## 2. Horse Management Endpoints

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/horses` | All Roles / Public | Fetch all horses (supports `?search=` and `?status=`) |
| `GET` | `/api/horses/{id}` | All Roles / Public | Fetch horse details by ID |
| `POST` | `/api/horses` | ADMIN, RACE_OFFICIAL | Register a new horse |
| `PUT` | `/api/horses/{id}` | ADMIN, RACE_OFFICIAL | Update horse profile |
| `DELETE` | `/api/horses/{id}` | ADMIN | Delete horse record |

---

## 3. Jockey Management Endpoints

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jockeys` | All Roles / Public | Fetch all jockeys (supports `?search=` and `?status=`) |
| `GET` | `/api/jockeys/{id}` | All Roles / Public | Fetch jockey details by ID |
| `POST` | `/api/jockeys` | ADMIN, RACE_OFFICIAL | Add new jockey record |
| `PUT` | `/api/jockeys/{id}` | ADMIN, RACE_OFFICIAL | Update jockey profile |
| `DELETE` | `/api/jockeys/{id}` | ADMIN | Delete jockey record |

---

## 4. Race Event Endpoints

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/races` | All Roles / Public | Fetch race schedule |
| `GET` | `/api/races/{id}` | All Roles / Public | Fetch specific race details |
| `POST` | `/api/races` | ADMIN, RACE_OFFICIAL | Schedule a new race |
| `PUT` | `/api/races/{id}` | ADMIN, RACE_OFFICIAL | Update race status/details |
| `DELETE` | `/api/races/{id}` | ADMIN | Delete race event |

---

## 5. Registration Endpoints

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/registrations` | All Roles / Public | Fetch registrations (supports `?raceId=`) |
| `POST` | `/api/registrations` | ADMIN, RACE_OFFICIAL | Register horse + jockey for a race |
| `DELETE` | `/api/registrations/{id}` | ADMIN | Cancel race registration |

---

## 6. Results Endpoints

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/results` | All Roles / Public | Fetch recorded race results |
| `POST` | `/api/results` | ADMIN, RACE_OFFICIAL | Record official position and finish time |
| `DELETE` | `/api/results/{id}` | ADMIN | Remove result record |

---

## 7. Dashboard & Leaderboard Endpoints

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | All Roles / Public | Fetch aggregated metrics and stats |
| `GET` | `/api/leaderboard` | All Roles / Public | Fetch ranked horse standings |
| `GET` | `/api/users` | ADMIN | Fetch system user accounts |
