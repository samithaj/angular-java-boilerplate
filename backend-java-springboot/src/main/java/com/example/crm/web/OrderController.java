package com.example.crm.web;

import com.example.crm.domain.model.OrderHeader;
import com.example.crm.service.OrderService;
import com.example.crm.web.dto.OrderHeaderDto;
import com.example.crm.web.dto.OrderHeaderMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService service;
    private final OrderHeaderMapper mapper;

    public OrderController(OrderService service, OrderHeaderMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public Page<OrderHeaderDto> list(@PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return service.findAll(pageable).map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public OrderHeaderDto get(@PathVariable Long id) {
        return mapper.toDto(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrderHeaderDto> create(@Valid @RequestBody OrderHeaderDto dto) {
        OrderHeader saved = service.create(mapper.toEntity(dto));
        return ResponseEntity.created(null).body(mapper.toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
