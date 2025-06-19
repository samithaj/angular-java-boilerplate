package com.example.crm.domain.repository;

import com.example.crm.domain.model.ProductSubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductSubCategoryRepository extends JpaRepository<ProductSubCategory, Long> {
    boolean existsByCategoryId(Long categoryId);
    java.util.List<ProductSubCategory> findByCategoryId(Long categoryId);
}
