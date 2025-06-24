package com.example.crm.web;

import com.example.crm.domain.model.ProductCategory;
import com.example.crm.service.ProductCategoryService;
import com.example.crm.web.dto.ProductCategoryDto;
import com.example.crm.web.dto.ProductCategoryMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/product-categories")
public class ProductCategoryController {
    private final ProductCategoryService service;
    private final ProductCategoryMapper mapper;

    public ProductCategoryController(ProductCategoryService service, ProductCategoryMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public java.util.List<ProductCategoryDto> list() {
        return service.findAll().stream().map(mapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ProductCategoryDto get(@PathVariable Long id) {
        return mapper.toDto(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductCategoryDto> create(@Valid @RequestBody ProductCategoryDto dto) {
        ProductCategory saved = service.create(mapper.toEntity(dto));
        return ResponseEntity.created(null).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ProductCategoryDto update(@PathVariable Long id, @Valid @RequestBody ProductCategoryDto dto) {
        ProductCategory updated = service.update(id, mapper.toEntity(dto));
        return mapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
