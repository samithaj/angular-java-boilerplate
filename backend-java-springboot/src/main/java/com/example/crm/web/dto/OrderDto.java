package com.example.crm.web.dto;

import java.time.Instant;

public record OrderDto(
        Long id,
        Long customerId,
        Long productId,
        Integer quantity,
        Instant createdAt
) {}
