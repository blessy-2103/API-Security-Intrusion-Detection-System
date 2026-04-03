package com.codeguardian.security_system.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.codeguardian.security_system.model.User;
import com.codeguardian.security_system.repository.UserRepository;
import com.codeguardian.security_system.security.JwtUtils;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        // 1. Manually extract to ensure no mapping errors
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        System.out.println("DEBUG: Login attempt for username: [" + username + "]");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing credentials"));
        }

        // 2. Case-Insensitive Search
        // This handles "Blessy11" vs "blessy11"
        User user = userRepository.findByUsernameIgnoreCase(username).orElse(null);

        if (user == null) {
            System.out.println("DEBUG: User NOT found in database.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password"));
        }

        // 3. Match Password
        boolean isMatch = passwordEncoder.matches(password, user.getPassword());
        System.out.println("DEBUG: Password match result: " + isMatch);

        if (isMatch) {
            if (!user.isEnabled()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Account suspended"));
            }

            String token = jwtUtils.generateToken(user); 
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            
            System.out.println("DEBUG: Login successful for " + user.getUsername());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (userRepository.findByUsernameIgnoreCase(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken!"));
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("ROLE_USER");
            }
            user.setEnabled(true); 
            
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }
}