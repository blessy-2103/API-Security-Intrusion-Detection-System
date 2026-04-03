package com.codeguardian.security_system.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.codeguardian.security_system.model.RequestLog;
import com.codeguardian.security_system.repository.ApiKeyRepository;
import com.codeguardian.security_system.repository.RequestLogRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @Autowired
    private RequestLogRepository requestLogRepository;

    // Set your limit here (e.g., 10 requests per minute for testing)
    private static final int MAX_REQUESTS_PER_MINUTE = 10;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String apiKeyHeader = request.getHeader("X-API-KEY");

        // 1. IMPROVED LOGIC: 
        // We only apply Rate Limiting IF an API Key is provided in the header.
        // If there is no API Key header, we let the JwtFilter handle the request normally.
        if (apiKeyHeader == null || apiKeyHeader.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Validate the API Key exists and is active in MySQL
        var apiKeyOpt = apiKeyRepository.findAll().stream()
                .filter(k -> k.getKeyValue().equals(apiKeyHeader) && k.isActive())
                .findFirst();

        if (apiKeyOpt.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid or Inactive API Key\"}");
            return;
        }

        // 3. Rate Limiting Logic: Count requests in the last 1 minute
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
        long requestCount = requestLogRepository.countByApiKeyValueAndTimestampAfter(apiKeyHeader, oneMinuteAgo);

        if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(429); // 429 Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Rate limit exceeded. Try again in a minute.\"}");
            
            // Log the "Blocked" attempt too (Feature 4 - Audit Trail)
            saveLog(apiKeyHeader, path, 429, apiKeyOpt.get().getUser().getUsername());
            return;
        }

        // 4. Request Logging: Save the successful attempt
        saveLog(apiKeyHeader, path, HttpServletResponse.SC_OK, apiKeyOpt.get().getUser().getUsername());

        // 5. Continue to the Controller
        filterChain.doFilter(request, response);
    }

    // Helper method to keep code clean
    private void saveLog(String key, String path, int status, String user) {
        RequestLog log = new RequestLog();
        log.setApiKeyValue(key);
        log.setEndpoint(path);
        log.setTimestamp(LocalDateTime.now());
        log.setStatusCode(status);
        log.setUsername(user);
        requestLogRepository.save(log);
    }
}