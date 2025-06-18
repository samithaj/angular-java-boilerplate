package com.example.crm.web;

import com.example.crm.domain.model.Address;
import com.example.crm.service.AddressService;
import com.example.crm.web.dto.AddressDto;
import com.example.crm.web.dto.AddressMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/addresses")
public class AddressController {

    private final AddressService service;
    private final AddressMapper mapper;

    public AddressController(AddressService service, AddressMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public Page<AddressDto> list(@PageableDefault Pageable pageable) {
        return service.findAll(pageable).map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public AddressDto get(@PathVariable Long id) {
        return mapper.toDto(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<AddressDto> create(@Valid @RequestBody AddressDto dto) {
        Address saved = service.create(mapper.toEntity(dto));
        return ResponseEntity.created(null).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public AddressDto update(@PathVariable Long id, @Valid @RequestBody AddressDto dto) {
        Address updated = service.update(id, mapper.toEntity(dto));
        return mapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
