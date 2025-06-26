package com.example.crm.web.dto;

import java.math.BigDecimal;

public record MonthlySalesDto(
        String month,
        BigDecimal totalSales,
        Long salesVolume
) {} 