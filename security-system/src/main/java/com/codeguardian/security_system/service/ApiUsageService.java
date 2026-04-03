package com.codeguardian.security_system.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeguardian.security_system.model.ApiKey;
import com.codeguardian.security_system.model.ApiUsage;
import com.codeguardian.security_system.model.User;
import com.codeguardian.security_system.repository.ApiKeyRepository;
import com.codeguardian.security_system.repository.ApiUsageRepository;
import com.codeguardian.security_system.repository.UserRepository;

@Service
public class ApiUsageService {

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @Autowired
    private ApiUsageRepository apiUsageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public boolean canAccessAndIncrement(String keyValue) {
        Optional<ApiKey> apiKeyOpt = apiKeyRepository.findByKeyValue(keyValue);

        if (apiKeyOpt.isEmpty() || !apiKeyOpt.get().isActive()) {
            return false; 
        }

        ApiKey apiKey = apiKeyOpt.get();
        User user = apiKey.getUser();
        LocalDate today = LocalDate.now();

        ApiUsage usage = apiUsageRepository.findByUserAndUsageDate(user, today)
                .orElseGet(() -> {
                    ApiUsage newUsage = new ApiUsage();
                    newUsage.setUser(user);
                    newUsage.setUsageDate(today);
                    newUsage.setRequestCount(0);
                    return newUsage;
                });

        if (usage.getRequestCount() >= user.getPlan().getDailyLimit()) {
            return false; 
        }

        usage.setRequestCount(usage.getRequestCount() + 1);
        apiUsageRepository.save(usage);
        
        return true;
    }

    public Map<String, Object> getUsageStats(String username) {
        // Changed to findByUsernameIgnoreCase to resolve the "cannot find symbol" error
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        LocalDate today = LocalDate.now();
        
        int currentCount = apiUsageRepository.findByUserAndUsageDate(user, today)
        .map(usage -> (int) usage.getRequestCount()) // Cast to int here
        .orElse(0);

        // FIXED: Using int to match Plan.getDailyLimit()
        int limit = user.getPlan().getDailyLimit();
        
        double percent = (limit > 0) ? ((double) currentCount / limit) * 100 : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("current", currentCount);
        stats.put("limit", limit); 
        stats.put("percent", Math.min(percent, 100.0));
        stats.put("plan", user.getPlan().name());
        
        return stats;
    }
}