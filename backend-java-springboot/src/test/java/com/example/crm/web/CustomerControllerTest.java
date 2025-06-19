package com.example.crm.web;

import com.example.crm.domain.model.Customer;
import com.example.crm.service.CustomerService;
import com.example.crm.web.dto.CustomerDto;
import com.example.crm.web.dto.CustomerMapper;
import com.example.crm.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
public class CustomerControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    CustomerService service;

    @MockBean
    CustomerMapper mapper;

    @Test
    void list_returnsOk() throws Exception {
        Customer customer = new Customer();
        Mockito.when(service.findAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(customer)));
        Mockito.when(mapper.toDto(any(Customer.class)))
                .thenReturn(new CustomerDto(1L, "John", "Doe", "john@doe.com", 1L));

        mockMvc.perform(get("/api/v1/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content").isArray());
    }

    @Test
    void create_unknownAddress_returnsNotFound() throws Exception {
        Mockito.when(service.create(any(Customer.class)))
                .thenThrow(new ResourceNotFoundException("Address not found"));
        String json = "{\"firstName\":\"A\",\"lastName\":\"B\",\"email\":\"a@b.com\",\"addressId\":99}";
        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_validationError_returnsBadRequest() throws Exception {
        String json = "{}";
        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }
}
