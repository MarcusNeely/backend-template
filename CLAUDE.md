# Backend Template

A Node.js + Express + PostgreSQL + Prisma standalone REST API template with 9 Claude sub-agents. Duplicate this repo when starting a new backend project.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js (ES Modules) | Runtime |
| Express | HTTP framework |
| PostgreSQL | Database |
| Prisma | ORM + migrations |
| Zod | Input validation |
| JWT + bcryptjs | Authentication |
| Helmet | Security headers |
| Winston | Structured logging |
| Vitest + Supertest | Testing |

---

## Available Agents

Invoke by asking Claude: *"Use the [agent name] to..."*

| Agent | File | When to Use |
|-------|------|-------------|
| **API Architect** | `.claude/agents/api-architect.md` | Design routes, controllers, service structure, response formats |
| **Database Specialist** | `.claude/agents/database-specialist.md` | Schema design, migrations, indexing, complex queries |
| **Auth Specialist** | `.claude/agents/auth-specialist.md` | JWT, refresh tokens, OAuth, RBAC, login flows |
| **Security Auditor** | `.claude/agents/security-auditor.md` | OWASP API Top 10, injection, headers, secrets, pre-deploy audit |
| **Performance Optimizer** | `.claude/agents/performance-optimizer.md` | N+1 queries, caching, indexes, connection pooling, pagination |
| **Documentation Generator** | `.claude/agents/documentation-generator.md` | OpenAPI/Swagger, JSDoc, README, endpoint reference |
| **Error Handler & Logger** | `.claude/agents/error-handler-logger.md` | AppError patterns, Winston logging, monitoring |
| **Testing Specialist** | `.claude/agents/testing-specialist.md` | Vitest unit tests, Supertest integration tests |
| **DevOps Assistant** | `.claude/agents/devops-assistant.md` | Docker, docker-compose, GitHub Actions CI/CD, deployment |
| **Orchestrator** | `.claude/agents/orchestrator.md` | Coordinate multi-agent pipelines — use this to run a full workflow |

**Example invocations:**
- *"Use the API architect to design routes for a product catalog feature"*
- *"Ask the database specialist to add indexes for the orders table"*
- *"Have the security auditor review the auth routes before we ship"*
- *"Use the DevOps assistant to set up a GitHub Actions CI pipeline"*

---

## Project Structure

```
src/
├── controllers/     # Thin request handlers — receive, delegate to service, respond
├── middleware/      # auth.js, validate.js, errorHandler.js, notFound.js
├── routes/          # Route definitions — paths, middleware chains, controller wiring
├── services/        # All business logic — no req/res knowledge
└── utils/
    ├── AppError.js  # Operational error class with HTTP status code
    ├── asyncHandler.js  # Wraps async controllers — eliminates try/catch
    ├── logger.js    # Winston logger instance
    └── prisma.js    # Prisma client singleton
prisma/
├── schema.prisma    # Database schema — source of truth
├── migrations/      # Auto-generated — never edit manually
└── seed.js          # Database seeding script
tests/
├── unit/            # Service and utility tests (Prisma mocked)
├── integration/     # Full HTTP tests via Supertest
└── setup.js         # Test DB connection, cleanup hooks
```

---

## Code Conventions

- **ES Modules** — use `import`/`export`, not `require()`
- **Controllers**: thin — validate input (via Zod middleware), call service, return response
- **Services**: all business logic lives here — no `req`, `res`, `next`
- **Errors**: always throw `AppError` — never raw `Error` in services
- **Async**: always use `asyncHandler` wrapper on controllers — no raw try/catch
- **Validation**: all incoming request bodies validated with Zod via `validate()` middleware
- **Field selection**: always use Prisma `select` — never return full objects with passwords

---

## Response Envelope Format

```js
// Success
{ "status": "success", "data": { ... } }

// Success with pagination
{ "status": "success", "data": [...], "meta": { "total": 100, "page": 1, "limit": 20 } }

// Client error (4xx)
{ "status": "fail", "message": "User not found." }

// Server error (5xx) — never expose internals
{ "status": "error", "message": "Something went wrong. Please try again later." }
```

---

## Environment Variables

See `.env.example` for all required variables. Never commit `.env`.

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — at least 32 random characters
- `JWT_REFRESH_SECRET` — different from JWT_SECRET, also 32+ chars
- `ALLOWED_ORIGINS` — comma-separated CORS origins

---

## Available Scripts

```bash
npm run dev           # Start with nodemon (auto-restart on file changes)
npm start             # Start production server
npm test              # Run tests in watch mode
npm run test:run      # Run tests once (for CI)
npm run test:coverage # Generate coverage report
npm run db:migrate    # Create and apply a new Prisma migration
npm run db:push       # Push schema without migration (dev only)
npm run db:studio     # Open Prisma Studio (visual database browser)
npm run db:seed       # Seed the database with initial data
npm run db:reset      # Reset database and re-run all migrations (dev only)
```

---

## Starting a New Project from This Template

1. Click **"Use this template"** on GitHub (or clone and re-init git)
2. `npm install`
3. Copy `.env.example` → `.env` and fill in database credentials and secrets
4. Update the `name` in `package.json`
5. Run `npx prisma migrate dev --name init` to apply the base schema
6. Run `npm run db:seed` to seed the admin user
7. `npm run dev` — API is live at `http://localhost:3000`
8. Use the **API Architect** agent to plan your feature routes
9. Use the **Database Specialist** agent to design your domain schema

---

## Agent Workflows

Agents are aware of each other and will recommend handoffs when appropriate. For coordinated multi-agent pipelines, invoke the **Orchestrator** agent.

### Standard Pipelines

| Workflow | Agents Involved (in order) |
|----------|---------------------------|
| **New Project Setup** | Architect → Database → Auth → DevOps → Docs |
| **New Feature** | Architect → Database → Auth → Error Handler → Tester → Security → Docs |
| **API Integration** | Architect → Auth → Error Handler → Tester → Docs |
| **Database Migration** | Database → Architect → Performance → Tester → Docs |
| **Bug Fix** | Tester → Architect → Database → Security → Docs |
| **Performance Optimization** | Performance → Database → Architect → Tester → Docs |
| **Pre-Release Audit** | Security → Auth → Tester → DevOps → Docs |
| **Documentation Sprint** | Docs → Tester → Architect |

### How Agents Communicate

- Each agent's instructions include a **Handoffs** section listing which agents to recommend next
- When an agent completes work, it provides a summary for the next agent to pick up from
- The **Orchestrator** manages the full pipeline, passing context between agents and announcing each step
- You can run a full pipeline by saying: *"Use the Orchestrator to run the New Feature pipeline for [feature name]"*

---

## Architecture Decisions

> Record decisions here as the project evolves.

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | Express | Minimal, flexible, massive ecosystem |
| ORM | Prisma | Type-safe, great migrations, excellent DX |
| Validation | Zod | Runtime safety, composable schemas |
| Auth | JWT + httpOnly cookies | Stateless access token + secure refresh |
| Logging | Winston | Structured JSON logs, transport flexibility |
| Testing | Vitest + Supertest | Fast, ESM-native, no config overhead |
