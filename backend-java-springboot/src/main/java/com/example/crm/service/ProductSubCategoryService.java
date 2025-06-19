package com.example.crm.service;

import com.example.crm.domain.model.ProductSubCategory;
import com.example.crm.domain.repository.ProductSubCategoryRepository;
import com.example.crm.domain.repository.ProductRepository;
import com.example.crm.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductSubCategoryService {
    private final ProductSubCategoryRepository repository;
    private final ProductRepository productRepository;
    private final ProductCategoryService categoryService;

    public ProductSubCategoryService(ProductSubCategoryRepository repository, ProductRepository productRepository, ProductCategoryService categoryService) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    @Transactional(readOnly = true)
    public Page<ProductSubCategory> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public java.util.List<ProductSubCategory> findByCategoryId(Long categoryId) {
        return repository.findByCategoryId(categoryId);
    }

    @Transactional(readOnly = true)
    public ProductSubCategory findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
    }

    public ProductSubCategory create(ProductSubCategory subCategory) {
        if (subCategory.getCategory() != null) {
            subCategory.setCategory(categoryService.findById(subCategory.getCategory().getId()));
        }
        return repository.save(subCategory);
    }

    public ProductSubCategory update(Long id, ProductSubCategory updated) {
        ProductSubCategory existing = findById(id);
        existing.setName(updated.getName());
        if (updated.getCategory() != null) {
            existing.setCategory(categoryService.findById(updated.getCategory().getId()));
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (productRepository.existsBySubCategoryId(id)) {
            throw new IllegalStateException("SubCategory has products");
        }
        ProductSubCategory existing = findById(id);
        repository.delete(existing);
    }
}
