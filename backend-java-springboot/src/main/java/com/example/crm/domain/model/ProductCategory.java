package com.example.crm.domain.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "product_categories")
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductSubCategory> subCategories;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<ProductSubCategory> getSubCategories() { return subCategories; }
    public void setSubCategories(List<ProductSubCategory> subCategories) { this.subCategories = subCategories; }
}
