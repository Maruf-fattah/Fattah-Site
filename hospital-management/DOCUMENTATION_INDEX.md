# 📚 Documentation Index

Welcome to the Hospital Management System! This guide helps you navigate all the documentation.

---

## 🎯 Start Here

### For First-Time Setup
**→ Read [QUICK_START.md](./QUICK_START.md)** (5 minutes)
- 5-minute setup instructions
- Common commands
- Troubleshooting basics
- Test login credentials

### For Getting Started as a Developer
**→ Read [DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md)** (30 minutes)
- Complete onboarding checklist
- Setup verification steps
- Development task roadmap
- Best practices
- Debugging tips

---

## 📖 Main Documentation

### Project Overview
**→ Read [README.md](./README.md)** (20 minutes)
- Complete project features (10 modules)
- Technology stack details
- Project structure explanation
- API endpoint overview
- Security features
- Database schema highlights
- Deployment information

### Development Guide
**→ Read [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** (45 minutes)
- Architecture overview
- API development patterns
- How to create new endpoints
- Database operation patterns
- Security implementation details
- Frontend development patterns
- Testing strategy
- Deployment checklist

### Project Summary
**→ Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** (15 minutes)
- What's been completed
- Project statistics
- Implemented features
- File structure overview
- Next steps for development
- Quality checklist
- Success criteria met

---

## 🏗️ Architecture & Design

### Backend Architecture
Located in `backend/src/`:
```
backend/
├── config/          # Database & environment config
├── middleware/      # Auth, RBAC, error handling
├── routes/          # API endpoint definitions
├── controllers/     # Request handlers with business logic
├── services/        # Business logic layer
├── models/          # Data interfaces
└── utils/           # Helper functions (JWT, crypto, logger)
```

### Frontend Architecture
Located in `frontend/src/`:
```
frontend/
├── components/      # Reusable UI components
├── pages/           # Page-level components
├── hooks/           # Custom React hooks
├── services/        # API & Auth services
└── store/           # Zustand state stores
```

### Database Architecture
Located in `database/`:
- `migrations/` - SQL schema definitions
- `seeds/` - Test data initialization
- 10+ normalized tables with proper relationships
- Row-level security framework
- Audit logging for compliance

---

## 🔍 Topic-Specific Guides

### Authentication & Security
- Start in: **IMPLEMENTATION_GUIDE.md** → "Security Implementation" section
- See example: `backend/src/controllers/authController.ts`
- Middleware: `backend/src/middleware/auth.ts`
- Utils: `backend/src/utils/jwt.ts`, `password.ts`, `encryption.ts`

### API Development
- Guide: **IMPLEMENTATION_GUIDE.md** → "API Development Pattern" section
- Example controller: `backend/src/controllers/patientController.ts`
- Example routes: `backend/src/routes/index.ts`
- Response format: `backend/src/utils/response.ts`

### Frontend Development
- Guide: **IMPLEMENTATION_GUIDE.md** → "Frontend Development" section
- Component examples: `frontend/src/components/`
- Hook examples: `frontend/src/hooks/`
- Store examples: `frontend/src/store/index.ts`
- Services: `frontend/src/services/`

### Database Operations
- Guide: **IMPLEMENTATION_GUIDE.md** → "Database Operations" section
- Schema: `database/migrations/001_initial_schema.sql`
- Connection: `backend/src/config/database.ts`
- Query patterns in all controllers

### Role-Based Access Control (RBAC)
- Types: `shared/src/types.ts` (UserRole enum)
- Middleware: `backend/src/middleware/rbac.ts`
- Routes usage: `backend/src/routes/index.ts`
- Frontend: `frontend/src/hooks/useAuth.ts`

### Dark Mode & Theming
- Component: `frontend/src/components/ThemeToggle.tsx`
- Store: `frontend/src/store/index.ts` (useThemeStore)
- Styles: `frontend/src/styles/globals.css`
- Config: `frontend/tailwind.config.js`

---

## 📋 Common Tasks

### "How do I create a new API endpoint?"
1. Define types in `shared/src/types.ts`
2. Create controller in `backend/src/controllers/`
3. Add routes in `backend/src/routes/index.ts`
4. Follow pattern in **IMPLEMENTATION_GUIDE.md** → "API Development Pattern"

### "How do I add a new database table?"
1. Create migration in `database/migrations/`
2. Add SQL with proper schema
3. Run migration: `npm run db:migrate`
4. Update shared types
5. See example: `database/migrations/001_initial_schema.sql`

### "How do I protect a route with RBAC?"
1. Add middleware to route in `backend/src/routes/index.ts`
2. Use `requireRole()` or `requireAdminOrAbove()`
3. See example: `backend/src/routes/index.ts`
4. Middleware code: `backend/src/middleware/rbac.ts`

### "How do I create a new React component?"
1. Create file in `frontend/src/components/`
2. Export component in `frontend/src/components/index.ts`
3. Follow pattern in existing components
4. See example: `frontend/src/components/Button.tsx`

### "How do I fetch data from the API?"
1. Create hook in `frontend/src/hooks/`
2. Use React Query (`useQuery`, `useMutation`)
3. See example: `frontend/src/hooks/usePatient.ts`
4. Guide: **IMPLEMENTATION_GUIDE.md** → "React Query Pattern"

---

## 🚀 Development Workflows

### Starting Development
1. Read **QUICK_START.md** (setup)
2. Read **DEVELOPER_ONBOARDING.md** (checklist)
3. Pick a task from "Immediate" section
4. Follow the API development pattern
5. Test changes
6. Commit to feature branch
7. Create pull request

### Adding a New Module
1. Design database schema
2. Create migration file
3. Create controller with CRUD operations
4. Create routes with RBAC
5. Create frontend hooks
6. Create frontend components
7. Test end-to-end
8. Document in API response format

### Debugging
- Backend: See **DEVELOPER_ONBOARDING.md** → "Debugging Tips"
- Frontend: Use browser DevTools + React DevTools extension
- Database: Use psql or database client

### Testing
- Guide: **IMPLEMENTATION_GUIDE.md** → "Testing Strategy"
- Run: `npm run test`
- Coverage: `npm run test -- --coverage`

---

## 📦 Project Structure at a Glance

```
hospital-management/
├── README.md                          ← Start here for overview
├── QUICK_START.md                     ← 5-minute setup
├── DEVELOPER_ONBOARDING.md            ← Developer checklist
├── IMPLEMENTATION_GUIDE.md            ← Development guide
├── IMPLEMENTATION_SUMMARY.md          ← What's completed
├── DOCUMENTATION_INDEX.md             ← This file
│
├── backend/                           ← Express API (port 5000)
│   ├── src/
│   │   ├── config/                    ← DB & env config
│   │   ├── middleware/                ← Auth, RBAC, errors
│   │   ├── routes/                    ← API routes
│   │   ├── controllers/               ← Request handlers
│   │   ├── utils/                     ← JWT, crypto, logger
│   │   ├── app.ts
│   │   └── index.ts
│   └── .env.example
│
├── frontend/                          ← React app (port 3000)
│   ├── src/
│   │   ├── components/                ← UI components
│   │   ├── pages/                     ← Page components
│   │   ├── hooks/                     ← Custom hooks
│   │   ├── services/                  ← API client
│   │   ├── store/                     ← State stores
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   └── .env.example
│
├── shared/                            ← Shared types
│   ├── src/
│   │   └── types.ts                   ← All TypeScript interfaces
│   └── package.json
│
└── database/                          ← DB migrations & seeds
    ├── migrations/
    │   └── 001_initial_schema.sql     ← Full schema
    └── seeds/
```

---

## 🔗 Important Links

### Configuration Files
- Backend config: `backend/.env.example`
- Frontend config: `frontend/.env.example`
- Database URL: `postgres://user:password@localhost:5432/hospital_management`

### Key Files
- Shared types: `shared/src/types.ts`
- Auth controller: `backend/src/controllers/authController.ts`
- Patient controller: `backend/src/controllers/patientController.ts`
- RBAC middleware: `backend/src/middleware/rbac.ts`
- Auth hooks: `frontend/src/hooks/useAuth.ts`
- Database schema: `database/migrations/001_initial_schema.sql`

### Endpoints (All under `/api/v1`)
- Auth: `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`
- Patients: `/patients` (GET, POST), `/patients/:id` (GET)
- More endpoints being added...

---

## ❓ Frequently Asked Questions

**Q: Where do I set up the database?**
A: Run `createdb hospital_management` then `npm run db:migrate`

**Q: How do I change JWT secrets?**
A: Edit `backend/.env` - `JWT_SECRET` and `REFRESH_TOKEN_SECRET`

**Q: How do I add a new role?**
A: Add to `UserRole` enum in `shared/src/types.ts`

**Q: How do I protect an API route?**
A: Add `requireRole()` middleware in routes file

**Q: How do I fetch data in React?**
A: Use hooks from `frontend/src/hooks/` with React Query

**Q: How do I encrypt sensitive data?**
A: Use functions from `backend/src/utils/encryption.ts`

**Q: How do I log errors?**
A: Use `logger` from `backend/src/utils/logger.ts`

---

## 📞 Support

- **Setup Issues?** → Check QUICK_START.md
- **Development Questions?** → Check IMPLEMENTATION_GUIDE.md
- **Onboarding Issues?** → Check DEVELOPER_ONBOARDING.md
- **Code Examples?** → Look in existing controllers/components
- **Type Questions?** → Check shared/src/types.ts

---

## 🎯 Next Steps

1. **[ ] Complete Setup**
   - Follow QUICK_START.md
   - Verify all systems working

2. **[ ] Review Documentation**
   - Read README.md
   - Read IMPLEMENTATION_GUIDE.md

3. **[ ] Start Development**
   - Create feature branch
   - Pick first task from DEVELOPER_ONBOARDING.md
   - Follow API development pattern
   - Test and commit

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0  
**Status:** ✅ Complete & Ready for Development

**Happy Coding! 🚀**
