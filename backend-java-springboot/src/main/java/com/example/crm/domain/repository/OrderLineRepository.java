package com.example.crm.domain.repository;

import com.example.crm.domain.model.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
    boolean existsByProductId(Long productId);
}
