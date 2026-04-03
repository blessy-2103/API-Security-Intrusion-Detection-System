import axios from 'axios';

// 🛡️ Base URL for your Spring Boot backend
const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the JWT Bearer token to every outgoing request.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Standard format: Bearer eyJhbG...
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR
 * Intercepts 401/403 errors to handle expired sessions or unauthorized access.
 */
api.interceptors.response.use(
    (response) => {
        // If the request was successful, just return the response
        return response;
    },
    (error) => {
        // Check if the error is due to an expired or invalid token
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Session expired or unauthorized. Logging out...");
            
            // 🛡️ Clear local storage to prevent loops
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');

            // Redirect to login page only if we aren't already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;