package com.codeguardian.security_system.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String actor;      // Who did it (Admin username)
    private String action;     // What they did (e.g., "USER_REVOKED")
    private String target;     // Who was affected (Target username)
    private String ipAddress;  // Origin of the request
    private LocalDateTime timestamp;

    public AuditLog() {}

    public AuditLog(String actor, String action, String target, String ipAddress) {
        this.actor = actor;
        this.action = action;
        this.target = target;
        this.ipAddress = ipAddress;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getActor() { return actor; }
    public String getAction() { return action; }
    public String getTarget() { return target; }
    public String getIpAddress() { return ipAddress; }
    public LocalDateTime getTimestamp() { return timestamp; }
}