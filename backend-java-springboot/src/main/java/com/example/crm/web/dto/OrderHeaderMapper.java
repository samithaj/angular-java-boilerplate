package com.example.crm.web.dto;

import com.example.crm.domain.model.Customer;
import com.example.crm.domain.model.OrderHeader;
import com.example.crm.domain.model.OrderLine;
import com.example.crm.domain.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderHeaderMapper {
    @Mapping(target = "customerId", source = "customer.id")
    OrderHeaderDto toDto(OrderHeader entity);

    @Mapping(target = "customer", expression = "java(customerFromId(dto.customerId()))")
    OrderHeader toEntity(OrderHeaderDto dto);

    default Customer customerFromId(Long id) {
        if (id == null) return null;
        Customer c = new Customer();
        c.setId(id);
        return c;
    }

    @Mapping(target = "productId", source = "product.id")
    OrderLineDto toDto(OrderLine line);

    @Mapping(target = "product", expression = "java(productFromId(dto.productId()))")
    OrderLine toEntity(OrderLineDto dto);

    default Product productFromId(Long id) {
        if (id == null) return null;
        Product p = new Product();
        p.setId(id);
        return p;
    }
}
