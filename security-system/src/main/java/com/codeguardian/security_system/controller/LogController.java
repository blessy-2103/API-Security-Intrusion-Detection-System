package com.codeguardian.security_system.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeguardian.security_system.model.RequestLog;
import com.codeguardian.security_system.repository.RequestLogRepository;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:3000") // Allows React to talk to this
public class LogController {

    @Autowired
    private RequestLogRepository requestLogRepository;

    // 1. Get the count for the Progress Bar (Last 1 minute)
    @GetMapping("/usage/{username}")
    public Map<String, Long> getUsage(@PathVariable String username) {
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
        
        // We find all logs for this user in the last minute
        long count = requestLogRepository.findAll().stream()
                .filter(log -> log.getUsername().equals(username) && 
                               log.getTimestamp().isAfter(oneMinuteAgo))
                .count();

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return response;
    }

    // 2. Get the last 10 activities for the Table
    @GetMapping("/recent/{username}")
    public List<RequestLog> getRecentLogs(@PathVariable String username) {
        return requestLogRepository.findAll().stream()
                .filter(log -> log.getUsername().equals(username))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp())) // Newest first
                .limit(10)
                .toList();
    }
}