package com.example.crm.service;

import com.example.crm.domain.model.ProductCategory;
import com.example.crm.domain.repository.ProductCategoryRepository;
import com.example.crm.domain.repository.ProductSubCategoryRepository;
import com.example.crm.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductCategoryService {
    private final ProductCategoryRepository repository;
    private final ProductSubCategoryRepository subCategoryRepository;

    public ProductCategoryService(ProductCategoryRepository repository, ProductSubCategoryRepository subCategoryRepository) {
        this.repository = repository;
        this.subCategoryRepository = subCategoryRepository;
    }

    @Transactional(readOnly = true)
    public java.util.List<ProductCategory> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public ProductCategory findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    public ProductCategory create(ProductCategory category) {
        return repository.save(category);
    }

    public ProductCategory update(Long id, ProductCategory updated) {
        ProductCategory existing = findById(id);
        existing.setName(updated.getName());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (subCategoryRepository.existsByCategoryId(id)) {
            throw new IllegalStateException("Category has subcategories");
        }
        ProductCategory existing = findById(id);
        repository.delete(existing);
    }
}
