package com.codeguardian.security_system.model;

public enum Plan {
    FREE(100),
    PRO(1000),
    ENTERPRISE(100000);

    private final int dailyLimit;

    Plan(int dailyLimit) {
        this.dailyLimit = dailyLimit;
    }

    public int getDailyLimit() {
        return dailyLimit;
    }
}