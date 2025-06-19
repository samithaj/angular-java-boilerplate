package com.example.crm.web;

import com.example.crm.domain.model.Product;
import com.example.crm.service.ProductService;
import com.example.crm.web.dto.ProductDto;
import com.example.crm.web.dto.ProductMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    ProductService service;

    @MockBean
    ProductMapper mapper;

    @Test
    void list_filterBySubCategory_returnsOk() throws Exception {
        Product product = new Product();
        Mockito.when(service.findBySubCategoryId(anyLong())).thenReturn(List.of(product));
        Mockito.when(mapper.toDto(any(Product.class)))
                .thenReturn(new ProductDto(1L,1L,"SKU","Name",null,new BigDecimal("1.00"),1,true));

        mockMvc.perform(get("/api/v1/products?subCategoryId=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content").isArray());
    }
}
