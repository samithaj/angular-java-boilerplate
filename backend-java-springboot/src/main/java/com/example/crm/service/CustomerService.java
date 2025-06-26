package com.example.crm.service;

import com.example.crm.domain.model.Customer;
import com.example.crm.domain.model.Address;
import com.example.crm.domain.repository.CustomerRepository;
import com.example.crm.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class CustomerService {
    private final CustomerRepository repository;
    private final AddressService addressService;

    public CustomerService(CustomerRepository repository, AddressService addressService) {
        this.repository = repository;
        this.addressService = addressService;
    }

    @Transactional(readOnly = true)
    public Page<Customer> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Customer findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Customer> search(String searchTerm, String email, String name, String city, Pageable pageable) {
        // If all search parameters are empty, return all customers
        if (!StringUtils.hasText(searchTerm) && !StringUtils.hasText(email) && 
            !StringUtils.hasText(name) && !StringUtils.hasText(city)) {
            return findAll(pageable);
        }
        
        // If general search term is provided, use it
        if (StringUtils.hasText(searchTerm)) {
            return repository.findBySearchTerm(searchTerm.trim(), pageable);
        }
        
        // For specific field searches, use appropriate methods
        if (StringUtils.hasText(email)) {
            return repository.findByEmailContainingIgnoreCase(email.trim(), pageable);
        }
        
        if (StringUtils.hasText(name)) {
            return repository.findByFullNameContaining(name.trim(), pageable);
        }
        
        if (StringUtils.hasText(city)) {
            return repository.findByAddressCityContaining(city.trim(), pageable);
        }
        
        return findAll(pageable);
    }

    public Customer create(Customer customer) {
        // Validate email uniqueness
        if (StringUtils.hasText(customer.getEmail()) && 
            repository.existsByEmailIgnoreCase(customer.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + customer.getEmail());
        }
        
        // Validate address exists if provided
        if (customer.getAddress() != null && customer.getAddress().getId() != null) {
            addressService.findById(customer.getAddress().getId());
        }
        
        return repository.save(customer);
    }

    public Customer update(Long id, Customer updated) {
        Customer existing = findById(id);
        
        // Validate email uniqueness if changed
        if (StringUtils.hasText(updated.getEmail()) && 
            !updated.getEmail().equalsIgnoreCase(existing.getEmail()) &&
            repository.existsByEmailIgnoreCase(updated.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + updated.getEmail());
        }
        
        // Validate address exists if provided
        if (updated.getAddress() != null && updated.getAddress().getId() != null) {
            addressService.findById(updated.getAddress().getId());
        }
        
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Customer customer = findById(id);
        repository.delete(customer);
    }
}
