package com.example.crm.domain.repository;

import com.example.crm.domain.model.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
    @Query("SELECT a FROM Address a WHERE " +
           "LOWER(a.street) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.state) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.postalCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Address> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    Page<Address> findByCityContainingIgnoreCase(String city, Pageable pageable);
    
    Page<Address> findByStateContainingIgnoreCase(String state, Pageable pageable);
    
    Page<Address> findByPostalCodeContaining(String postalCode, Pageable pageable);
}
