package com.codeguardian.security_system.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // Added this import
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping; // Added this import
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeguardian.security_system.model.Plan;
import com.codeguardian.security_system.repository.UserRepository;
import com.codeguardian.security_system.service.ApiUsageService;

@RestController
@RequestMapping("/api/usage")
@CrossOrigin("*")
public class UsageController {

    @Autowired
    private ApiUsageService apiUsageService;

    @Autowired
    private UserRepository userRepository; // Must add this to use it in /upgrade

    @GetMapping("/my-stats")
    public ResponseEntity<Map<String, Object>> getMyStats() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> stats = apiUsageService.getUsageStats(username);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/upgrade")
    public ResponseEntity<?> upgradePlan(
            @AuthenticationPrincipal UserDetails userDetails, 
            @RequestParam String newPlan) {
        
        // We use userDetails.getUsername() for better security
        return userRepository.findByUsernameIgnoreCase(userDetails.getUsername())
            .map(user -> {
                try {
                    // Converts string "PRO" to Plan.PRO
                    user.setPlan(Plan.valueOf(newPlan.toUpperCase())); 
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "Plan upgraded to " + newPlan));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Invalid Plan type provided.");
                }
            })
            .orElse(ResponseEntity.status(404).body("User not found"));
    }
}