package com.example.crm.web.dto;

import jakarta.validation.constraints.NotBlank;

public record ProductCategoryDto(
        Long id,
        @NotBlank String name
) {}
