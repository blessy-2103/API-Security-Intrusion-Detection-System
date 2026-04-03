package com.codeguardian.security_system.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeguardian.security_system.model.ApiUsage;
import com.codeguardian.security_system.model.User;

public interface ApiUsageRepository extends JpaRepository<ApiUsage, Long> {
    Optional<ApiUsage> findByUserAndUsageDate(User user, LocalDate date);
}