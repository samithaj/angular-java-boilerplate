package com.example.crm.web.dto;

import java.math.BigDecimal;

public record DepartmentSalaryDto(
    String departmentName,
    Integer employeeCount,
    BigDecimal totalSalary,
    BigDecimal averageSalary,
    BigDecimal minSalary,
    BigDecimal maxSalary
) {
} 