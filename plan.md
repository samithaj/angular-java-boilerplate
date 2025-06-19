# Simple Sales CRM – Implementation Roadmap (MySQL MVP)

> Goal: Deliver CRUD for Address, Customer, Product & Order storing data in a **MySQL 8** database, **without breaking the current build**.  Each step is an isolated, low-risk change that should compile & test green before moving forward.

---

## Phase 0 – Baseline & Tooling  *(same day)*
1. **Verify builds run**  
   • `mvn clean test` in `backend-java-springboot/`  
   • `npm run lint && npm run test` in `frontend-angular/`
2. **Add CI badge placeholder** to README (no pipeline yet).
3. **Run MySQL locally**  
   • With Docker: `docker run --name crm-db -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=crm -e MYSQL_USER=crm -e MYSQL_PASSWORD=crm -p 3306:3306 -d mysql:8`
   • Or use your own MySQL instance; update `spring.datasource.*` in `backend-java-springboot/src/main/resources/application.properties`.
4. Verify DB connectivity: `mvn -q -DskipTests spring-boot:run` then navigate to `/actuator/health`.

## Phase 1 – Backend Scaffolding *(½ day)*
1. **Project & Build Setup**
   • Ensure Spring Boot 3.4.x, Java 21, Maven (packaging = jar, not war)
   • Add required starters: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`
   • Add `mysql:mysql-connector-j` (runtime scope) - let Spring Boot manage version
   • Add `spring-boot-devtools` for hot-reload in development

2. **Package Structure** (hexagonal/clean architecture)
   ```
   com.example.crm
    ├─ config            # Global configuration (JPA, CORS, Jackson)
    ├─ domain
    │    ├─ model        # JPA entities
    │    └─ repository   # Spring Data interfaces
    ├─ service           # Business services
    ├─ web               # REST controllers
    │    └─ dto          # Request/Response DTOs
    └─ exception         # Centralized error handling
   ```

3. **Configuration Management**
   • Create profiles: `application-dev.yml`, `application-prod.yml`
   • Dev profile: `spring.jpa.hibernate.ddl-auto=update`, SQL logging enabled
   • Prod profile: `ddl-auto=none`, optimized settings
   • Use `@ConfigurationProperties` for custom settings

4. **Database Versioning with Flyway**
   • Add Flyway dependency
   • Create `src/main/resources/db/migration/V1__initial_schema.sql`
   • Define schema for Address, Customer, Product, Order tables
   • Enable only in prod; dev uses `ddl-auto=update` for flexibility

5. **Entity Model** (`domain.model`)
   • Create JPA entities with `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
   • Add audit fields with `@CreationTimestamp`/`@UpdateTimestamp`
   • Use Lombok: `@Getter @Setter @NoArgsConstructor @AllArgsConstructor`
   • Define relationships (`@ManyToOne`, `@OneToMany`) with proper fetch strategies

6. **Repositories** (`domain.repository`)
   • `interface AddressRepository extends JpaRepository<Address, Long> {}`
   • Keep simple - add custom queries only when needed

7. **DTOs & Mapping**
   • Create immutable DTOs as records in `web.dto`
   • Add MapStruct for entity-DTO mapping (`@Mapper(componentModel = "spring")`)
   • Include validation annotations on DTO fields

8. **Service Layer** (`service`)
   • Stateless `@Service` classes with constructor injection
   • `@Transactional` on public methods (read-only where appropriate)
   • Delegate to repositories, encapsulate business logic

9. **REST Controllers** (`web`)
   • Base path `/api/v1` via `@RequestMapping("/api/v1")`
   • Use `@RestController` with proper HTTP verbs
   • Support pagination with `Pageable` and `@PageableDefault`
   • Return `ResponseEntity` with correct status codes (201 for POST)

10. **Validation & Error Handling**
    • Enable Bean Validation on DTOs (`@Valid`, `@NotBlank`, `@Email`)
    • Create `@RestControllerAdvice` for global exception handling
    • Return standardized error responses (RFC 7807 Problem Details)

11. **Testing Foundation**
    • `@DataJpaTest` for repository tests
    • `@WebMvcTest` for controller tests with mocked services
    • Enable Testcontainers for integration tests (optional)

12. **Developer Experience**
    • Docker Compose file with MySQL service (port 3306)
    • Spring Boot Docker Compose support for auto-startup
    • Configure IDE for Lombok and DevTools

✅ Build & tests should pass; foundation ready for CRUD implementation.

## Phase 2 – Address Module *(1 day)*
1. **Service Implementation** (`AddressService`)
   • CRUD operations with proper exception handling
   • Custom `ResourceNotFoundException` for 404 scenarios
   • Pagination and sorting support via `Pageable`
   
2. **REST Controller** (`AddressController`)
   • `GET /api/v1/addresses` - List with pagination (`?page=0&size=20&sort=street,asc`)
   • `GET /api/v1/addresses/{id}` - Get by ID
   • `POST /api/v1/addresses` - Create (returns 201 with Location header)
   • `PUT /api/v1/addresses/{id}` - Update (returns 200)
   • `DELETE /api/v1/addresses/{id}` - Delete (returns 204)
   • Use `@Valid` for request body validation
   
3. **Response Standards**
   • Wrap responses in standard envelope: `{ "data": {...}, "meta": {...} }`
   • Include HATEOAS links for pagination (first, last, next, prev)
   • Return `ProblemDetail` for errors (RFC 7807)
   
4. **Testing**
   • `@WebMvcTest(AddressController.class)` with `@MockBean` service
   • Integration tests with `@SpringBootTest` and Testcontainers
   • Test validation, pagination, error scenarios
   
5. **Documentation**
   • Add OpenAPI/Swagger annotations
   • Generate API docs at `/swagger-ui.html`
   • Include request/response examples

✅ Address module fully functional with production-ready patterns.

## Phase 3 – Customer Module *(1 day)*


implement Customer Module (Backend + Frontend)  * 

### Backend (`/backend-java-springboot`)
1. Add `CustomerDto` in `crm.web.dto` mirroring fields `id, firstName, lastName, email, addressId` with Bean Validation (`@NotBlank`, `@Email`).
2. Create `Customer` entity in `crm.domain.model`:
   • Columns `first_name`, `last_name`, `email`  
   • `@ManyToOne(fetch = FetchType.LAZY)` to `Address`, FK `address_id` with index.  
   • Timestamps via `@CreationTimestamp` / `@UpdateTimestamp` identical to `Address`.
3. Declare `CustomerRepository extends JpaRepository<Customer, Long>` in `crm.domain.repository`.
4. Generate `CustomerMapper` (MapStruct, `componentModel = "spring"`).
5. Implement `CustomerService` following the pattern used in `AddressService`:  
   • `findAll(Pageable)`  
   • `findById(Long)` with 404  
   • `create`, `update`, `delete` incl. validation that referenced `Address` exists (otherwise throw `ResourceNotFoundException`).
6. Expose `CustomerController` at `/api/v1/customers` replicating the contract of `AddressController` (page, size, sort parameters). Return `Page<CustomerDto>`.
7. Extend `AddressService` with `List<Address> findAll()` (no pagination) for dropdown usage in the UI.
8. Write WebMvc tests (`@WebMvcTest(CustomerController.class)`) for:  
   • Happy path list & create  
   • `422` when unknown `addressId`  
   • Validation errors.
9. Verify OpenAPI UI `/swagger` now shows both Address and Customer endpoints.

### Frontend (`/frontend-angular`)
1. Generate feature module `customer` (`ng g m modules/features/customer --route=customers --module app.routes`).
2. Create `CustomerService` (`src/app/modules/features/customer/services/customer.service.ts`) using `HttpClient` pointing to `/api/v1/customers`.
3. Scaffold `CustomerListComponent` patterned after the Address table:  
   • `MatTable` columns: First, Last, Email, Street, City + actions.  
   • Integrate `MatPaginator` & `MatSort`.  
   • Call `CustomerService.list()` and map backend `Page<CustomerDto>` into table & paginator state.
4. Implement `CustomerDialogComponent` (Add/Edit):  
   • Reactive Form with validators (`Validators.required`, `Validators.email`).  
   • `mat-select` for Address (populate via `AddressService.getAll()`).  
   • On submit call `create` / `update` and close dialog returning the saved item.
5. Hook snackbar success/error handling in the shared `HttpErrorInterceptor`.
6. Add navigation tab in `MainLayoutComponent` and protect route with the existing `AuthGuard` placeholder.
7. Unit tests:  
   • Component renders list.  
   • Form validation.  
   • Service success flow with `HttpTestingController`.

✅ End-to-end: Creating, editing & deleting Customers works in UI; database rows update; all tests green.

maven repos have issue downloding


------------------------------
## Phase 4 – Product Module *(1 day)*
1. **Entities & Database Schema**  
   • Introduce the three-level hierarchy used in the Product screen:  
     – `ProductCategory` (**PK** `id`, `name`)  
     – `ProductSubCategory` (**PK** `id`, `name`, `modifiedDate`, **FK** `category_id`)  
     – `Product` (**PK** `id`, **FK** `subcategory_id`, `sku`, `name`, `description`, `price`, `stockQuantity`, `active`, etc.)  
   • Create JPA entities in `crm.domain.model` with relations **`ProductCategory` 1-N `ProductSubCategory` 1-N `Product`**.  
   • Add Flyway migration `V2__product_hierarchy.sql` to create tables, foreign keys (`product_subcategory_id` is the relation key), and indexes; follow up with `V3__product_constraints.sql` for the unique index on `Product.sku`.

2. **DTOs**  
   • `ProductCategoryDto` { `id`, `name` }  
   • `ProductSubCategoryDto` { `id`, `categoryId`, `name`, `modifiedDate` }  
   • Update `ProductDto` to include `subCategoryId` (instead of loose category fields) plus existing fields `sku`, `name`, `description`, `price`, `stockQuantity`, `active`.

3. **Business Rules**  
   • `sku` must be **UNIQUE** – duplicates return **409 Conflict**.  
   • `price` must be > 0 with scale ≤ 2.  
   • `stockQuantity` ≥ 0 (no negatives).  
   • A `Product` cannot be deleted if referenced by any `OrderLine`.  
   • A `ProductSubCategory` cannot be deleted while it still contains products.  
   • A `ProductCategory` cannot be deleted while it still contains sub-categories.  
   • Setting `active = false` prevents a product's use in new Orders.

4. **Service / Repository / Controller**  
   • Create Spring Data repositories and stateless services for **Category**, **SubCategory**, and **Product**.  
   • Expose REST endpoints:  
     – `/api/v1/product-categories`  
     – `/api/v1/product-subcategories` (supports `?categoryId=` filter for the top grid)  
     – `/api/v1/products` (supports `?subCategoryId=` filter for the bottom grid).  
   • `ProductService` enforces pricing & stock rules; `ProductSubCategoryService` and `ProductCategoryService` enforce hierarchical delete checks.

5. **Testing**  
   • Unit & integration tests for hierarchy constraints (duplicate `sku`, blocked deletes) and pricing/stock rules.  
   • WebMvc tests for filter endpoints and conflict scenarios.

## Phase 5 – Order Module *(2 days)*
1. **DTOs**  
   • `OrderHeaderDto` (id, orderDate, status, customerId, totalAmount **readonly**).  
   • `OrderLineDto` (productId, quantity, unitPrice **readonly**, lineTotal **readonly**) with nested validation.

2. **Business Rules**  
   • An Order must contain at least **one** OrderLine.  
   • `orderDate` cannot be in the future.  
   • Allowed `status` values: `NEW`, `PAID`, `SHIPPED`, `CANCELLED`.  
   • `customerId` must reference an existing Customer; deletion of a Customer with orders returns **409 Conflict**.  
   • Each line's `productId` must reference an **ACTIVE** Product with sufficient stock.  
   • `quantity` > 0 and ≤ current `stockQuantity`.  
   • `totalAmount` and `lineTotal` are calculated on the server; client-supplied values are ignored.  
   • Creating an order decrements product stock atomically; cancelling restores stock.  
   • Orders in `SHIPPED` status are **immutable** (no update or delete).  
   • Optimistic locking on `OrderHeader` & `Product` to handle concurrent stock updates.

3. **Service Layer**  
   • `OrderService` orchestrates header/lines persistence inside a single `@Transactional` block (`REQUIRES_NEW` isolation).  
   • Emits domain events `OrderCreated`, `OrderCancelled` for future integrations.

4. **Controller**  
   • Standard CRUD + `PATCH /api/v1/orders/{id}/status` endpoint for status transitions.

5. **Testing**  
   • Happy path create/pay/ship/cancel.  
   • Rule violations: future date, no lines, insufficient stock, duplicate order per customer/day, modify shipped order.

## Phase 6 – Frontend Scaffolding *(½ day)*
1. Install Angular Material + flex-layout.  
   `ng add @angular/material --theme=indigo-pink --typography --no-interactive`
2. Create **core layout**: `MainLayoutComponent` with toolbar & tabs (router-links): Address | Customer | Product | Order.
3. Route guard placeholder (no auth).
4. Mock-API base url constant (`/api`).

## Phase 7 – Address UI *(1 day)*
1. Generate `address` feature module with list + dialog components.
2. **List page** – MatTable with paginator & filter.  Fetch `GET /addresses`.
3. **Add/Edit dialog** – reactive form with validation; submit to service.
4. Snackbar success/error messages.

## Phase 8 – Customer UI *(1 day)*
1. Similar table setup. Address dropdown pulls from `/addresses`.  
2. Ensure optimistic UI update after save/delete.  
3. Client-side validation matching business rules: email required & valid, first/last required.  
4. Handle **409 Conflict** for duplicate email and display inline error.  
5. Disable **Delete** action for Customers with existing Orders (backend returns 409; UI shows snackbar).

## Phase 9 – Product UI *(1 day)*
1. List & dialog similar to Address.  
2. Form validators: `sku` required (async uniqueness check), `price` positive, `stockQuantity` non-negative.  
3. Display badge when product is inactive; disable "Add to Order" interactions.

## Phase 10 – Order UI *(2 days)*
1. Header table with date filter and status chips (`NEW`, `PAID`, `SHIPPED`, `CANCELLED`).  
2. **OrderDialogComponent**  
   • Step 1 – header fields (customer, date).  
   • Step 2 – order lines sub-table (add/edit/remove) with product autocomplete & quantity input.  
   • Live calculation of line totals and order total.  
   • Validation: at least one line, positive quantity, stock check on quantity change (calls `/products/{id}/stock`).  
3. On submit align to backend business rules; show snackbar for rule violations (e.g., insufficient stock, immutable status).  
4. Allow status change via action menu; disable illegal transitions in UI state machine.

## Phase 11 – Polish & Docs *(1 day)*
1. Lint fixes (Checkstyle & ESLint) + bump test coverage ≥ 70 %.
2. Add README sections for new setup & Swagger link.
3. Create GitHub Action (build & test only – docker skipped).

## Phase 12 – Handover *(½ day)*
1. Tag **v1.0.0**.  
2. Demo script / screenshots added to README.

---

### Future (v2 "Reports & Charts" – out of scope)
• Role-based auth & login
• Reporting & chart dashboards 