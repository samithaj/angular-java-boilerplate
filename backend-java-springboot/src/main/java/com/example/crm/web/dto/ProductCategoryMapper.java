package com.example.crm.web.dto;

import com.example.crm.domain.model.ProductCategory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper {
    ProductCategoryDto toDto(ProductCategory entity);
    ProductCategory toEntity(ProductCategoryDto dto);
}
