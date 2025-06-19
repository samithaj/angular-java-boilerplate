package com.example.crm.domain.repository;

import com.example.crm.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySku(String sku);
    boolean existsBySubCategoryId(Long subCategoryId);
    List<Product> findBySubCategoryId(Long subCategoryId);
}
