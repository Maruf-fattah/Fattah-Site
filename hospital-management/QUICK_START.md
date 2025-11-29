# Quick Start Guide

## 🚀 5-Minute Setup

### 1. Clone & Install
```bash
cd hospital-management
npm install
npm run bootstrap
```

### 2. Environment Setup
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp frontend/.env.example frontend/.env
```

### 3. Database Setup
```bash
# Create database
createdb hospital_management

# Run migrations
npm run db:migrate
```

### 4. Start Development Servers
```bash
# Terminal 1
npm run dev -w backend

# Terminal 2
npm run dev -w frontend
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- Health Check: http://localhost:5000/health

---

## 📝 Test Login Credentials

After running migrations and seed scripts:

```
Email: admin@hospital.com
Password: Admin@123456
Role: SUPER_ADMIN
```

```
Email: doctor@hospital.com
Password: Doctor@123456
Role: DOCTOR
```

```
Email: patient@hospital.com
Password: Patient@123456
Role: PATIENT
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev                  # Run both backend and frontend
npm run dev -w backend      # Run only backend
npm run dev -w frontend     # Run only frontend

# Building
npm run build               # Build all
npm run build -w backend    # Build backend only
npm run build -w frontend   # Build frontend only

# Database
npm run db:migrate          # Run migrations
npm run db:seed             # Seed test data

# Testing
npm run test                # Run all tests
npm run test -w backend     # Test backend only
npm run test -w frontend    # Test frontend only

# Code Quality
npm run lint                # Lint all
npm run lint -w backend     # Lint backend only
npm run lint -w frontend    # Lint frontend only
```

---

## 📚 Project Documentation

- **[README.md](./README.md)** - Project overview and features
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed development guide
- **[database/](./database/)** - Database schema and migrations
- **[backend/](./backend/)** - API implementation
- **[frontend/](./frontend/)** - Frontend application
- **[shared/](./shared/)** - Shared types and utilities

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Create database if not exists
createdb hospital_management

# Verify connection
psql -h localhost -U postgres -d hospital_management
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Kill process on port 3000 (frontend)
lsof -i :3000
kill -9 <PID>
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run bootstrap
```

### TypeScript Errors
```bash
# Build shared types first
npm run build -w shared

# Then rebuild other packages
npm run build
```

---

## ✅ Next Steps

1. **Review the architecture** in [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
2. **Set up your IDE** with TypeScript support
3. **Create your first API endpoint** following the pattern in the guide
4. **Build a frontend component** to consume the API
5. **Add tests** for your new features
6. **Deploy to production** following the checklist

---

## 💡 Key Features to Explore

- ✅ Multi-role authentication system
- ✅ Patient management module
- ✅ Role-based access control
- ✅ Dark mode support
- ✅ Audit logging
- ✅ PostgreSQL with encryption
- ✅ Modern React frontend
- ✅ REST API architecture

---

**Happy Coding! 🚀**
