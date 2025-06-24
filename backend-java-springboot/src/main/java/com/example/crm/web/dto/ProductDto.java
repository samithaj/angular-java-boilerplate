package com.example.crm.web.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductDto(
        Long id,
        Long subCategoryId,
        @NotBlank String sku,
        @NotBlank String name,
        String description,
        @DecimalMin("0.01") @Digits(integer = 10, fraction = 2) BigDecimal price,
        @PositiveOrZero Integer stockQuantity,
        Boolean active
) {}
