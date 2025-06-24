package com.example.crm.service;

import com.example.crm.domain.model.OrderHeader;
import com.example.crm.domain.model.OrderLine;
import com.example.crm.domain.model.Product;
import com.example.crm.domain.model.OrderStatus;
import com.example.crm.domain.repository.OrderHeaderRepository;
import com.example.crm.domain.repository.OrderLineRepository;
import com.example.crm.domain.repository.ProductRepository;
import com.example.crm.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class OrderService {
    private final OrderHeaderRepository headerRepo;
    private final OrderLineRepository lineRepo;
    private final ProductRepository productRepo;
    private final CustomerService customerService;

    public OrderService(OrderHeaderRepository headerRepo, OrderLineRepository lineRepo,
                        ProductRepository productRepo, CustomerService customerService) {
        this.headerRepo = headerRepo;
        this.lineRepo = lineRepo;
        this.productRepo = productRepo;
        this.customerService = customerService;
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<OrderHeader> findAll(org.springframework.data.domain.Pageable pageable) {
        return headerRepo.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public OrderHeader findById(Long id) {
        return headerRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    public OrderHeader create(OrderHeader order) {
        if (order.getLines() == null || order.getLines().isEmpty()) {
            throw new IllegalArgumentException("Order must contain lines");
        }
        order.setCustomer(customerService.findById(order.getCustomer().getId()));
        BigDecimal total = BigDecimal.ZERO;
        for (OrderLine line : order.getLines()) {
            Product product = productRepo.findById(line.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            if (product.getActive() != null && !product.getActive()) {
                throw new IllegalStateException("Product inactive");
            }
            if (product.getStockQuantity() == null || product.getStockQuantity() < line.getQuantity()) {
                throw new IllegalStateException("Insufficient stock");
            }
            product.setStockQuantity(product.getStockQuantity() - line.getQuantity());
            line.setProduct(product);
            line.setOrderHeader(order);
            line.setUnitPrice(product.getPrice());
            line.setLineTotal(product.getPrice().multiply(BigDecimal.valueOf(line.getQuantity())));
            total = total.add(line.getLineTotal());
        }
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.NEW);
        return headerRepo.save(order);
    }

    public void delete(Long id) {
        OrderHeader existing = findById(id);
        headerRepo.delete(existing);
    }
}
