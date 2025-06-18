# 🤖 AI AGENT HANDBOOK

This short document explains **how to collaborate with an OpenAI Codex-style coding agent** on this monorepo (Angular + Spring Boot). Keep it in the project root so every future agent quickly understands the conventions.

---

## 1 – Repository Layout

```
angular-app/
  ├─ frontend-angular/         # Angular 20 (app shell, SSR, Material)
  └─ backend-java-springboot/  # Spring Boot 3.2 (REST API)
```

* **Frontend** is served at `http://localhost:4200/` via `npm start`.
* **Backend** is served at `http://localhost:8080/` via `mvn spring-boot:run`.

> Always run both in **two separate terminals** when testing end-to-end.

---

## 2 – API Contract Conventions

| Concern                | Rule                                                                                   |
|------------------------|----------------------------------------------------------------------------------------|
| Base path              | All REST endpoints are under **`/api/v1`** (versioned).                                |
| CORS                   | Allowed for any origin (`WebConfig#addCorsMappings`).                                   |
| Standard CRUD Pattern  | `GET /…`, `POST /…`, `PUT /…/{id}`, `DELETE /…/{id}`.                                   |
| Pagination             | Spring Data pageable params: `page`, `size`, `sort`.                                   |
| Error handling         | Backend returns RFC-7807 `application/problem+json`.                                   |

### How the Frontend Builds URLs

Front-end services **MUST** build URLs like:

```ts
const url = `${environment.backend}${API_BASE_URL}/addresses`;
// where environment.backend = "http://localhost:8080"
//       API_BASE_URL       = "/api/v1"
```

If you ever change the API version or server port:
1. Update `frontend-angular/src/environments/*.ts` (`backend` field).
2. Update `frontend-angular/src/app/shared/constants/api.constants.ts` (`API_BASE_URL`).
3. Run `npm start` again.

> 🛑 **Never** hard-code `http://localhost:8080` inside components or services.

---

## 3 – Agent Workflow Checklist

1. **Sync the Plan**   Open `plan.md` to understand the current phase and tasks.
2. **Run Tests First**  
   ```bash
   mvn clean test -q             # backend
   npm run lint && npm test -q   # frontend
   ```
3. **Implement Small Steps**   Follow the roadmap, committing tiny, green units.
4. **Coordinate Endpoints**    When adding a new resource in backend:
   * Add repository → service → controller → tests.
   * Add matching Angular service & module path (URL built as described above).
5. **Document**   Whenever a new convention arises, append it to this file.

---

## 4 – Common Pitfalls & Fixes

| Symptom                                     | Likely Cause & Fix                                              |
|---------------------------------------------|-----------------------------------------------------------------|
| `404 No static resource api/...`            | Front-end hit `/api/...` instead of `/api/v1/...` – update constants. |
| CORS `Access-Control-Allow-Origin` missing  | Backend path isn't under `/api/**` – adjust controller `@RequestMapping`. |
| Angular build error `mat-tab-nav-bar ...`   | Missing `MatTabsModule` import or `BrowserAnimationsModule`.         |
| `Could not resolve @angular/animations`     | Run `npm i @angular/animations@20`.                                |

---

## 5 – References

* OpenAI Codex intro – https://openai.com/index/introducing-codex/
* Spring Boot docs – https://docs.spring.io/spring-boot/docs/current/reference/html/
* Angular docs – https://angular.dev

Happy coding! ✨ 