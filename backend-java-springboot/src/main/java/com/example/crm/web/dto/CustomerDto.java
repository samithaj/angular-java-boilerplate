package com.example.crm.web.dto;

public record CustomerDto(
        Long id,
        String firstName,
        String lastName,
        String email,
        Long addressId
) {}
