package com.example.crm.web.dto;

import com.example.crm.domain.model.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "addressId", source = "address.id")
    CustomerDto toDto(Customer entity);

    @Mapping(target = "address.id", source = "addressId")
    Customer toEntity(CustomerDto dto);
}
