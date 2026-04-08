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
