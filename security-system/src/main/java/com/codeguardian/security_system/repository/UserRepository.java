package com.codeguardian.security_system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeguardian.security_system.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // This fixes the 2 errors in AuthController
    Optional<User> findByUsernameIgnoreCase(String username);
    
    // Keep this one too, just in case other services use it
    Optional<User> findByUsername(String username);
}