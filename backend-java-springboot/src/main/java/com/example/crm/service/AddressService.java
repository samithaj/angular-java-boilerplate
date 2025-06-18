package com.example.crm.service;

import com.example.crm.domain.model.Address;
import com.example.crm.domain.repository.AddressRepository;
import com.example.crm.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Address findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
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
        Address existing = findById(id);
        repository.delete(existing);
    }
}
