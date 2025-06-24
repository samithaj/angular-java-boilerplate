package com.example.crm.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record OrderLineDto(
        @NotNull Long productId,
        @NotNull @Min(1) Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {}
