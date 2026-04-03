package com.codeguardian.security_system.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeguardian.security_system.service.ApiUsageService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin("*") // Allows developers to call this from any frontend
public class PublicApiController {

    @Autowired
    private ApiUsageService apiUsageService;

    /**
     * This is an example of a "Paid API Endpoint".
     * A user must provide their 'cg_...' key in the header to get a response.
     */
    @GetMapping("/service")
    public ResponseEntity<?> getProtectedService(@RequestHeader(value = "X-API-KEY", required = false) String apiKey) {
        
        // 1. Check if the header is missing
        if (apiKey == null || apiKey.isEmpty()) {
            return ResponseEntity.status(401).body("Missing API Key. Please include 'X-API-KEY' in your headers.");
        }

        // 2. Use the Service we built to validate the key and check the Plan Quota
        // This method checks: Is key real? Is it active? Has the user hit their Daily Limit?
        if (apiUsageService.canAccessAndIncrement(apiKey)) {
            
            // 3. If everything is good, return the "Product"
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Data retrieved successfully via CodeGuardian Shield.");
            response.put("data", "This is the sensitive information your API provides.");
            
            return ResponseEntity.ok(response);
            
        } else {
            // 4. If the key is wrong OR they hit their limit (e.g., 100/100 requests)
            return ResponseEntity.status(429)
                .body("Access Denied: Invalid Key or Daily Subscription Limit Reached.");
        }
    }
}