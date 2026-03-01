# LOPO POS System

<p align="left">
  <img alt="Node" src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-Expo-000020?logo=expo&logoColor=white" />
</p>

Modern Point-of-Sale platform for fast checkout, product management, and store operations across mobile devices.

---

## Quick navigation

- [Project structure](#project-structure)
- [Backend quick start](#backend-quick-start)
- [Useful URLs](#useful-urls)
- [GitHub workflow team rules](#github-workflow-team-rules)

---

## Project structure

| Module    | Stack                          | Purpose                            |
| --------- | ------------------------------ | ---------------------------------- |
| `backend` | Node.js + Express + TypeScript | API server, auth, database logic   |
| `mobile`  | React Native (Expo)            | POS mobile app for staff and owner |

## Backend quick start

### Prerequisites

- Node.js 18+
- npm
- MongoDB (Atlas or local)

<details>
  <summary><b>Install and run</b></summary>

1. Open terminal and go to backend folder:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Start development server:
   - `npm run dev`

</details>

### Useful URLs

- API base URL: `http://localhost:3000/api`
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`

---

## GitHub workflow (team rules)

> ⚠️ **Do not code directly on `main`.**
> Always create a new branch before implementing any task.

### Branch naming convention

- Feature: `feature/<short-name>`
  - Example: `feature/auth-register-staff`
- Bug fix: `fix/<short-name>`
  - Example: `fix/login-validation`
- Refactor/chore: `chore/<short-name>`
  - Example: `chore/update-swagger-docs`

### Standard flow for developers

1. Sync latest code:
   - `git checkout main`
   - `git pull origin main`
2. Create a branch for your task:
   - `git checkout -b feature/<your-task-name>`
3. Implement and test locally.
4. Commit with clear message:
   - `git add .`
   - `git commit -m "feat: add staff self-register endpoint"`
5. Push branch:
   - `git push -u origin feature/<your-task-name>`
6. Open Pull Request to `main`.
7. Merge only after review approval.

### Commit message convention

- `feat:` new feature
- `fix:` bug fix
- `refactor:` internal improvement
- `docs:` documentation update
- `chore:` tooling/config/dependency update

---

Made with ❤️ by LOPO team.
