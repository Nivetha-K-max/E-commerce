package com.shop.dressshop.repository;

import com.shop.dressshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsNewArrivalTrueOrderByCreatedAtDesc();
    List<Product> findByCategoryIgnoreCase(String category);
    List<Product> findAllByOrderByCreatedAtDesc();
}
