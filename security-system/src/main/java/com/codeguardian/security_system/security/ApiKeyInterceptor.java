package com.codeguardian.security_system.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.codeguardian.security_system.model.ApiKey;
import com.codeguardian.security_system.repository.ApiKeyRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ApiKeyInterceptor implements HandlerInterceptor {

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. Extract the key from the header
        String key = request.getHeader("X-API-KEY");

        if (key != null) {
            Optional<ApiKey> apiKeyOpt = apiKeyRepository.findByKeyValue(key);
            
            if (apiKeyOpt.isPresent()) {
                ApiKey apiKey = apiKeyOpt.get();
                
                // 2. CHECK IF THE KEY ITSELF IS REVOKED
                if (!apiKey.isActive()) {
                    response.setStatus(401); // Unauthorized
                    response.getWriter().write("Error: This API key has been revoked.");
                    return false;
                }

                // 3. CHECK IF THE OWNER ACCOUNT IS ENABLED (Admin "Nuke" Check)
                if (apiKey.getUser() != null && !apiKey.getUser().isEnabled()) {
                    response.setStatus(403); // Forbidden
                    response.getWriter().write("Error: Account Suspended. Contact Admin.");
                    return false;
                }
                
                // Key is valid and user is active - Proceed!
                return true;
            } else {
                // Key provided but not found in DB
                response.setStatus(401);
                response.getWriter().write("Error: Invalid API Key.");
                return false;
            }
        }

        // If no key is provided, we let it pass here 
        // (assuming Spring Security handles the endpoint protection otherwise)
        return true; 
    }
}