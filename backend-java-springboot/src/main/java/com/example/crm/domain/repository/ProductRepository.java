package com.example.crm.domain.repository;

import com.example.crm.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySku(String sku);
    boolean existsBySubCategoryId(Long subCategoryId);
    List<Product> findBySubCategoryId(Long subCategoryId);
    
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Product> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    Page<Product> findBySkuContainingIgnoreCase(String sku, Pageable pageable);
    
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("SELECT p FROM Product p JOIN p.subCategory sc JOIN sc.category c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))")
    Page<Product> findByCategoryNameContaining(@Param("categoryName") String categoryName, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= :threshold")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
    
    @Query("SELECT p FROM Product p WHERE p.active = true")
    Page<Product> findActiveProducts(Pageable pageable);
}
