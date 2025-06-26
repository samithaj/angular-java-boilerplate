package com.example.crm.web;

import com.example.crm.domain.model.Address;
import com.example.crm.service.AddressService;
import com.example.crm.web.dto.AddressDto;
import com.example.crm.web.dto.AddressMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/addresses")
@Tag(name = "Address", description = "Address management API")
public class AddressController {

    private final AddressService service;
    private final AddressMapper mapper;

    public AddressController(AddressService service, AddressMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    @Operation(summary = "List all addresses", description = "Get a paginated list of addresses")
    public Page<AddressDto> list(
            @Parameter(in = ParameterIn.QUERY, description = "Page number (0-based)", example = "0", required = false)
            @RequestParam(required = false, defaultValue = "0") int page,
            @Parameter(in = ParameterIn.QUERY, description = "Page size", example = "10", required = false) 
            @RequestParam(required = false, defaultValue = "10") int size,
            @Parameter(in = ParameterIn.QUERY, description = "Sort criteria (field,direction)", example = "street,asc", required = false)
            @RequestParam(required = false, defaultValue = "id,asc") String sort,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        
        // Parse sort parameter
        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        Sort.Direction direction = sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1]) 
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        
        Pageable customPageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return service.findAll(customPageable).map(mapper::toDto);
    }

    @GetMapping("/search")
    @Operation(summary = "Search addresses", description = "Search addresses by various criteria")
    public Page<AddressDto> search(
            @Parameter(in = ParameterIn.QUERY, description = "General search term", example = "Main Street")
            @RequestParam(required = false) String q,
            @Parameter(in = ParameterIn.QUERY, description = "City filter", example = "New York")
            @RequestParam(required = false) String city,
            @Parameter(in = ParameterIn.QUERY, description = "State filter", example = "NY")
            @RequestParam(required = false) String state,
            @Parameter(in = ParameterIn.QUERY, description = "Postal code filter", example = "10001")
            @RequestParam(required = false) String postalCode,
            @Parameter(in = ParameterIn.QUERY, description = "Page number", example = "0")
            @RequestParam(required = false, defaultValue = "0") int page,
            @Parameter(in = ParameterIn.QUERY, description = "Page size", example = "10")
            @RequestParam(required = false, defaultValue = "10") int size,
            @Parameter(in = ParameterIn.QUERY, description = "Sort criteria", example = "street,asc")
            @RequestParam(required = false, defaultValue = "id,asc") String sort) {
        
        // Parse sort parameter
        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        Sort.Direction direction = sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1]) 
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return service.search(q, city, state, postalCode, pageable).map(mapper::toDto);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get address by ID", description = "Retrieve a specific address by its ID")
    public AddressDto get(@PathVariable Long id) {
        return mapper.toDto(service.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create new address", description = "Create a new address")
    public ResponseEntity<AddressDto> create(@Valid @RequestBody AddressDto dto) {
        Address created = service.create(mapper.toEntity(dto));
        return ResponseEntity.created(URI.create("/api/v1/addresses/" + created.getId()))
                .body(mapper.toDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update address", description = "Update an existing address")
    public AddressDto update(@PathVariable Long id, @Valid @RequestBody AddressDto dto) {
        Address updated = service.update(id, mapper.toEntity(dto));
        return mapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete address", description = "Delete an address by ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
