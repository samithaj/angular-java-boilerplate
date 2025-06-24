package com.example.crm.web.dto;

import com.example.crm.domain.model.ProductSubCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductSubCategoryMapper {
    @Mapping(target = "categoryId", source = "category.id")
    ProductSubCategoryDto toDto(ProductSubCategory entity);

    @Mapping(target = "category.id", source = "categoryId")
    ProductSubCategory toEntity(ProductSubCategoryDto dto);
}
