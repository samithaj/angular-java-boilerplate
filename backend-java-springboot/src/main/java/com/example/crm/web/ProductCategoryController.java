package com.example.crm.web;

import com.example.crm.domain.model.ProductCategory;
import com.example.crm.service.ProductCategoryService;
import com.example.crm.web.dto.ProductCategoryDto;
import com.example.crm.web.dto.ProductCategoryMapper;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public Page<ProductCategoryDto> list(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return service.findAll(pageable).map(mapper::toDto);
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
