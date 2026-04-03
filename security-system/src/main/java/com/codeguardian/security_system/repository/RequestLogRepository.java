package com.codeguardian.security_system.repository;

import com.codeguardian.security_system.model.RequestLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
    
    // This counts how many times a specific API Key was used after a certain time
    // Essential for checking "Requests per Minute"
    long countByApiKeyValueAndTimestampAfter(String apiKeyValue, LocalDateTime timestamp);
}