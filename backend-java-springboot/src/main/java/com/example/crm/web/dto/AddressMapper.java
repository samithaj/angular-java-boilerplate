package com.example.crm.web.dto;

import com.example.crm.domain.model.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressDto toDto(Address entity);
    Address toEntity(AddressDto dto);
}
