# Fullstack Application  : Angular 20, Node.js and Java 21

<img src="./ui/ganatan-about-github.png" align="right" width="140" height="140" alt="logo ganatan">

## 🚀 Project Goals
- ✅ Complete frontend / backend stack  
- ✅ CI/CD and Docker compatibility  
- ✅ Simple deployment (Docker optional)  
- ✅ Isolated and testable components  
---

**👉 Version française disponible ici** : [![Français](./ui/version-fr.png)](./README.md)

---

| Component              | Description                                                   |
|------------------------|---------------------------------------------------------------|
| **Frontend**           | Angular 20 — SPA with Routing, SSR, PWA, SEO                  |
| **Backend JavaScript (ESM)**   | Node.js 22 + Express — REST API with mocked data or database   |
| **Backend JavaScript (CJS)**   | CJS variant, same structure as ESM version                   |
| **Backend TypeScript** | Node.js 22 + TypeScript — Typed REST API with data or database |
| **Backend Java Spring Boot** | Java 21 + Spring Boot — Simple and modern REST API              |

---

## 🔧 Continuous Integration (CI)

| Project                      | CI Badge |
|-----------------------------|----------|
| Frontend Angular            | [![Frontend Angular CI](https://github.com/ganatan/angular-app/actions/workflows/frontend-angular.yml/badge.svg?branch=master)](https://github.com/ganatan/angular-app/actions/workflows/frontend-angular.yml) |
| Backend JavaScript (ESM)    | [![Backend JavaScript ESM CI](https://github.com/ganatan/angular-app/actions/workflows/backend-javascript-esm.yml/badge.svg?branch=master)](https://github.com/ganatan/angular-app/actions/workflows/backend-javascript-esm.yml) |
| Backend JavaScript (CJS)    | [![Backend JavaScript CJS CI](https://github.com/ganatan/angular-app/actions/workflows/backend-javascript-cjs.yml/badge.svg?branch=master)](https://github.com/ganatan/angular-app/actions/workflows/backend-javascript-cjs.yml) |
| Backend TypeScript          | [![Backend TypeScript CI](https://github.com/ganatan/angular-app/actions/workflows/backend-typescript.yml/badge.svg?branch=master)](https://github.com/ganatan/angular-app/actions/workflows/backend-typescript.yml) |
| Backend Java Spring Boot    | [![Backend Spring Boot CI](https://github.com/ganatan/angular-app/actions/workflows/backend-java-springboot.yml/badge.svg?branch=master)](https://github.com/ganatan/angular-app/actions/workflows/backend-java-springboot.yml) |

---

## 📦 Docker Images

| Component                   | Docker Badge |
|----------------------------|---------------|
| Backend JavaScript (ESM)     | [![Docker Image Version - Backend JavaScript ESM](https://img.shields.io/docker/v/ganatan/backend-javascript-esm?label=Backend%20JavaScript%20Docker%20esm&logo=docker&sort=semver)](https://hub.docker.com/r/ganatan/backend-javascript-esm) |
| Backend JavaScript (CJS)     | [![Docker Image Version - Backend JavaScript CJS](https://img.shields.io/docker/v/ganatan/backend-javascript-cjs?label=Backend%20JavaScript%20Docker%20cjs&logo=docker&sort=semver)](https://hub.docker.com/r/ganatan/backend-javascript-cjs) |
| Backend TypeScript           | [![Docker Image Version - Backend TypeScript](https://img.shields.io/docker/v/ganatan/backend-typescript?label=Backend%20TypeScript%20Docker&logo=docker&sort=semver)](https://hub.docker.com/r/ganatan/backend-typescript) |
| Frontend Angular             | [![Docker Image Version - Frontend Angular](https://img.shields.io/docker/v/ganatan/frontend-angular?label=Frontend%20Angular%20Docker&logo=docker&sort=semver)](https://hub.docker.com/r/ganatan/frontend-angular) |


## 📦 Tech Stack

![Angular](https://img.shields.io/badge/angular-20-red)
![Node](https://img.shields.io/badge/node-22.x-blue)
![Java](https://img.shields.io/badge/java-21-brightgreen)


## 📚 Table of Contents

- [Continuous Integration (CI)](#-continuous-integration-ci)
- [Docker Images](#-docker-images)
- [Tech Stack](#-tech-stack)
- [Live Demo](#-live-demo)
- [Project Structure](#-project-structure)
- [Frontend Configuration (Angular)](#-frontend-configuration-angular)
- [Backend Configuration](#-backend-configuration)
- [Exposed APIs](#-exposed-apis)
- [Quick Start](#-quick-start)
- [Deployment with Docker](#-deployment-with-docker)
- [Author](#-author)
- [Documentation](#-documentation)
---

## 🌐 Live Demo

🔗 [Check out the Angular demo](https://angular.ganatan.com)

<p align="center">
  <a href="https://angular.ganatan.com/">
    <img src="https://media.giphy.com/media/9BuBBLc7keCgRojp92/giphy.gif" alt="Angular 20 Example Application"/>
  </a>
</p>

---

## 📁 Project Structure

### 🧩 Frontend

- **`frontend-angular`**  
  Angular 19 app (with Routing, Lazy loading, SSR, PWA, SEO)


---

## 🔧 Frontend Configuration (Angular)

In `frontend-angular/src/environments/environment.ts`:

```ts
useDatabase: false,
backend: 'http://localhost:3000',
```

| `useDatabase` | Mode                                  |
|---------------|---------------------------------------|
| `false`       | **Mocked** data handled in frontend   |
| `true`        | **Real** data fetched from backend    |

---

## 🛠 Backend Configuration

In `.env` file:

```env
PORT=3000
DB_CLIENT=mock # mock | pg | mysql
```

| `DB_CLIENT` | Data Source           |
|-------------|------------------------|
| `mock`      | Mocked data            |
| `pg`        | PostgreSQL             |
| `mysql`     | MySQL                  |

---

## 🔗 Exposed APIs

| Resource      | URL                                        |
|---------------|---------------------------------------------|
| Continents    | [http://localhost:3000/continents](http://localhost:3000/continents) |
| Cities        | [http://localhost:3000/cities](http://localhost:3000/cities)         |
| Countries     | [http://localhost:3000/countries](http://localhost:3000/countries)   |
| Persons       | [http://localhost:3000/persons](http://localhost:3000/persons)       |
| Professions   | [http://localhost:3000/professions](http://localhost:3000/professions) |

---

## ⚙️ Quick Start

### ▶️ Clone the project

```bash
git clone https://github.com/ganatan/angular-app.git
cd angular-app
```

### ▶️ Frontend Angular

```bash
cd frontend-angular
npm install
npm start
mvn clean compile jetty:run 
mvn clean compile 

mvn spring-boot:run         # compiles & launches on http://localhost:8080
# http://localhost:4200
```



