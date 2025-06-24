package com.example.crm.service;

import com.example.crm.domain.model.Product;
import com.example.crm.domain.repository.OrderLineRepository;
import com.example.crm.domain.repository.ProductRepository;
import com.example.crm.exception.DuplicateSkuException;
import com.example.crm.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class ProductService {
    private final ProductRepository repository;
    private final ProductSubCategoryService subCategoryService;
    private final OrderLineRepository orderRepository;

    public ProductService(ProductRepository repository, ProductSubCategoryService subCategoryService, OrderLineRepository orderRepository) {
        this.repository = repository;
        this.subCategoryService = subCategoryService;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public Page<Product> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public java.util.List<Product> findBySubCategoryId(Long subCategoryId) {
        return repository.findBySubCategoryId(subCategoryId);
    }

    @Transactional(readOnly = true)
    public Product findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public Product create(Product product) {
        validate(product);
        if (repository.existsBySku(product.getSku())) {
            throw new DuplicateSkuException("SKU already exists");
        }
        if (product.getSubCategory() != null) {
            product.setSubCategory(subCategoryService.findById(product.getSubCategory().getId()));
        }
        return repository.save(product);
    }

    public Product update(Long id, Product updated) {
        Product existing = findById(id);
        if (!existing.getSku().equals(updated.getSku()) && repository.existsBySku(updated.getSku())) {
            throw new DuplicateSkuException("SKU already exists");
        }
        validate(updated);
        existing.setSku(updated.getSku());
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setActive(updated.getActive());
        if (updated.getSubCategory() != null) {
            existing.setSubCategory(subCategoryService.findById(updated.getSubCategory().getId()));
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (orderRepository.existsByProductId(id)) {
            throw new IllegalStateException("Product in use by orders");
        }
        Product existing = findById(id);
        repository.delete(existing);
    }

    private void validate(Product product) {
        BigDecimal price = product.getPrice();
        if (price == null || price.scale() > 2 || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid price");
        }
        if (product.getStockQuantity() != null && product.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Stock must be >= 0");
        }
    }
}
