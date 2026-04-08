# 🛡️ APIGuardian: API SECURITY INTRUSION DETECTION SYSTEM


![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=springboot)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

**APIGuardian** is a high-performance security middleware and **Intrusion Detection System (IDS)** designed to protect microservices from unauthorized access and resource exhaustion. By leveraging **Redis** for ultra-low latency rate limiting and **Spring Security** for robust authentication, it provides an enterprise-grade shield for modern API infrastructures.

---

## 🚀 Core Features

* **🔒 Secure Key Management:** Cryptographically secure API key generation with metadata and expiration support.
* **🚦 High-Performance Rate Limiting:** Implements the **Token Bucket Algorithm** backed by **Redis** to handle thousands of requests per second with microsecond latency.
* **🔑 JWT & OAuth2 Logic:** Full stateless authentication support using Spring Security and JSON Web Tokens.
* **📊 Threat Analytics:** Real-time visualization of traffic patterns and security incidents using **Chart.js**.
* **🎨 Glassmorphism UI:** A premium React-based dashboard featuring professional light-mode aesthetics and fluid animations.
* **💳 Subscription Tiering:** Integrated "Pro" workflow with a secure checkout interface to manage different API usage quotas.

---

## 🛠️ Tech Stack

### Backend (The Core)
- **Framework:** Spring Boot 3.2 (Java 17)
- **Security:** Spring Security & JJWT
- **Caching/Performance:** **Redis** (Used for distributed rate limiting and session caching)
- **Persistence:** Spring Data JPA (Hibernate)
- **Database:** MySQL 8.0

### Frontend (The Control Plane)
- **Library:** React.js
- **Data Viz:** Chart.js (Real-time traffic & threat metrics)
- **Animations:** Framer Motion
- **Styling:** Advanced CSS (Glassmorphism & Flexbox/Grid)

---

## 🚦 System Logic: How It Works

1.  **Intercept:** Every incoming request is intercepted by a custom `SecurityFilter` chain.
2.  **Validate:** The system performs a dual check for `Authorization: Bearer <JWT>` or the `X-API-KEY` header.
3.  **Throttle (Redis Powered):** The system queries **Redis** to check the current token bucket for the specific API key. Using Redis ensures that rate limiting is synchronized across multiple instances of your API.
4.  **Forward/Reject:** If the quota is available, the request proceeds. If not, a `429 Too Many Requests` is issued instantly.

---

## 📋 API Documentation

### Authentication & Gateway
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new developer | Public |
| `POST` | `/api/auth/login` | Obtain JWT Token | Public |
| `POST` | `/api/keys/generate` | Generate a unique API Key | JWT |
| `GET` | `/api/keys/my-keys` | Retrieve active keys | JWT |

---

## ⚙️ Installation & Setup

### Prerequisites
- JDK 17+
- Maven 3.6+
- **Redis Server** (Running on port 6379)
- MySQL Server

## 1. Backend Configuration
Update `src/main/resources/application.properties`:
### Database
spring.datasource.url=jdbc:mysql://localhost:3306/apiguardian
spring.datasource.username=YOUR_USER
spring.datasource.password=YOUR_PASSWORD

### Redis Configuration
spring.data.redis.host=localhost
spring.data.redis.port=6379

### Security
spring.jpa.hibernate.ddl-auto=update
Run the application:

Bash
mvn spring-boot:run
### 2. Frontend Configuration
Bash
cd apiguardian-ui
npm install
npm start
<img width="1920" height="1080" alt="Screenshot (966)" src="https://github.com/user-attachments/assets/75c686df-ae21-4bcd-aafe-c82a66205b8d" />
<img width="1920" height="1080" alt="Screenshot (967)" src="https://github.com/user-attachments/assets/fab21771-edb8-485f-8705-b8a3077dcc5d" />
<img width="1920" height="1080" alt="Screenshot (968)" src="https://github.com/user-attachments/assets/d339d26d-82db-401b-8f02-632a66b05905" />
<img width="1920" height="1080" alt="Screenshot (973)" src="https://github.com/user-attachments/assets/e809f1c4-05fc-48cf-891b-9544d6b099dd" />
<img width="1920" height="1080" alt="Screenshot (969)" src="https://github.com/user-attachments/assets/52adbc88-9b53-418a-8433-875925cac26a" />
<img width="1920" height="1080" alt="Screenshot (970)" src="https://github.com/user-attachments/assets/f383b053-3bd7-49c5-b09b-bf35f2b7ea23" />
<img width="1920" height="1080" alt="Screenshot (971)" src="https://github.com/user-attachments/assets/ce9241b2-f656-4248-bb91-4c3072032474" />
<img width="1920" height="1080" alt="Screenshot (972)" src="https://github.com/user-attachments/assets/ab2f3827-7130-40d0-adb7-c22fbe1f61bb" />






