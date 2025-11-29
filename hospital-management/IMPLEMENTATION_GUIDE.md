# Implementation Guide - Hospital Management System

## 📚 Table of Contents
1. [Project Setup](#project-setup)
2. [Architecture Overview](#architecture-overview)
3. [API Development Pattern](#api-development-pattern)
4. [Database Operations](#database-operations)
5. [Security Implementation](#security-implementation)
6. [Frontend Development](#frontend-development)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Checklist](#deployment-checklist)

---

## 🚀 Project Setup

### 1. Initial Installation

```bash
# Navigate to project root
cd hospital-management

# Install all dependencies (monorepo setup)
npm install

# Build shared types
npm run bootstrap

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Create PostgreSQL database
createdb hospital_management

# Run database migrations
npm run db:migrate

# Seed initial data (if needed)
npm run db:seed
```

### 2. Development Server

```bash
# Terminal 1 - Backend (runs on port 5000)
npm run dev -w backend

# Terminal 2 - Frontend (runs on port 3000)
npm run dev -w frontend

# Or run both together
npm run dev
```

---

## 🏗️ Architecture Overview

### Technology Stack Summary

**Backend:**
```
Node.js + Express + TypeScript
├── Authentication: JWT (jsonwebtoken)
├── Password: bcryptjs (10 rounds)
├── Database: PostgreSQL + pg
├── Encryption: crypto (AES-256-CBC)
├── Validation: express-validator
├── Security: helmet, cors, rate-limit
└── Logging: morgan + custom logger
```

**Frontend:**
```
React 18 + Vite + TypeScript
├── State: Zustand
├── API Client: Axios
├── Data Fetching: @tanstack/react-query
├── Routing: react-router-dom
├── Styling: Tailwind CSS
└── Dark Mode: Built-in support
```

**Database:**
```
PostgreSQL 12+
├── Row-Level Security (RLS)
├── UUID Primary Keys
├── Encrypted Sensitive Columns
├── Audit Trail Tables
└── Automatic Timestamp Triggers
```

### Monorepo Structure

```
hospital-management/
├── backend/           # Express API
├── frontend/          # React app
├── shared/            # Shared types
└── database/          # Migrations & seeds
```

The monorepo allows:
- Shared TypeScript types between frontend and backend
- Unified dependency management
- Coordinated versioning
- Single deployment unit

---

## 🔌 API Development Pattern

### 1. Creating a New API Endpoint

**Step 1: Define Types in `shared/src/types.ts`**

```typescript
// Add your interface to shared types
export interface MyEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Step 2: Create Controller (`backend/src/controllers/myController.ts`)**

```typescript
import { Request, Response } from 'express';
import { query } from '../config/database';
import { ApiError, successResponse } from '../utils/response';
import { logger } from '../utils/logger';

export const myController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await query('SELECT * FROM my_table WHERE deleted_at IS NULL');
      
      res.status(200).json(successResponse(result.rows));
    } catch (error) {
      logger.error('Error fetching records', { error: String(error) });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch records',
        timestamp: new Date(),
        statusCode: 500,
      });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;

      if (!name) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Name is required');
      }

      const result = await query(
        'INSERT INTO my_table (id, name) VALUES (gen_random_uuid(), $1) RETURNING *',
        [name]
      );

      logger.info('Record created', { id: result.rows[0].id });
      res.status(201).json(successResponse(result.rows[0], 201));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
          timestamp: new Date(),
          statusCode: error.statusCode,
        });
      } else {
        logger.error('Error creating record', { error: String(error) });
        res.status(500).json({
          success: false,
          error: 'Failed to create record',
          timestamp: new Date(),
          statusCode: 500,
        });
      }
    }
  },
};
```

**Step 3: Add Routes (`backend/src/routes/index.ts`)**

```typescript
import { myController } from '../controllers/myController';

// GET all
router.get(
  '/my-entity',
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DOCTOR),
  myController.getAll
);

// POST create
router.post(
  '/my-entity',
  authMiddleware,
  requireRole(UserRole.ADMIN),
  myController.create
);
```

**Step 4: Create Frontend Hook (`frontend/src/hooks/useMyEntity.ts`)**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';

export const useMyEntity = () => {
  return useQuery({
    queryKey: ['my-entity'],
    queryFn: async () => {
      const response = await apiClient.get('/my-entity');
      return response.data;
    },
  });
};

export const useCreateMyEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/my-entity', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-entity'] });
    },
  });
};
```

**Step 5: Create Frontend Component**

```typescript
import React from 'react';
import { useMyEntity, useCreateMyEntity } from '../hooks/useMyEntity';
import { Button, Card } from '../components';

export const MyComponent: React.FC = () => {
  const { data, isLoading, error } = useMyEntity();
  const createMutation = useCreateMyEntity();

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({ name: 'New Item' });
    } catch (error) {
      console.error('Failed to create', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Card title="My Entities">
      <Button onClick={handleCreate} variant="primary">
        Create New
      </Button>
      {/* Render data */}
    </Card>
  );
};
```

---

## 💾 Database Operations

### 1. Query Pattern

Always use parameterized queries to prevent SQL injection:

```typescript
// ✅ GOOD - Parameterized queries
const result = await query(
  'SELECT * FROM users WHERE email = $1 AND role = $2',
  [email, role]
);

// ❌ BAD - String concatenation (NEVER DO THIS)
const result = await query(
  `SELECT * FROM users WHERE email = '${email}' AND role = '${role}'`
);
```

### 2. Transaction Support

For multi-step operations:

```typescript
const client = await getClient();
try {
  await client.query('BEGIN');
  
  // Step 1
  const userResult = await client.query(
    'INSERT INTO users (...) VALUES (...) RETURNING *',
    [...]
  );
  
  // Step 2
  await client.query(
    'INSERT INTO patient (...) VALUES (...)',
    [userResult.rows[0].id]
  );
  
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

### 3. Creating New Tables

Always follow the naming and structure pattern:

```sql
CREATE TABLE my_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Always add updated_at trigger
CREATE TRIGGER update_my_entities_updated_at BEFORE UPDATE ON my_entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create useful indexes
CREATE INDEX idx_my_entities_created_at ON my_entities(created_at);
```

### 4. Soft Deletes

Never actually delete records, use soft deletes for HIPAA compliance:

```typescript
// Delete
await query('UPDATE my_table SET deleted_at = NOW() WHERE id = $1', [id]);

// Query (always exclude soft-deleted)
await query('SELECT * FROM my_table WHERE deleted_at IS NULL');

// Restore
await query('UPDATE my_table SET deleted_at = NULL WHERE id = $1', [id]);
```

---

## 🔐 Security Implementation

### 1. Authentication Flow

```
User Login
    ↓
Validate credentials (bcryptjs)
    ↓
Generate JWT tokens (access + refresh)
    ↓
Store tokens in localStorage (frontend)
    ↓
Include access token in Authorization header
    ↓
Server validates token in authMiddleware
    ↓
Attach user to request object
```

### 2. Role-Based Access Control

```typescript
// Check single role
requireRole(UserRole.ADMIN)(req, res, next);

// Check multiple roles (OR logic)
requireRole(UserRole.DOCTOR, UserRole.NURSE)(req, res, next);

// Check admin or above
requireAdminOrAbove(req, res, next);

// Check medical staff
requireMedicalStaff(req, res, next);
```

### 3. Protecting Sensitive Data

```typescript
// Encrypt before storing
import { encryptData } from '../utils/encryption';

const encryptedSSN = encryptData(ssn);
await query('UPDATE patients SET ssn_encrypted = $1', [encryptedSSN]);

// Decrypt when retrieving
import { decryptData } from '../utils/encryption';

const decryptedSSN = decryptData(row.ssn_encrypted);
```

### 4. Audit Logging

```typescript
import { auditLog } from '../middleware/auditLog';

await auditLog({
  userId: req.user.userId,
  action: 'UPDATE',
  tableName: 'patients',
  recordId: patientId,
  oldData: { name: 'Old Name' },
  newData: { name: 'New Name' },
});
```

### 5. Validation

```typescript
import { body, validationResult } from 'express-validator';

// In routes
router.post(
  '/patients',
  [
    body('dateOfBirth').isISO8601().toDate(),
    body('email').isEmail().normalizeEmail(),
    body('phone').isMobilePhone(),
    body('address').isLength({ min: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Proceed with handler
  }
);
```

---

## 🎨 Frontend Development

### 1. Component Structure

```typescript
// Feature Component
interface MyFeatureProps {
  title: string;
  onSave?: (data: any) => void;
}

export const MyFeature: React.FC<MyFeatureProps> = ({ title, onSave }) => {
  const { data, isLoading } = useMyData();
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave?.(formData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Card title={title}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </Card>
  );
};
```

### 2. State Management with Zustand

```typescript
// Define store
interface MyStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Use in component
const MyComponent = () => {
  const { count, increment, decrement } = useMyStore();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

### 3. Data Fetching with React Query

```typescript
// Define query key as array for better management
const QUERY_KEYS = {
  patients: ['patients'] as const,
  patient: (id: string) => [... QUERY_KEYS.patients, id] as const,
};

// Fetch data
const { data, isLoading, error, isFetching } = useQuery({
  queryKey: QUERY_KEYS.patient(patientId),
  queryFn: () => fetchPatient(patientId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 3,
});

// Mutations with automatic cache invalidation
const mutation = useMutation({
  mutationFn: updatePatient,
  onSuccess: (data) => {
    queryClient.setQueryData(QUERY_KEYS.patient(data.id), data);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients });
  },
});
```

### 4. Form Handling

```typescript
interface FormData {
  email: string;
  password: string;
}

const [formData, setFormData] = useState<FormData>({
  email: '',
  password: '',
});

const [errors, setErrors] = useState<Partial<FormData>>({});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  // Clear error for this field
  setErrors((prev) => ({ ...prev, [name]: undefined }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  const newErrors: Partial<FormData> = {};
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  // Submit
  try {
    await submitForm(formData);
  } catch (error) {
    setErrors({ email: 'Submit failed' });
  }
};
```

---

## 🧪 Testing Strategy

### 1. Backend Testing

```bash
npm run test -w backend
```

**Test file structure:** `src/**/*.test.ts`

```typescript
import { authController } from '../controllers/authController';

describe('Auth Controller', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'SecurePassword123!',
          firstName: 'John',
          lastName: 'Doe',
        },
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.register(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
```

### 2. Frontend Testing

```bash
npm run test -w frontend
```

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../pages/LoginPage';

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should submit form with valid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Assert navigation or state changes
  });
});
```

---

## ✅ Deployment Checklist

### Before Deploying

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Security headers configured
- [ ] CORS configured for production domain
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] Backup strategy defined
- [ ] SSL certificates valid

### Backend Deployment

```bash
# Build
npm run build -w backend

# Set production environment
export NODE_ENV=production
export DB_HOST=prod-db.example.com
export JWT_SECRET=your-secret-key
export CORS_ORIGIN=https://yourdomain.com

# Run migrations
npm run db:migrate

# Start server
npm run start -w backend
```

### Frontend Deployment

```bash
# Build
npm run build -w frontend

# Serve from CDN or static host
# Ensure API proxy is configured for backend

# For production, update:
# - API_URL in .env
# - CORS origin in backend
```

### Post-Deployment

- [ ] Test all critical flows
- [ ] Monitor logs and errors
- [ ] Check database connections
- [ ] Verify API response times
- [ ] Test role-based access
- [ ] Verify audit logging
- [ ] Check dark mode functionality
- [ ] Test on mobile devices
- [ ] Verify data backup running

---

## 📞 Support & Resources

- **API Docs:** Available at `/api/docs` (to be implemented)
- **Database Docs:** See `database/README.md`
- **Type Definitions:** Located in `shared/src/types.ts`
- **Environment Variables:** Check `.env.example` files

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0
