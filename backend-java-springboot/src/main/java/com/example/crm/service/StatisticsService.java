package com.example.crm.service;

import com.example.crm.domain.repository.OrderHeaderRepository;
import com.example.crm.web.dto.CategoryStatisticsDto;
import com.example.crm.web.dto.SubcategoryStatisticsDto;
import com.example.crm.web.dto.MonthlySalesDto;
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
} 