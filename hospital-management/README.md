# Hospital Management System (HMS)

A comprehensive, production-ready, secure, and scalable Hospital, Diagnostic & Clinic Management Web Application with full HIPAA/GDPR compliance support.

## 🏥 Features

### Multi-Role Support (9 Roles)
- **Super Admin** - Full system control and configuration
- **Admin** - Hospital administration and staff management
- **Doctor** - Patient consultation and prescription management
- **Nurse** - Patient vitals and care coordination
- **Lab Technician** - Laboratory test management and reporting
- **Pharmacist** - Medicine and pharmacy operations
- **Receptionist** - Appointment scheduling and patient check-in
- **Accountant** - Billing and financial management
- **Patient** - Personal medical records and appointments

### Core Modules

#### 1. **Patient Management (OPD/IPD)**
- Complete patient demographics and medical history
- Admission and discharge management
- Emergency contact and allergy tracking
- Patient document management
- MRN (Medical Record Number) generation

#### 2. **Doctor & Appointment Management**
- Online and offline appointment booking
- Queue management system
- Appointment scheduling with time slots
- Doctor availability management
- Appointment status tracking (scheduled, completed, cancelled, no-show)

#### 3. **Electronic Medical Records (EMR/EHR)**
- Complete medical history management
- Consultation notes and diagnoses
- Treatment plans and recommendations
- Medical record access controls
- Version history and audit trails

#### 4. **E-Prescription Management**
- Digital prescription generation
- Medicine dosage and frequency management
- Prescription status tracking
- Patient prescription history
- Medicine interaction checking foundation

#### 5. **Diagnostic & Laboratory Management**
- Test ordering and sample tracking
- Laboratory report generation with PDF export
- Test result management with normal ranges
- Sample status tracking
- Test categorization and coding

#### 6. **Pharmacy & Medicine Management**
- Medicine inventory tracking
- Stock level alerts and reordering
- Batch and expiry date management
- Barcode generation and tracking
- Medicine pricing and taxation

#### 7. **Billing & Accounts**
- OPD, IPD, Pharmacy, and Diagnostic billing
- Invoice generation with auto-numbering
- Tax (VAT) calculation
- Discount management
- Insurance integration support
- Installment payment plans
- Payment method tracking (Cash, Card, Cheque, Bank Transfer)
- Partial and complete payment tracking

#### 8. **Inventory & Asset Management**
- Hospital asset tracking
- Maintenance scheduling
- Asset depreciation tracking
- Stock management

#### 9. **Staff, Attendance & Payroll**
- Staff management and role assignment
- Attendance tracking
- Salary and payroll management
- Leave management
- Performance tracking

#### 10. **Advanced Reporting & Analytics**
- Customizable dashboards per role
- Key metrics and KPIs
- Financial reports and analytics
- Patient statistics
- Department-wise performance reports
- PDF/Excel export functionality

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (with Row-Level Security)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs
- **Encryption:** AES-256-CBC for sensitive data
- **API Documentation:** OpenAPI/Swagger ready
- **Logging:** Morgan + Custom logger
- **Security:** Helmet, CORS, Rate Limiting

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API Client:** Axios
- **Data Fetching:** React Query (@tanstack/react-query)
- **Routing:** React Router v6
- **UI Components:** Custom + Tailwind
- **Dark Mode:** Built-in support
- **Charts/Graphs:** Recharts ready
- **Icons:** Lucide React

### Database
- **Primary:** PostgreSQL 12+
- **ORM:** Custom SQL queries (prepared statements)
- **Encryption:** pgcrypto, AES encryption
- **Row-Level Security (RLS):** Implemented
- **Audit Logging:** Complete audit trail table

## 📋 Project Structure

```
hospital-management/
├── backend/                      # Node.js/Express API
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── middleware/          # Auth, RBAC, Error handling
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic
│   │   ├── models/              # Data models/interfaces
│   │   ├── utils/               # Utilities (JWT, crypto, logger)
│   │   ├── database/            # Database connection
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   │   └── components/      # Page-specific components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   ├── store/               # Zustand stores
│   │   ├── styles/              # Global styles
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # Entry point
│   ├── public/                  # Static assets
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
├── shared/                       # Shared types and utilities
│   ├── src/
│   │   ├── types.ts             # Shared TypeScript types
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── database/                     # Database migrations and seeds
│   ├── migrations/              # SQL migration files
│   │   ├── 001_initial_schema.sql
│   │   └── run.ts               # Migration runner
│   └── seeds/                   # Database seeding scripts
│
├── package.json                 # Monorepo root
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL 12+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hospital-management
```

2. **Install dependencies**
```bash
npm install
# This will install dependencies for all workspaces
```

3. **Setup environment variables**

Backend (.env):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configurations
```

Frontend (.env):
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URL
```

4. **Setup PostgreSQL database**
```bash
# Create database
createdb hospital_management

# Run migrations
npm run db:migrate
```

5. **Seed initial data (optional)**
```bash
npm run db:seed
```

### Running the Application

**Development Mode:**
```bash
# Run both backend and frontend
npm run dev

# Or run them separately
npm run dev -w backend    # Terminal 1
npm run dev -w frontend   # Terminal 2
```

**Production Build:**
```bash
npm run build

# Start backend
cd backend && npm run start

# Build and serve frontend
cd frontend && npm run build && npm run preview
```

### API Documentation

The backend API follows REST principles with the following structure:

```
Base URL: http://localhost:5000/api/v1

Authentication Routes:
POST   /auth/register      - User registration
POST   /auth/login         - User login
POST   /auth/logout        - User logout
POST   /auth/refresh       - Refresh access token
GET    /auth/me            - Get current user

Patient Routes:
GET    /patients           - List all patients (paginated)
POST   /patients           - Create new patient
GET    /patients/:id       - Get patient details
PUT    /patients/:id       - Update patient
DELETE /patients/:id       - Delete patient

Appointment Routes:
GET    /appointments       - List appointments
POST   /appointments       - Create appointment
GET    /appointments/:id   - Get appointment details
PUT    /appointments/:id   - Update appointment status

Medical Records Routes:
GET    /medical-records    - List records
POST   /medical-records    - Create record
GET    /medical-records/:id - Get record details

Prescription Routes:
GET    /prescriptions      - List prescriptions
POST   /prescriptions      - Create prescription

Lab Tests Routes:
GET    /lab-tests          - List lab tests
POST   /lab-tests          - Order lab test
PUT    /lab-tests/:id      - Update test status

Medicines Routes:
GET    /medicines          - List medicines
POST   /medicines          - Add medicine

Billing Routes:
GET    /invoices           - List invoices
POST   /invoices           - Create invoice
GET    /invoices/:id       - Get invoice details
```

## 🔐 Security Features

### Authentication & Authorization
- JWT-based stateless authentication
- Secure password hashing with bcryptjs (10 rounds)
- Role-Based Access Control (RBAC) with 9 roles
- Token refresh mechanism
- Automatic logout on token expiry

### Data Protection
- AES-256-CBC encryption for sensitive data (SSN, MRN)
- HTTPS/TLS for all communications
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- CSRF protection
- Secure headers (Helmet.js)

### Compliance
- HIPAA compliance framework
- GDPR compliance support
- Comprehensive audit logging
- Data access logging
- 6+ year audit trail retention
- Soft delete support for data retention

### Database Security
- Row-Level Security (RLS)
- User authentication at database level
- Encrypted sensitive columns
- Regular backups
- Connection SSL/TLS support

## 🎨 UI/UX Features

- **Modern Design:** Clean, professional medical interface
- **Dark Mode:** Built-in light and dark theme support
- **Responsive:** Mobile-first, works on all devices
- **Accessibility:** WCAG 2.1 AA compliant
- **Performance:** Fast load times with code splitting
- **Real-time:** Live dashboards and notifications ready
- **Print-friendly:** Medical records and reports optimized for printing

## 📊 Database Schema Highlights

### Key Tables
- `users` - User accounts with roles
- `patients` - Patient demographics
- `staff` - Hospital staff information
- `departments` - Hospital departments
- `appointments` - Appointment scheduling
- `medical_records` - Complete medical history
- `prescriptions` - E-prescription management
- `medicines` - Pharmacy inventory
- `lab_tests` - Laboratory test management
- `invoices` - Billing and accounting
- `audit_logs` - HIPAA-compliant audit trail

### Security Features
- UUID primary keys
- Timestamps (created_at, updated_at, deleted_at)
- Soft deletes for data retention
- Foreign key constraints
- Comprehensive indexing for performance
- Automatic timestamp updates via triggers

## 🧪 Testing & Quality

The project is structured for:
- Unit testing (Jest)
- Integration testing
- API endpoint testing
- Frontend component testing
- E2E testing setup ready

## 📈 Performance Optimizations

- Database query optimization with proper indexing
- Connection pooling
- Code splitting and lazy loading
- Caching strategies
- Rate limiting to prevent abuse
- Pagination for large datasets

## 🔄 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2025-11-29T10:00:00.000Z",
  "statusCode": 200
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-11-29T10:00:00.000Z",
  "statusCode": 400
}
```

## 📝 Logging & Monitoring

- Structured logging with timestamp and levels
- Request/response logging via Morgan
- Audit trail logging for sensitive operations
- Error logging with stack traces
- Performance monitoring ready

## 🚦 Deployment

### Backend Deployment
1. Build: `npm run build`
2. Set environment variables in production
3. Run migrations: `npm run db:migrate`
4. Start: `npm run start`

### Frontend Deployment
1. Build: `npm run build`
2. Serve `dist/` folder from CDN or web server
3. Configure CORS in backend for production domain

### Docker Support (Ready to Add)
- Dockerfile templates for backend and frontend
- Docker Compose for local development

## 📞 Support & Documentation

- API documentation available at `/api/docs`
- Database schema documentation in `database/`
- Code comments for complex logic
- Type definitions for IDE autocomplete

## 📄 License

This project is proprietary hospital management software. 

## 🤝 Contributing

Please follow the coding standards and submit pull requests for review.

## ⚠️ Important Notes

- Never commit `.env` files with sensitive credentials
- Always use HTTPS in production
- Regularly backup your database
- Keep dependencies updated for security patches
- Test thoroughly in staging before production deployment
- Ensure regular security audits
- Maintain audit logs for compliance

---

**Version:** 1.0.0  
**Last Updated:** November 29, 2025  
**Status:** Production Ready (Phase 1 - Foundation Complete)
