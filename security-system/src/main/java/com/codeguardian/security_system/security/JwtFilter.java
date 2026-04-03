package com.codeguardian.security_system.security;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Security Filter for validating JWT tokens on every request.
 * Ensures the SecurityContext is populated with the user's Identity and Roles.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();

        // 🛡️ 1. BYPASS PUBLIC ENDPOINTS
        // These paths do not require a JWT. We skip the logic and move to the next filter.
        if (path.startsWith("/api/auth/") || path.startsWith("/api/v1/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        try {
            // 2. Check for Bearer Token
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                // 3. Extract Identity from Token
                String username = jwtUtils.extractUsername(token); 
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    
                    // 4. Validate Token Expiration/Signature
                    if (jwtUtils.validateToken(token)) {
                        
                        // 5. Extract and Format Role
                        String role = jwtUtils.extractRole(token); 
                        
                        // Default to ROLE_USER if role is missing in token
                        if (role == null) {
                            role = "ROLE_USER";
                        }

                        // Ensure prefix "ROLE_" exists for .hasRole() compatibility
                        if (!role.startsWith("ROLE_")) {
                            role = "ROLE_" + role;
                        }

                        List<SimpleGrantedAuthority> authorities = 
                            Collections.singletonList(new SimpleGrantedAuthority(role));

                        // 6. Create Authentication Token
                        UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                        
                        // Build extra details (IP, Session Info)
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // 7. SET THE SECURITY CONTEXT
                        // After this line, the user is "Logged In" for the duration of this request
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (Exception e) {
            // Log error for debugging (Malformed tokens, etc.)
            logger.error("Security Filter Error: Cannot set user authentication", e);
        }

        // 8. Always continue the filter chain!
        filterChain.doFilter(request, response);
    }
}