package com.shop.dressshop.controller;

import com.shop.dressshop.config.AdminAuthService;
import com.shop.dressshop.config.JwtUtil;
import com.shop.dressshop.dto.OrderItemRequest;
import com.shop.dressshop.dto.OrderRequest;
import com.shop.dressshop.model.Customer;
import com.shop.dressshop.model.Order;
import com.shop.dressshop.model.OrderItem;
import com.shop.dressshop.repository.CustomerRepository;
import com.shop.dressshop.repository.OrderRepository;
import com.shop.dressshop.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;
    private final AdminAuthService adminAuthService;

    public OrderController(OrderRepository orderRepository, CustomerRepository customerRepository,
                           ProductRepository productRepository, JwtUtil jwtUtil, AdminAuthService adminAuthService) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.jwtUtil = jwtUtil;
        this.adminAuthService = adminAuthService;
    }

    /** Place an order. Requires customer JWT. */
    @PostMapping
    public ResponseEntity<?> placeOrder(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody OrderRequest request) {

        Long customerId = extractCustomerId(authHeader);
        if (customerId == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid token"));

        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Customer not found"));

        String deliveryAddress = request.getDeliveryAddress() == null || request.getDeliveryAddress().isBlank()
                ? customer.getAddress()
                : request.getDeliveryAddress().trim();
        if (deliveryAddress == null || deliveryAddress.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Delivery address is required"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setDeliveryAddress(deliveryAddress);

        double total = 0;
        for (OrderItemRequest item : request.getItems()) {
            Long productId = item.getProductId();
            int qty = item.getQuantity();

            var product = productRepository.findById(productId).orElse(null);
            if (product == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "One or more products are no longer available"));
            }
            if (!product.isActive()) {
                return ResponseEntity.badRequest().body(Map.of("message", product.getName() + " is no longer available"));
            }
            if (!product.isInStock()) {
                return ResponseEntity.badRequest().body(Map.of("message", product.getName() + " is out of stock"));
            }
            if (product.getStockQuantity() != null && qty > product.getStockQuantity()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Only " + product.getStockQuantity() + " item(s) available for " + product.getName()));
            }

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductId(productId);
            oi.setProductName(product.getName());
            oi.setPrice(product.getPrice());
            oi.setQuantity(qty);
            oi.setImageUrl(product.getImageUrl());
            order.getItems().add(oi);
            total += product.getPrice() * qty;
        }
        if (order.getItems().isEmpty() || total <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Order total must be greater than zero"));
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("orderId", saved.getId(), "total", saved.getTotalAmount()));
    }

    /** Get orders for the logged-in customer. */
    @GetMapping("/my")
    public ResponseEntity<?> myOrders(@RequestHeader("Authorization") String authHeader) {
        Long customerId = extractCustomerId(authHeader);
        if (customerId == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid token"));

        List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        return ResponseEntity.ok(orders.stream().map(this::toDto).toList());
    }

    /** Admin: get all orders. Requires admin token. */
    @GetMapping
    public ResponseEntity<?> allOrders(@RequestHeader("Authorization") String authHeader) {
        if (!adminAuthService.isAuthorized(authHeader))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Admin access required"));
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDto).toList());
    }

    /** Admin: update order status. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@RequestHeader("Authorization") String authHeader,
                                          @PathVariable Long id,
                                          @RequestBody Map<String, String> body) {
        if (!adminAuthService.isAuthorized(authHeader))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Admin access required"));
        return orderRepository.findById(id).<ResponseEntity<?>>map(order -> {
            try {
                order.setStatus(Order.Status.valueOf(body.get("status")));
                return ResponseEntity.ok(toDto(orderRepository.save(order)));
            } catch (IllegalArgumentException | NullPointerException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid status"));
            }
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found")));
    }

    private Long extractCustomerId(String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
            return jwtUtil.getCustomerId(authHeader.substring(7));
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, Object> toDto(Order o) {
        return Map.of(
            "id", o.getId(),
            "status", o.getStatus(),
            "totalAmount", o.getTotalAmount(),
            "deliveryAddress", o.getDeliveryAddress(),
            "createdAt", o.getCreatedAt().toString(),
            "items", o.getItems().stream().map(i -> Map.of(
                "productId", i.getProductId(),
                "productName", i.getProductName(),
                "price", i.getPrice(),
                "quantity", i.getQuantity(),
                "imageUrl", i.getImageUrl() != null ? i.getImageUrl() : ""
            )).toList()
        );
    }
}
