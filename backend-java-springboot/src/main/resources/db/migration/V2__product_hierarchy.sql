CREATE TABLE product_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE product_subcategories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

ALTER TABLE products
    ADD COLUMN subcategory_id BIGINT,
    ADD COLUMN sku VARCHAR(50),
    ADD COLUMN description TEXT,
    ADD COLUMN stock_quantity INT DEFAULT 0,
    ADD COLUMN active BOOLEAN DEFAULT TRUE,
    MODIFY name VARCHAR(255) NOT NULL,
    MODIFY price DECIMAL(10,2) NOT NULL,
    ADD CONSTRAINT fk_product_subcategory FOREIGN KEY (subcategory_id) REFERENCES product_subcategories(id);

CREATE INDEX idx_subcategory_category ON product_subcategories(category_id);
CREATE INDEX idx_product_subcategory ON products(subcategory_id);
