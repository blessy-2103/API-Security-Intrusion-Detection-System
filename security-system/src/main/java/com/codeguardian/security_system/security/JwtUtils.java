package com.codeguardian.security_system.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import com.codeguardian.security_system.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * Utility class for JWT Generation, Extraction, and Validation.
 * Updated with a persistent key to prevent 500 errors on server restart.
 */
@Component
public class JwtUtils {

    // 🛡️ FIX: Use a fixed secret string. 
    // If you use Keys.secretKeyFor(), old tokens crash the server after a restart.
    private final String SECRET_STRING = "CodeGuardian_Super_Secure_Secret_Key_2026_MNC_Level_Security";
    private final Key key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());
    
    private final int jwtExpirationMs = 86400000; // 24 hours

    /**
     * Generates a secure JWT containing the Username and Security Role.
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        // 🛡️ CRITICAL: Ensure the role is prefixed with ROLE_ if needed
        claims.put("role", user.getRole()); 

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts the Subject (Username) from the JWT.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the Security Role from the JWT claims.
     */
    public String extractRole(String token) {
        final Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    /**
     * Generic helper to extract specific claims.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 🛡️ FIX: This method name MUST match what is called in JwtFilter.java
     */
    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Alternative name for validation, often used interchangeably.
     */
    public boolean isTokenValid(String token) {
        return validateToken(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}