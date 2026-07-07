package com.shop.dressshop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    @Value("${admin.token}")
    private String adminToken;

    public boolean isAuthorized(String authHeader) {
        return authHeader != null && authHeader.equals("Bearer " + adminToken);
    }
}
