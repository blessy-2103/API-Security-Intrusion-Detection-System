package com.codeguardian.security_system.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeguardian.security_system.model.AuditLog;
import com.codeguardian.security_system.model.User;
import com.codeguardian.security_system.repository.AuditLogRepository;
import com.codeguardian.security_system.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Administrative Controller for CodeGuardian
 * Manages Identity & Access Management (IAM) and Security Audit Trails.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository; // 🛡️ Injected for audit trails

    /**
     * Fetch all registered identities.
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Fetch the security audit history for the dashboard.
     */
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }

    /**
     * The Security Override (Enable/Disable User) with Audit Logging.
     */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long id, HttpServletRequest request) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // 1. Toggle the access status
            boolean newStatus = !user.isEnabled();
            user.setEnabled(newStatus);
            userRepository.save(user);
            
            // 2. Capture metadata for the Audit Log
            // Get Admin username from the JWT context
            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            // Get IP Address from the request object
            String ipAddress = request.getRemoteAddr();
            String actionType = newStatus ? "IDENTITY_RESTORED" : "IDENTITY_REVOKED";

            // 3. Persist the security event
            AuditLog log = new AuditLog(
                adminUsername, 
                actionType, 
                user.getUsername(), 
                ipAddress
            );
            auditLogRepository.save(log);
            
            String actionLabel = newStatus ? "RESTORED" : "REVOKED";
            return ResponseEntity.ok("SECURITY UPDATE: Access " + actionLabel + " for user: " + user.getUsername());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ERROR: Target Identity Not Found.");
    }
}