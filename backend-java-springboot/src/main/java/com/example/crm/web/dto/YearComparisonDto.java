package com.example.crm.web.dto;

import java.math.BigDecimal;

public record YearComparisonDto(
    String categoryName,
    Integer yearA,
    Long salesVolumeYearA,
    BigDecimal totalSalesYearA,
    Integer yearB,
    Long salesVolumeYearB,
    BigDecimal totalSalesYearB
) {
} 