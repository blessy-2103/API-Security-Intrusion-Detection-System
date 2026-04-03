# 🛡️ APIGuardian: Enterprise API Security Gateway

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

**APIGuardian** is a high-performance security middleware designed to protect microservices from unauthorized access and resource exhaustion. It provides a centralized layer for **API Key Generation**, **JWT Authentication**, and dynamic **Rate Limiting** using the Token Bucket algorithm.

---

## 🚀 Core Features

* **🔒 Secure Key Management:** Cryptographically secure API key generation with metadata and expiration support.
* **🚦 Dynamic Rate Limiting:** Prevent DDoS and brute-force attacks using a high-precision **Token Bucket Algorithm**.
* **🔑 JWT Integration:** Full stateless authentication support using Spring Security and JSON Web Tokens.
* **📊 Traffic Analytics:** Detailed request logging, tracking latency, status codes, and IP origin.
* **🎨 Glassmorphism UI:** A premium React-based dashboard featuring modern light-mode aesthetics and interactive animations.
* **💳 Subscription Logic:** Integrated "Pro" upgrade workflow with a secure, high-end payment interface.

---

## 🛠️ Tech Stack

### Backend (The Core)
- **Framework:** Spring Boot 3.2 (Java 17)
- **Security:** Spring Security & JJWT
- **Persistence:** Spring Data JPA (Hibernate)
- **Database:** MySQL 8.0

### Frontend (The Control Plane)
- **Library:** React.js
- **Routing:** React Router 6
- **Animations:** Framer Motion
- **Styling:** Advanced CSS (Glassmorphism & Flexbox/Grid)

---

## 🚦 System Logic: How It Works



1.  **Intercept:** Every incoming request is intercepted by the `SecurityFilter`.
2.  **Validate:** The system checks for a valid `X-API-KEY` or `Authorization` header.
3.  **Throttle:** The Rate Limiter checks the database for the user's plan (Free vs Pro) and evaluates the remaining "tokens."
4.  **Forward/Reject:** If valid and within limits, the request is forwarded to the internal service; otherwise, a `429 Too Many Requests` is returned.

---

## 📋 API Documentation

### Authentication
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new developer | Public |
| `POST` | `/api/auth/login` | Obtain JWT Token | Public |

### Key Management
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/keys/generate` | Generate a unique API Key | JWT |
| `GET` | `/api/keys/my-keys` | Retrieve all active keys | JWT |
| `DELETE` | `/api/keys/{id}` | Revoke an API Key | JWT |

---

## ⚙️ Installation & Setup

### Prerequisites
- JDK 17+
- Maven 3.6+
- MySQL Server

### 1. Backend Configuration
Clone the repo and update your `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/apiguardian
spring.datasource.username=YOUR_USER
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
