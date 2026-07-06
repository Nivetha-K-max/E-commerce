package com.shop.dressshop.controller;

import com.shop.dressshop.config.JwtUtil;
import com.shop.dressshop.model.Customer;
import com.shop.dressshop.repository.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public CustomerController(CustomerRepository customerRepository, JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (customerRepository.existsByEmail(email))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));

        Customer c = new Customer();
        c.setName(body.get("name"));
        c.setEmail(email);
        c.setPhone(body.get("phone"));
        c.setPassword(encoder.encode(body.get("password")));
        c.setAddress(body.get("address"));
        customerRepository.save(c);

        String token = jwtUtil.generate(c.getId(), c.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(buildResponse(c, token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return customerRepository.findByEmail(body.get("email"))
                .filter(c -> encoder.matches(body.get("password"), c.getPassword()))
                .<ResponseEntity<?>>map(c -> {
                    String token = jwtUtil.generate(c.getId(), c.getEmail());
                    return ResponseEntity.ok(buildResponse(c, token));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password")));
    }

    private Map<String, Object> buildResponse(Customer c, String token) {
        return Map.of(
                "token", token,
                "id", c.getId(),
                "name", c.getName(),
                "email", c.getEmail(),
                "phone", c.getPhone(),
                "address", c.getAddress() != null ? c.getAddress() : ""
        );
    }
}
