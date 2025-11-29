// User Roles - 9-role RBAC system
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  PHARMACIST = 'PHARMACIST',
  RECEPTIONIST = 'RECEPTIONIST',
  ACCOUNTANT = 'ACCOUNTANT',
  PATIENT = 'PATIENT'
}

// User status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED'
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication response
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

// Patient-specific fields
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum BloodType {
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-'
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

export interface Patient {
  id: string;
  userId: string;
  mrnNumber: string; // Medical Record Number
  dateOfBirth: Date;
  gender: Gender;
  bloodType: BloodType;
  maritalStatus: MaritalStatus;
  nationality?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  allergies?: string;
  chronicDiseases?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment related
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED'
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  queueNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Medical Record
export enum RecordType {
  CONSULTATION = 'CONSULTATION',
  DIAGNOSIS = 'DIAGNOSIS',
  PRESCRIPTION = 'PRESCRIPTION',
  LAB_RESULT = 'LAB_RESULT',
  IMAGING = 'IMAGING',
  PROCEDURE = 'PROCEDURE'
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  recordType: RecordType;
  title: string;
  description: string;
  findings?: string;
  recommendations?: string;
  isConfidential: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Prescription
export enum PrescriptionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface Prescription {
  id: string;
  medicalRecordId: string;
  patientId: string;
  doctorId: string;
  medicineId: string;
  dosage: string;
  frequency: string;
  duration: number;
  durationUnit: 'days' | 'weeks' | 'months';
  instructions?: string;
  status: PrescriptionStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Laboratory/Diagnostic
export enum TestStatus {
  ORDERED = 'ORDERED',
  SAMPLE_COLLECTED = 'SAMPLE_COLLECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  REPORTED = 'REPORTED',
  CANCELLED = 'CANCELLED'
}

export interface LabTest {
  id: string;
  patientId: string;
  orderedByDoctorId: string;
  testName: string;
  testCode: string;
  category: string;
  status: TestStatus;
  sampleType: string;
  orderedDate: Date;
  sampleCollectionDate?: Date;
  reportDate?: Date;
  normalRange?: string;
  result?: string;
  unit?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Medicine/Pharmacy
export enum MedicineStatus {
  ACTIVE = 'ACTIVE',
  DISCONTINUED = 'DISCONTINUED',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  medicineCode: string;
  category: string;
  manufacturer?: string;
  strength: string;
  unit: string;
  status: MedicineStatus;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  taxRate: number;
  expiryDate?: Date;
  batchNumber?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Billing
export enum BillingType {
  OPD = 'OPD',
  IPD = 'IPD',
  PHARMACY = 'PHARMACY',
  DIAGNOSTIC = 'DIAGNOSTIC'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  INSURANCE = 'INSURANCE'
}

export interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  billingType: BillingType;
  items: BillingItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  insuranceId?: string;
  insuranceAmount?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headOfDepartment?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  statusCode: number;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Error response
export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  tableName: string;
  recordId: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}
