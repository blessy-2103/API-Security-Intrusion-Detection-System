package com.codeguardian.security_system.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "request_logs")
public class RequestLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "api_key_value", nullable = false)
    private String apiKeyValue;

    @Column(name = "endpoint")
    private String endpoint;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @Column(name = "status_code")
    private int statusCode;

    @Column(name = "username")
    private String username;

    // Default Constructor (Required by JPA)
    public RequestLog() {
    }

    // Convenience Constructor
    public RequestLog(String apiKeyValue, String endpoint, int statusCode, String username) {
        this.apiKeyValue = apiKeyValue;
        this.endpoint = endpoint;
        this.statusCode = statusCode;
        this.username = username;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApiKeyValue() {
        return apiKeyValue;
    }

    public void setApiKeyValue(String apiKeyValue) {
        this.apiKeyValue = apiKeyValue;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}