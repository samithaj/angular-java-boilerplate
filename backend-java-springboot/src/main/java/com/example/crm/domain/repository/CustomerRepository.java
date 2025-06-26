package com.example.crm.domain.repository;

import com.example.crm.domain.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Customer> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    Page<Customer> findByEmailContainingIgnoreCase(String email, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Customer> findByFullNameContaining(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT c FROM Customer c JOIN c.address a WHERE " +
           "LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%'))")
    Page<Customer> findByAddressCityContaining(@Param("city") String city, Pageable pageable);
    
    boolean existsByEmailIgnoreCase(String email);
}
