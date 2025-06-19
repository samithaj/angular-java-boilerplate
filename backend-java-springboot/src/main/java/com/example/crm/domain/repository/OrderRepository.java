package com.example.crm.domain.repository;

import com.example.crm.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByProductId(Long productId);
}
