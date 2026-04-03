package com.codeguardian.security_system.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    // Set default role as ROLE_USER
    private String role = "ROLE_USER"; 

    // THE NUKE SWITCH: true = active, false = banned
    private boolean enabled = true; 

    // --- SUBSCRIPTION PLAN ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Plan plan = Plan.FREE; // Default every new user to the Free plan

    // The "Vault" limit for how many keys they can own
    @Column(name = "max_keys", nullable = false)
    private int maxKeys = 5; // Default for FREE users

    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    // --- Plan Logic ---
    public Plan getPlan() { 
        return plan; 
    }

    /**
     * Updates the user's plan and automatically adjusts their key allowance.
     * This ensures the database stays consistent without manual overrides.
     */
    public void setPlan(Plan plan) { 
        this.plan = plan; 
        
        // AUTO-ADJUST: Instant tier upgrades
        switch(plan) {
            case PRO:
                this.maxKeys = 50;
                break;
            case ENTERPRISE:
                this.maxKeys = 500;
                break;
            case FREE:
            default:
                this.maxKeys = 5;
                break;
        }
    }

    public int getMaxKeys() { 
        return maxKeys; 
    }
    
    public void setMaxKeys(int maxKeys) { 
        this.maxKeys = maxKeys; 
    }
}