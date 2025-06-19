package com.example.crm.web;

import com.example.crm.domain.model.Product;
import com.example.crm.service.ProductService;
import com.example.crm.web.dto.ProductDto;
import com.example.crm.web.dto.ProductMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductService service;
    private final ProductMapper mapper;

    public ProductController(ProductService service, ProductMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public Page<ProductDto> list(@RequestParam(required = false) Long subCategoryId,
                                 @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        if (subCategoryId != null) {
            java.util.List<Product> list = service.findBySubCategoryId(subCategoryId);
            return new org.springframework.data.domain.PageImpl<>(list).map(mapper::toDto);
        }
        return service.findAll(pageable).map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ProductDto get(@PathVariable Long id) {
        return mapper.toDto(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> create(@Valid @RequestBody ProductDto dto) {
        Product saved = service.create(mapper.toEntity(dto));
        return ResponseEntity.created(null).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Long id, @Valid @RequestBody ProductDto dto) {
        Product updated = service.update(id, mapper.toEntity(dto));
        return mapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
