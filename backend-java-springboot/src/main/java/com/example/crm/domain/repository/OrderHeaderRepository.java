package com.example.crm.domain.repository;

import com.example.crm.domain.model.OrderHeader;
import com.example.crm.domain.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

    @Query("SELECT pc.name as categoryName, " +
           "SUM(ol.quantity) as salesVolume, " +
           "SUM(ol.lineTotal) as totalSales " +
           "FROM OrderHeader oh " +
           "JOIN oh.lines ol " +
           "JOIN ol.product p " +
           "JOIN p.subCategory psc " +
           "JOIN psc.category pc " +
           "WHERE oh.orderDate BETWEEN :startDate AND :endDate " +
           "GROUP BY pc.id, pc.name " +
           "ORDER BY SUM(ol.lineTotal) DESC")
    List<Object[]> findSalesByCategory(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);

    @Query("SELECT psc.name as subcategoryName, " +
           "pc.name as categoryName, " +
           "FUNCTION('DATE_FORMAT', oh.orderDate, '%Y-%m') as month, " +
           "SUM(ol.quantity) as salesVolume, " +
           "SUM(ol.lineTotal) as totalSales " +
           "FROM OrderHeader oh " +
           "JOIN oh.lines ol " +
           "JOIN ol.product p " +
           "JOIN p.subCategory psc " +
           "JOIN psc.category pc " +
           "WHERE oh.orderDate BETWEEN :startDate AND :endDate " +
           "AND (:categoryName IS NULL OR pc.name = :categoryName) " +
           "GROUP BY psc.id, psc.name, pc.name, FUNCTION('DATE_FORMAT', oh.orderDate, '%Y-%m') " +
           "ORDER BY FUNCTION('DATE_FORMAT', oh.orderDate, '%Y-%m'), SUM(ol.lineTotal) DESC")
    List<Object[]> findSalesBySubcategory(@Param("categoryName") String categoryName,
                                          @Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);

    @Query("SELECT pc.name as categoryName, " +
           "YEAR(oh.orderDate) as year, " +
           "SUM(ol.quantity) as salesVolume, " +
           "SUM(ol.lineTotal) as totalSales " +
           "FROM OrderHeader oh " +
           "JOIN oh.lines ol " +
           "JOIN ol.product p " +
           "JOIN p.subCategory psc " +
           "JOIN psc.category pc " +
           "WHERE YEAR(oh.orderDate) IN (:yearA, :yearB) " +
           "GROUP BY pc.id, pc.name, YEAR(oh.orderDate) " +
           "ORDER BY pc.name, YEAR(oh.orderDate)")
    List<Object[]> findSalesByYearComparison(@Param("yearA") Integer yearA, 
                                             @Param("yearB") Integer yearB);
}
