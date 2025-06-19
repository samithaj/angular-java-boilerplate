package com.example.crm.service;

import com.example.crm.domain.model.Customer;
import com.example.crm.domain.model.Address;
import com.example.crm.domain.repository.CustomerRepository;
import com.example.crm.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    public Customer create(Customer customer) {
        if (customer.getAddress() != null) {
            Address addr = addressService.findById(customer.getAddress().getId());
            customer.setAddress(addr);
        }
        return repository.save(customer);
    }

    public Customer update(Long id, Customer updated) {
        Customer existing = findById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        if (updated.getAddress() != null) {
            Address addr = addressService.findById(updated.getAddress().getId());
            existing.setAddress(addr);
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        Customer existing = findById(id);
        repository.delete(existing);
    }
}
