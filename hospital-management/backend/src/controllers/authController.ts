import { Request, Response } from 'express';
import { query } from '../config/database';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password';
import { ApiError, successResponse } from '../utils/response';
import { AuthResponse, User, UserRole, UserStatus, RegisterRequest, LoginRequest } from '@hospital-system/shared';
import { logger } from '../utils/logger';

export const authController = {
  /**
   * User Registration
   * POST /api/v1/auth/register
   */
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, phone, role } = req.body as RegisterRequest;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Missing required fields');
      }

      // Validate password strength
      const passwordCheck = validatePasswordStrength(password);
      if (!passwordCheck.isStrong) {
        throw new ApiError(400, 'WEAK_PASSWORD', passwordCheck.errors.join(', '));
      }

      // Check if user already exists
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        throw new ApiError(409, 'USER_EXISTS', 'User with this email already exists');
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const userRole = role || UserRole.PATIENT;
      const result = await query(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, status)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
         RETURNING id, email, first_name, last_name, phone, role, status, created_at, updated_at`,
        [email, passwordHash, firstName, lastName, phone || null, userRole, UserStatus.ACTIVE]
      );

      const user: User = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        phone: result.rows[0].phone,
        role: result.rows[0].role,
        status: result.rows[0].status,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at,
      };

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user.id);

      logger.info('User registered successfully', { userId: user.id, email: user.email });

      const response: AuthResponse = {
        user,
        accessToken,
        refreshToken,
        expiresIn: 86400, // 24 hours
      };

      res.status(201).json(successResponse(response, 201));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
          timestamp: new Date(),
          statusCode: error.statusCode,
        });
      } else {
        logger.error('Registration error', { error: String(error) });
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          timestamp: new Date(),
          statusCode: 500,
        });
      }
    }
  },

  /**
   * User Login
   * POST /api/v1/auth/login
   */
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as LoginRequest;

      if (!email || !password) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Email and password required');
      }

      // Find user
      const userResult = await query(
        `SELECT id, email, password_hash, first_name, last_name, phone, role, status, last_login, created_at, updated_at
         FROM users WHERE email = $1 AND deleted_at IS NULL`,
        [email]
      );

      if (userResult.rows.length === 0) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const userRow = userResult.rows[0];

      // Check if user is active
      if (userRow.status !== UserStatus.ACTIVE) {
        throw new ApiError(403, 'USER_INACTIVE', `User account is ${userRow.status}`);
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, userRow.password_hash);
      if (!isPasswordValid) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      // Update last login
      await query('UPDATE users SET last_login = NOW() WHERE id = $1', [userRow.id]);

      const user: User = {
        id: userRow.id,
        email: userRow.email,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        phone: userRow.phone,
        role: userRow.role,
        status: userRow.status,
        lastLogin: userRow.last_login,
        createdAt: userRow.created_at,
        updatedAt: userRow.updated_at,
      };

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user.id);

      logger.info('User logged in successfully', { userId: user.id, email: user.email });

      const response: AuthResponse = {
        user,
        accessToken,
        refreshToken,
        expiresIn: 86400,
      };

      res.status(200).json(successResponse(response));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
          timestamp: new Date(),
          statusCode: error.statusCode,
        });
      } else {
        logger.error('Login error', { error: String(error) });
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          timestamp: new Date(),
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Get Current User
   * GET /api/v1/auth/me
   */
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const userResult = await query(
        `SELECT id, email, first_name, last_name, phone, role, status, avatar, last_login, created_at, updated_at
         FROM users WHERE id = $1 AND deleted_at IS NULL`,
        [req.user.userId]
      );

      if (userResult.rows.length === 0) {
        throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
      }

      const userRow = userResult.rows[0];
      const user: User = {
        id: userRow.id,
        email: userRow.email,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        phone: userRow.phone,
        role: userRow.role,
        status: userRow.status,
        avatar: userRow.avatar,
        lastLogin: userRow.last_login,
        createdAt: userRow.created_at,
        updatedAt: userRow.updated_at,
      };

      res.status(200).json(successResponse(user));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
          timestamp: new Date(),
          statusCode: error.statusCode,
        });
      } else {
        logger.error('Get current user error', { error: String(error) });
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          timestamp: new Date(),
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Logout
   * POST /api/v1/auth/logout
   */
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      // Token invalidation would be handled on frontend by clearing localStorage
      logger.info('User logged out', { userId: req.user?.userId });
      res.status(200).json(successResponse({ message: 'Logged out successfully' }));
    } catch (error) {
      logger.error('Logout error', { error: String(error) });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
        statusCode: 500,
      });
    }
  },
};

export default authController;
