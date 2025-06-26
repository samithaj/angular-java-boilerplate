package com.example.crm.domain.repository;

import com.example.crm.domain.model.OrderHeader;
import com.example.crm.domain.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface OrderHeaderRepository extends JpaRepository<OrderHeader, Long> {
    
    Page<OrderHeader> findByStatus(OrderStatus status, Pageable pageable);
    
    Page<OrderHeader> findByCustomerId(Long customerId, Pageable pageable);
    
    @Query("SELECT o FROM OrderHeader o WHERE " +
           "o.orderDate BETWEEN :startDate AND :endDate")
    Page<OrderHeader> findByOrderDateBetween(@Param("startDate") LocalDate startDate, 
                                             @Param("endDate") LocalDate endDate, 
                                             Pageable pageable);
    
    @Query("SELECT o FROM OrderHeader o JOIN o.customer c WHERE " +
           "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :customerName, '%'))")
    Page<OrderHeader> findByCustomerNameContaining(@Param("customerName") String customerName, Pageable pageable);
    
    @Query("SELECT o FROM OrderHeader o WHERE " +
           "(:customerId IS NULL OR o.customer.id = :customerId) AND " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:startDate IS NULL OR o.orderDate >= :startDate) AND " +
           "(:endDate IS NULL OR o.orderDate <= :endDate)")
    Page<OrderHeader> findBySearchCriteria(@Param("customerId") Long customerId,
                                           @Param("status") OrderStatus status,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate,
                                           Pageable pageable);
}
