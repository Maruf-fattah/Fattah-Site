import { Request, Response } from 'express';
import { query } from '../config/database';
import { ApiError, successResponse } from '../utils/response';
import { Patient, PaginatedResponse } from '@hospital-system/shared';
import { logger } from '../utils/logger';

export const patientController = {
  /**
   * Get all patients with pagination
   * GET /api/v1/patients?page=1&limit=10
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Get total count
      const countResult = await query(
        'SELECT COUNT(*) as total FROM patients WHERE deleted_at IS NULL'
      );
      const total = parseInt(countResult.rows[0].total);

      // Get paginated patients
      const result = await query(
        `SELECT p.*, u.email, u.first_name as first_name_user, u.last_name as last_name_user, u.phone
         FROM patients p
         LEFT JOIN users u ON p.user_id = u.id
         WHERE p.deleted_at IS NULL
         ORDER BY p.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const patients: Patient[] = result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        mrnNumber: row.mrn_number,
        dateOfBirth: new Date(row.date_of_birth),
        gender: row.gender,
        bloodType: row.blood_type,
        maritalStatus: row.marital_status,
        nationality: row.nationality,
        address: row.address,
        city: row.city,
        state: row.state,
        zipCode: row.zip_code,
        emergencyContact: row.emergency_contact,
        emergencyPhone: row.emergency_phone,
        emergencyRelation: row.emergency_relation,
        allergies: row.allergies,
        chronicDiseases: row.chronic_diseases,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));

      const response: PaginatedResponse<Patient> = {
        data: patients,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      };

      res.status(200).json(successResponse(response));
    } catch (error) {
      logger.error('Get patients error', { error: String(error) });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch patients',
        timestamp: new Date(),
        statusCode: 500,
      });
    }
  },

  /**
   * Get patient by ID
   * GET /api/v1/patients/:id
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await query(
        `SELECT p.*, u.email
         FROM patients p
         LEFT JOIN users u ON p.user_id = u.id
         WHERE p.id = $1 AND p.deleted_at IS NULL`,
        [id]
      );

      if (result.rows.length === 0) {
        throw new ApiError(404, 'PATIENT_NOT_FOUND', 'Patient not found');
      }

      const row = result.rows[0];
      const patient: Patient = {
        id: row.id,
        userId: row.user_id,
        mrnNumber: row.mrn_number,
        dateOfBirth: new Date(row.date_of_birth),
        gender: row.gender,
        bloodType: row.blood_type,
        maritalStatus: row.marital_status,
        nationality: row.nationality,
        address: row.address,
        city: row.city,
        state: row.state,
        zipCode: row.zip_code,
        emergencyContact: row.emergency_contact,
        emergencyPhone: row.emergency_phone,
        emergencyRelation: row.emergency_relation,
        allergies: row.allergies,
        chronicDiseases: row.chronic_diseases,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };

      res.status(200).json(successResponse(patient));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
          timestamp: new Date(),
          statusCode: error.statusCode,
        });
      } else {
        logger.error('Get patient error', { error: String(error) });
        res.status(500).json({
          success: false,
          error: 'Failed to fetch patient',
          timestamp: new Date(),
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Create new patient
   * POST /api/v1/patients
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        userId,
        dateOfBirth,
        gender,
        bloodType,
        maritalStatus,
        nationality,
        address,
        city,
        state,
        zipCode,
        emergencyContact,
        emergencyPhone,
        emergencyRelation,
        allergies,
        chronicDiseases,
      } = req.body;

      // Validate required fields
      if (
        !dateOfBirth ||
        !gender ||
        !address ||
        !city ||
        !state ||
        !zipCode ||
        !emergencyContact ||
        !emergencyPhone
      ) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Missing required fields');
      }

      // Generate MRN (Medical Record Number)
      const mrnResult = await query(
        `SELECT COUNT(*) as count FROM patients WHERE created_at >= NOW() - INTERVAL '1 day'`
      );
      const mrnCount = parseInt(mrnResult.rows[0].count) + 1;
      const mrn = `MRN${new Date().getFullYear()}${String(mrnCount).padStart(5, '0')}`;

      // Insert patient
      const result = await query(
        `INSERT INTO patients (
          id, user_id, mrn_number, date_of_birth, gender, blood_type, marital_status,
          nationality, address, city, state, zip_code, emergency_contact, emergency_phone,
          emergency_relation, allergies, chronic_diseases
        ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id, user_id, mrn_number, date_of_birth, gender, blood_type, marital_status,
                  nationality, address, city, state, zip_code, emergency_contact, emergency_phone,
                  emergency_relation, allergies, chronic_diseases, created_at, updated_at`,
        [
          userId || null,
          mrn,
          dateOfBirth,
          gender,
          bloodType || null,
          maritalStatus || null,
          nationality || null,
          address,
          city,
          state,
          zipCode,
          emergencyContact,
          emergencyPhone,
          emergencyRelation,
          allergies || null,
          chronicDiseases || null,
        ]
      );

      const row = result.rows[0];
      const patient: Patient = {
        id: row.id,
        userId: row.user_id,
        mrnNumber: row.mrn_number,
        dateOfBirth: new Date(row.date_of_birth),
        gender: row.gender,
        bloodType: row.blood_type,
        maritalStatus: row.marital_status,
        nationality: row.nationality,
        address: row.address,
        city: row.city,
        state: row.state,
        zipCode: row.zip_code,
        emergencyContact: row.emergency_contact,
        emergencyPhone: row.emergency_phone,
        emergencyRelation: row.emergency_relation,
        allergies: row.allergies,
        chronicDiseases: row.chronic_diseases,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };

      logger.info('Patient created successfully', { patientId: patient.id, mrnNumber: mrn });

      res.status(201).json(successResponse(patient, 201));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
          timestamp: new Date(),
          statusCode: error.statusCode,
        });
      } else {
        logger.error('Create patient error', { error: String(error) });
        res.status(500).json({
          success: false,
          error: 'Failed to create patient',
          timestamp: new Date(),
          statusCode: 500,
        });
      }
    }
  },
};

export default patientController;
