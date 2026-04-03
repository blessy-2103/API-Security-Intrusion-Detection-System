package com.codeguardian.security_system.repository;

import com.codeguardian.security_system.model.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    
    // This naming is magic: it looks for the 'user' field, then the 'username' inside that User
    List<ApiKey> findByUserUsername(String username);

    // Used by your ApiUsageService to validate the incoming key
    Optional<ApiKey> findByKeyValue(String keyValue);
}