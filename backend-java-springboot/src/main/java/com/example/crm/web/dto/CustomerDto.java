package com.example.crm.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CustomerDto(
        Long id,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        Long addressId
) {}
