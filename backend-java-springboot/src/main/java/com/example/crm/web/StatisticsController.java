package com.example.crm.web;

import com.example.crm.service.StatisticsService;
import com.example.crm.web.dto.CategoryStatisticsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/statistics")
@Tag(name = "Statistics", description = "Sales statistics and analytics API")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/category-sales")
    @Operation(summary = "Get category sales statistics", 
               description = "Get sales statistics grouped by product category for a date range")
    public List<CategoryStatisticsDto> getCategorySalesStatistics(
            @Parameter(in = ParameterIn.QUERY, description = "Start date (YYYY-MM-DD)", example = "2013-01-01", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @Parameter(in = ParameterIn.QUERY, description = "End date (YYYY-MM-DD)", example = "2013-12-31", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        
        return statisticsService.getCategorySalesStatistics(from, to);
    }
} 