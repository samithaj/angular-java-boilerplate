package com.example.crm.web.dto;

import com.example.crm.domain.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "subCategoryId", source = "subCategory.id")
    ProductDto toDto(Product entity);

    @Mapping(target = "subCategory.id", source = "subCategoryId")
    Product toEntity(ProductDto dto);
}
