# Simple Sales CRM – Implementation Roadmap (PostgreSQL MVP)

> Goal: Deliver CRUD for Address, Customer, Product & Order storing data in a **PostgreSQL 15** database, **without breaking the current build**.  Each step is an isolated, low-risk change that should compile & test green before moving forward.

---

## Phase 0 – Baseline & Tooling  *(same day)*
1. **Verify builds run**  
   • `mvn clean test` in `backend-java-springboot/`  
   • `npm run lint && npm run test` in `frontend-angular/`
2. **Add CI badge placeholder** to README (no pipeline yet).
3. **Run PostgreSQL locally**  
   • With Docker: `docker run --name crm-db -e POSTGRES_USER=crm -e POSTGRES_PASSWORD=crm -e POSTGRES_DB=crm -p 5432:5432 -d postgres:15`
   • Or use your own Postgres instance; update `spring.datasource.*` in `backend-java-springboot/src/main/resources/application.properties`.
4. Verify DB connectivity: `mvn -q -DskipTests spring-boot:run` then navigate to `/actuator/health`.

## Phase 1 – Backend Scaffolding *(½ day)*
1. Create package `com.example.crm` to isolate new code.  Leave existing demo controllers untouched.
2. Add **DTO skeletons** (`AddressDto`, `CustomerDto`, `ProductDto`, `OrderHeaderDto`, `OrderLineDto`) under `crm.dto` – equals/hashCode only.
3. Create **JPA entities** mirroring DTOs in `crm.entity` with `@Table` mapping.
4. Create **Spring Data repositories** (`AddressRepository extends JpaRepository<Address, Long>`, …).
5. Add **service layer** stubs delegating to repositories – **no validation yet**.
6. Add central `RestExceptionHandler` returning `422` JSON for `ConstraintViolationException`.
7. Register a root path `/api` with `@RequestMapping("/api")` super-class to prefix future controllers.
8. Optional: Add Flyway migration `V1__initial.sql` to create tables automatically in dev.

✅ Build & tests should still pass (no endpoints wired).

## Phase 2 – Address Module *(1 day)*
1. Implement `AddressService` CRUD on top of `AddressRepository` (extends `JpaRepository`).
2. Implement `AddressController`  
   • `GET /api/addresses?page&size&sort`  
   • `POST/PUT/DELETE` with Bean Validation (`@NotBlank`, etc.).  
   • Use Spring Data `Pageable` (`page`, `size`, `sort`) and return `Page<AddressDto>`.
3. Add **unit tests** (WebMvcTest) for happy paths.
4. Generate OpenAPI docs via springdoc (`/swagger`).

✅ Existing demo endpoints remain; new tests green.

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