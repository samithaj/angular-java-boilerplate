package com.example.crm.service;

import com.example.crm.domain.repository.OrderHeaderRepository;
import com.example.crm.web.dto.CategoryStatisticsDto;
import com.example.crm.web.dto.SubcategoryStatisticsDto;
import com.example.crm.web.dto.MonthlySalesDto;
import com.example.crm.web.dto.YearComparisonDto;
import com.example.crm.web.dto.DepartmentSalaryDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StatisticsService {
    
    private final OrderHeaderRepository orderHeaderRepository;

    public StatisticsService(OrderHeaderRepository orderHeaderRepository) {
        this.orderHeaderRepository = orderHeaderRepository;
    }

    public List<CategoryStatisticsDto> getCategorySalesStatistics(LocalDate startDate, LocalDate endDate) {
        List<Object[]> rawData = orderHeaderRepository.findSalesByCategory(startDate, endDate);
        
        // Calculate total sales for percentage calculation
        BigDecimal totalSales = rawData.stream()
                .map(row -> (BigDecimal) row[2])
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return rawData.stream()
                .map(row -> {
                    String categoryName = (String) row[0];
                    Long salesVolume = ((Number) row[1]).longValue();
                    BigDecimal categoryTotalSales = (BigDecimal) row[2];
                    
                    // Calculate percentage
                    BigDecimal percentage = totalSales.compareTo(BigDecimal.ZERO) > 0 
                            ? categoryTotalSales.divide(totalSales, 4, RoundingMode.HALF_UP)
                                                .multiply(new BigDecimal("100"))
                                                .setScale(2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;
                    
                    return new CategoryStatisticsDto(
                            categoryName,
                            salesVolume,
                            categoryTotalSales,
                            percentage
                    );
                })
                .toList();
    }

    public List<SubcategoryStatisticsDto> getSubcategorySalesStatistics(String categoryName, LocalDate startDate, LocalDate endDate) {
        List<Object[]> rawData = orderHeaderRepository.findSalesBySubcategory(categoryName, startDate, endDate);
        
        // Group by subcategory and category
        Map<String, Map<String, List<Object[]>>> groupedData = rawData.stream()
                .collect(Collectors.groupingBy(
                    row -> (String) row[0], // subcategoryName
                    Collectors.groupingBy(row -> (String) row[1]) // categoryName
                ));
        
        return groupedData.entrySet().stream()
                .flatMap(subcategoryEntry -> {
                    String subcategoryName = subcategoryEntry.getKey();
                    
                    return subcategoryEntry.getValue().entrySet().stream()
                            .map(categoryEntry -> {
                                String category = categoryEntry.getKey();
                                List<Object[]> monthlyData = categoryEntry.getValue();
                                
                                List<MonthlySalesDto> monthlySales = monthlyData.stream()
                                        .map(row -> new MonthlySalesDto(
                                                (String) row[2], // month
                                                (BigDecimal) row[4], // totalSales
                                                ((Number) row[3]).longValue() // salesVolume
                                        ))
                                        .toList();
                                
                                return new SubcategoryStatisticsDto(
                                        subcategoryName,
                                        category,
                                        monthlySales
                                );
                            });
                })
                .toList();
    }

    public List<YearComparisonDto> getYearComparisonStatistics(Integer yearA, Integer yearB) {
        List<Object[]> rawData = orderHeaderRepository.findSalesByYearComparison(yearA, yearB);
        
        // Group by category name to combine data from both years
        Map<String, Map<Integer, Object[]>> groupedData = rawData.stream()
                .collect(Collectors.groupingBy(
                    row -> (String) row[0], // categoryName
                    Collectors.toMap(
                        row -> (Integer) row[1], // year
                        row -> row
                    )
                ));
        
        return groupedData.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    Map<Integer, Object[]> yearData = entry.getValue();
                    
                    Object[] dataYearA = yearData.get(yearA);
                    Object[] dataYearB = yearData.get(yearB);
                    
                    Long salesVolumeYearA = dataYearA != null ? ((Number) dataYearA[2]).longValue() : 0L;
                    BigDecimal totalSalesYearA = dataYearA != null ? (BigDecimal) dataYearA[3] : BigDecimal.ZERO;
                    
                    Long salesVolumeYearB = dataYearB != null ? ((Number) dataYearB[2]).longValue() : 0L;
                    BigDecimal totalSalesYearB = dataYearB != null ? (BigDecimal) dataYearB[3] : BigDecimal.ZERO;
                    
                    return new YearComparisonDto(
                            categoryName,
                            yearA,
                            salesVolumeYearA,
                            totalSalesYearA,
                            yearB,
                            salesVolumeYearB,
                            totalSalesYearB
                    );
                })
                .toList();
    }

    public List<DepartmentSalaryDto> getDepartmentSalaryStatistics(String metric, LocalDate startDate, LocalDate endDate) {
        // Mock data for demonstration - in a real application, this would query Employee entities
        // and calculate metrics based on actual payroll data within the date range
        
        return List.of(
            new DepartmentSalaryDto(
                "Sales",
                45,
                new BigDecimal("2250000.00"), // total salary
                new BigDecimal("50000.00"),   // average salary 
                new BigDecimal("35000.00"),   // min salary
                new BigDecimal("85000.00")    // max salary
            ),
            new DepartmentSalaryDto(
                "Engineering",
                32,
                new BigDecimal("2240000.00"),
                new BigDecimal("70000.00"),
                new BigDecimal("55000.00"),
                new BigDecimal("120000.00")
            ),
            new DepartmentSalaryDto(
                "Marketing",
                18,
                new BigDecimal("990000.00"),
                new BigDecimal("55000.00"),
                new BigDecimal("40000.00"),
                new BigDecimal("95000.00")
            ),
            new DepartmentSalaryDto(
                "HR",
                12,
                new BigDecimal("660000.00"),
                new BigDecimal("55000.00"),
                new BigDecimal("45000.00"),
                new BigDecimal("75000.00")
            ),
            new DepartmentSalaryDto(
                "Finance",
                8,
                new BigDecimal("560000.00"),
                new BigDecimal("70000.00"),
                new BigDecimal("50000.00"),
                new BigDecimal("110000.00")
            )
        );
    }
} 