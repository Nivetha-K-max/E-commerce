package com.shop.dressshop.controller;

import com.shop.dressshop.model.Product;
import com.shop.dressshop.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        Stream<Product> stream = productRepository.findAllByOrderByCreatedAtDesc().stream();

        if (category != null && !category.isBlank())
            stream = stream.filter(p -> p.getCategory().equalsIgnoreCase(category));

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            stream = stream.filter(p ->
                    p.getName().toLowerCase().contains(q) ||
                    p.getCategory().toLowerCase().contains(q));
        }

        if (Boolean.TRUE.equals(inStock))
            stream = stream.filter(Product::isInStock);

        if (minPrice != null)
            stream = stream.filter(p -> p.getPrice() >= minPrice);

        if (maxPrice != null)
            stream = stream.filter(p -> p.getPrice() <= maxPrice);

        if (sort != null) {
            stream = switch (sort) {
                case "price_asc"  -> stream.sorted(Comparator.comparingDouble(Product::getPrice));
                case "price_desc" -> stream.sorted(Comparator.comparingDouble(Product::getPrice).reversed());
                case "name_asc"   -> stream.sorted(Comparator.comparing(Product::getName));
                default           -> stream; // "newest" — already ordered by createdAt desc
            };
        }

        return stream.toList();
    }

    @GetMapping("/new-arrivals")
    public List<Product> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrueOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Product not found")));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productRepository.save(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product updated) {
        return productRepository.findById(id).<ResponseEntity<?>>map(existing -> {
            existing.setName(updated.getName());
            existing.setPrice(updated.getPrice());
            existing.setImageUrl(updated.getImageUrl());
            existing.setCategory(updated.getCategory());
            existing.setInStock(updated.isInStock());
            existing.setNewArrival(updated.isNewArrival());
            existing.setDescription(updated.getDescription());
            return ResponseEntity.ok(productRepository.save(existing));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Product not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Product not found"));
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
