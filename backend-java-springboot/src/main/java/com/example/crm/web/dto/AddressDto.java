package com.example.crm.web.dto;

import jakarta.validation.constraints.NotBlank;

public record AddressDto(
        Long id,
        @NotBlank String street,
        @NotBlank String city,
        String state,
        @NotBlank String postalCode
) {}
