package com.example.crm.web;

import com.example.crm.domain.model.Customer;
import com.example.crm.service.CustomerService;
import com.example.crm.web.dto.CustomerDto;
import com.example.crm.web.dto.CustomerMapper;
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
@RequestMapping("/api/v1/customers")
@Tag(name = "Customer", description = "Customer management API")
public class CustomerController {

    private final CustomerService service;
    private final CustomerMapper mapper;

    public CustomerController(CustomerService service, CustomerMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    @Operation(summary = "List all customers", description = "Get a paginated list of customers")
    public Page<CustomerDto> list(
            @Parameter(in = ParameterIn.QUERY, description = "Page number (0-based)", example = "0", required = false)
            @RequestParam(required = false, defaultValue = "0") int page,
            @Parameter(in = ParameterIn.QUERY, description = "Page size", example = "10", required = false)
            @RequestParam(required = false, defaultValue = "10") int size,
            @Parameter(in = ParameterIn.QUERY, description = "Sort criteria (field,direction)", example = "lastName,asc", required = false)
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
    @Operation(summary = "Search customers", description = "Search customers by various criteria")
    public Page<CustomerDto> search(
            @Parameter(in = ParameterIn.QUERY, description = "General search term", example = "John Doe")
            @RequestParam(required = false) String q,
            @Parameter(in = ParameterIn.QUERY, description = "Email filter", example = "john@example.com")
            @RequestParam(required = false) String email,
            @Parameter(in = ParameterIn.QUERY, description = "Name filter", example = "John")
            @RequestParam(required = false) String name,
            @Parameter(in = ParameterIn.QUERY, description = "City filter", example = "New York")
            @RequestParam(required = false) String city,
            @Parameter(in = ParameterIn.QUERY, description = "Page number", example = "0")
            @RequestParam(required = false, defaultValue = "0") int page,
            @Parameter(in = ParameterIn.QUERY, description = "Page size", example = "10")
            @RequestParam(required = false, defaultValue = "10") int size,
            @Parameter(in = ParameterIn.QUERY, description = "Sort criteria", example = "lastName,asc")
            @RequestParam(required = false, defaultValue = "id,asc") String sort) {
        
        // Parse sort parameter
        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        Sort.Direction direction = sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1]) 
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return service.search(q, email, name, city, pageable).map(mapper::toDto);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID", description = "Retrieve a specific customer by their ID")
    public CustomerDto get(@PathVariable Long id) {
        return mapper.toDto(service.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create new customer", description = "Create a new customer")
    public ResponseEntity<CustomerDto> create(@Valid @RequestBody CustomerDto dto) {
        Customer created = service.create(mapper.toEntity(dto));
        return ResponseEntity.created(URI.create("/api/v1/customers/" + created.getId()))
                .body(mapper.toDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer", description = "Update an existing customer")
    public CustomerDto update(@PathVariable Long id, @Valid @RequestBody CustomerDto dto) {
        Customer updated = service.update(id, mapper.toEntity(dto));
        return mapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer", description = "Delete a customer by ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
