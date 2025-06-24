package com.example.crm.web;

import com.example.crm.domain.model.ProductSubCategory;
import com.example.crm.service.ProductSubCategoryService;
import com.example.crm.web.dto.ProductSubCategoryDto;
import com.example.crm.web.dto.ProductSubCategoryMapper;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product-subcategories")
public class ProductSubCategoryController {
    private final ProductSubCategoryService service;
    private final ProductSubCategoryMapper mapper;

    public ProductSubCategoryController(ProductSubCategoryService service, ProductSubCategoryMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<ProductSubCategoryDto> list(@RequestParam(required = false) Long categoryId) {
        List<ProductSubCategory> items = (categoryId != null)
                ? service.findByCategoryId(categoryId)
                : service.findAll();
        return items.stream().map(mapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ProductSubCategoryDto get(@PathVariable Long id) {
        return mapper.toDto(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductSubCategoryDto> create(@Valid @RequestBody ProductSubCategoryDto dto) {
        ProductSubCategory saved = service.create(mapper.toEntity(dto));
        return ResponseEntity.created(null).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ProductSubCategoryDto update(@PathVariable Long id, @Valid @RequestBody ProductSubCategoryDto dto) {
        ProductSubCategory updated = service.update(id, mapper.toEntity(dto));
        return mapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
