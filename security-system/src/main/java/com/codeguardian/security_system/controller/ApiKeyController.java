package com.codeguardian.security_system.controller;

import com.codeguardian.security_system.model.ApiKey;
import com.codeguardian.security_system.model.User;
import com.codeguardian.security_system.repository.ApiKeyRepository;
import com.codeguardian.security_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/keys")
@CrossOrigin(origins = "http://localhost:3000")
public class ApiKeyController {

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * GENERATE KEY: Fixed type-mismatch by using if-else logic.
     */
    @PostMapping("/generate/{username}")
    public ResponseEntity<?> generateKey(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // 1. Create the new key object
            ApiKey newKey = new ApiKey();
            
            // 2. Generate a unique value
            String uniqueKey = "cg_" + UUID.randomUUID().toString().replace("-", "");
            newKey.setKeyValue(uniqueKey);
            
            // 3. Link the User
            newKey.setUser(user);
            
            // 4. Set defaults (Requires the setters we added to ApiKey.java)
            newKey.setActive(true);
            newKey.setCreatedAt(LocalDateTime.now());

            // 5. Save to database
            apiKeyRepository.save(newKey);
            
            return ResponseEntity.ok(newKey);
        } else {
            // Returns a String-based error if user is missing
            return ResponseEntity.status(404).body("User not found: " + username);
        }
    }

    /**
     * FETCH KEYS: Matches 'api.get(`/keys/user/${username}`)'
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<List<ApiKey>> getUserKeys(@PathVariable String username) {
        // Ensure your ApiKeyRepository has the method: findByUserUsername(String username)
        List<ApiKey> keys = apiKeyRepository.findByUserUsername(username);
        return ResponseEntity.ok(keys);
    }

    /**
     * DELETE/REVOKE KEY: Matches 'api.delete(`/keys/delete/${id}`)'
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteKey(@PathVariable Long id) {
        if (apiKeyRepository.existsById(id)) {
            apiKeyRepository.deleteById(id);
            return ResponseEntity.ok("Key revoked successfully.");
        }
        return ResponseEntity.status(404).body("Key not found.");
    }
}