package com.example.crm.service;

import com.example.crm.domain.model.Product;
import com.example.crm.domain.repository.OrderRepository;
import com.example.crm.domain.repository.ProductRepository;
import com.example.crm.exception.DuplicateSkuException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ProductServiceTest {

    ProductRepository productRepository = mock(ProductRepository.class);
    ProductSubCategoryService subCategoryService = mock(ProductSubCategoryService.class);
    OrderRepository orderRepository = mock(OrderRepository.class);

    ProductService service = new ProductService(productRepository, subCategoryService, orderRepository);

    @Test
    void create_duplicateSku_throwsException() {
        Product p = new Product();
        p.setSku("ABC");
        p.setName("Test");
        p.setPrice(new BigDecimal("1.00"));
        p.setStockQuantity(1);

        when(productRepository.existsBySku("ABC")).thenReturn(true);

        assertThrows(DuplicateSkuException.class, () -> service.create(p));
    }
}
