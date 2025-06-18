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
1. Add `CustomerDto` fields & validation; FK to Address via `addressId` with `@ManyToOne` on the entity side.
2. Extend `AddressService` with `findAll()` for dropdown.
3. Implement `CustomerService`, `CustomerController`, tests (include FK validation via service).
4. Error when `addressId` unknown ➔ returns `422`.

## Phase 4 – Product Module *(½ day)*
1. Add numeric validations (2 dp) in `ProductDto`.
2. CRUD service/controller/tests similar to Address, backed by `ProductRepository`.

## Phase 5 – Order Module *(1½ day)*
1. Implement `OrderHeaderDto`, `OrderLineDto` with nested validation.
2. `OrderService` persists header & lines atomically using `@Transactional` and two repositories (`OrderHeaderRepository`, `OrderLineRepository`).
3. `OrderController` CRUD + `/api/orders/{id}/lines` sub-resource.
4. Pagination & search by `orderDate` range via Spring Data `Specification` or custom JPQL.
5. Tests for create + invalid FK scenarios.

---

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
1. Similar table setup.  Address dropdown pulls from `/addresses`.
2. Ensure optimistic UI update after save/delete.

## Phase 9 – Product UI *(½ day)*
Implement list & dialog similar to Address, numeric inputs with `mat-numeric` directive.

## Phase 10 – Order UI *(1½ day)*
1. Header table with date filter.
2. **OrderDialogComponent**  
   • Step 1 – header fields  
   • Step 2 – order lines sub-table (add/edit/remove).  
3. Submit combined payload to backend; show inline form errors.

---

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