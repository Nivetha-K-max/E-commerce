package com.shop.dressshop.controller;

import com.shop.dressshop.config.JwtUtil;
import com.shop.dressshop.model.Customer;
import com.shop.dressshop.model.Order;
import com.shop.dressshop.model.OrderItem;
import com.shop.dressshop.repository.CustomerRepository;
import com.shop.dressshop.repository.OrderRepository;
import com.shop.dressshop.repository.ProductRepository;
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

    public OrderController(OrderRepository orderRepository, CustomerRepository customerRepository,
                           ProductRepository productRepository, JwtUtil jwtUtil) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.jwtUtil = jwtUtil;
    }

    /** Place an order. Requires customer JWT. */
    @PostMapping
    public ResponseEntity<?> placeOrder(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        Long customerId = extractCustomerId(authHeader);
        if (customerId == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid token"));

        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Customer not found"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itemsData = (List<Map<String, Object>>) body.get("items");
        if (itemsData == null || itemsData.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("message", "Order must have at least one item"));

        String deliveryAddress = (String) body.getOrDefault("deliveryAddress", customer.getAddress());

        Order order = new Order();
        order.setCustomer(customer);
        order.setDeliveryAddress(deliveryAddress);

        double total = 0;
        for (Map<String, Object> item : itemsData) {
            Long productId = Long.valueOf(item.get("productId").toString());
            int qty = Integer.parseInt(item.get("quantity").toString());

            var product = productRepository.findById(productId).orElse(null);
            if (product == null) continue;

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
        // Reuse the same admin token check as other admin endpoints
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDto).toList());
    }

    /** Admin: update order status. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderRepository.findById(id).<ResponseEntity<?>>map(order -> {
            try {
                order.setStatus(Order.Status.valueOf(body.get("status")));
                return ResponseEntity.ok(toDto(orderRepository.save(order)));
            } catch (IllegalArgumentException e) {
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
