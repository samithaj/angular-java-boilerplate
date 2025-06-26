package com.example.crm.service;

import com.example.crm.domain.model.Address;
import com.example.crm.domain.repository.AddressRepository;
import com.example.crm.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class AddressService {
    private final AddressRepository repository;

    public AddressService(AddressRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<Address> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public java.util.List<Address> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Address findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Address> search(String searchTerm, String city, String state, String postalCode, Pageable pageable) {
        // If all search parameters are empty, return all addresses
        if (!StringUtils.hasText(searchTerm) && !StringUtils.hasText(city) && 
            !StringUtils.hasText(state) && !StringUtils.hasText(postalCode)) {
            return findAll(pageable);
        }
        
        // If general search term is provided, use it
        if (StringUtils.hasText(searchTerm)) {
            return repository.findBySearchTerm(searchTerm.trim(), pageable);
        }
        
        // For specific field searches, use appropriate methods
        if (StringUtils.hasText(city)) {
            return repository.findByCityContainingIgnoreCase(city.trim(), pageable);
        }
        
        if (StringUtils.hasText(state)) {
            return repository.findByStateContainingIgnoreCase(state.trim(), pageable);
        }
        
        if (StringUtils.hasText(postalCode)) {
            return repository.findByPostalCodeContaining(postalCode.trim(), pageable);
        }
        
        return findAll(pageable);
    }

    public Address create(Address address) {
        return repository.save(address);
    }

    public Address update(Long id, Address updated) {
        Address existing = findById(id);
        existing.setStreet(updated.getStreet());
        existing.setCity(updated.getCity());
        existing.setState(updated.getState());
        existing.setPostalCode(updated.getPostalCode());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Address address = findById(id);
        repository.delete(address);
    }
}
