package com.example.crm.web.dto;

import java.math.BigDecimal;

public record CategoryStatisticsDto(
        String categoryName,
        Long salesVolume,
        BigDecimal totalSales,
        BigDecimal percentage
) {} 