package com.example.crm.web.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

public record ProductSubCategoryDto(
        Long id,
        Long categoryId,
        @NotBlank String name,
        Instant modifiedDate
) {}
