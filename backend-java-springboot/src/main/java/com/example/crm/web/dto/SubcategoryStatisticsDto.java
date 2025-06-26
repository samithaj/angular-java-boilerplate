package com.example.crm.web.dto;

import java.math.BigDecimal;
import java.util.List;

public record SubcategoryStatisticsDto(
        String subcategoryName,
        String categoryName,
        List<MonthlySalesDto> monthlySales
) {} 