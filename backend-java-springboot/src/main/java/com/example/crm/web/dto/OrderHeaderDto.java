package com.example.crm.web.dto;

import com.example.crm.domain.model.OrderStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OrderHeaderDto(
        Long id,
        @NotNull @PastOrPresent LocalDate orderDate,
        @NotNull OrderStatus status,
        @NotNull Long customerId,
        @Valid List<OrderLineDto> lines,
        BigDecimal totalAmount
) {}
