# LOPO-POS-System

A modern point-of-sale management system that supports inventory management, multi-payment methods, and real-time sales reporting.

## 1) Project structure

- `backend`: Node.js + Express + TypeScript API server
- `mobile`: React Native (Expo) application

## 2) Backend quick start

### Prerequisites

- Node.js 18+
- npm
- MongoDB (Atlas or local)

### Install and run

1. Open terminal and go to backend folder:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Start development server:
   - `npm run dev`

### Useful URLs

- API base URL: `http://localhost:3000/api`
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`

## 3) GitHub workflow (team rules)

### Important rule

- **Do not code new features directly on `main`.**
- Before starting any new task/feature/bug fix, always create a new branch.

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
3. Implement code and test locally.
4. Commit with clear messages:
   - `git add .`
   - `git commit -m "feat: add staff self-register endpoint"`
5. Push branch:
   - `git push -u origin feature/<your-task-name>`
6. Create Pull Request (PR) to `main`.
7. Merge only after review/approval.

### Commit message convention (recommended)

- `feat:` new feature
- `fix:` bug fix
- `refactor:` code improvement without changing behavior
- `docs:` README/Swagger/doc updates
- `chore:` tooling/config/dependency updates
