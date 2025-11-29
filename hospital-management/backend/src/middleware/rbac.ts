import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@hospital-system/shared';
import { ApiError } from '../utils/response';

// Role hierarchy for permission inheritance
const roleHierarchy: Record<UserRole, UserRole[]> = {
  [UserRole.SUPER_ADMIN]: [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.LAB_TECHNICIAN,
    UserRole.PHARMACIST,
    UserRole.RECEPTIONIST,
    UserRole.ACCOUNTANT,
    UserRole.PATIENT,
  ],
  [UserRole.ADMIN]: [
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.LAB_TECHNICIAN,
    UserRole.PHARMACIST,
    UserRole.RECEPTIONIST,
    UserRole.ACCOUNTANT,
  ],
  [UserRole.DOCTOR]: [UserRole.DOCTOR],
  [UserRole.NURSE]: [UserRole.NURSE],
  [UserRole.LAB_TECHNICIAN]: [UserRole.LAB_TECHNICIAN],
  [UserRole.PHARMACIST]: [UserRole.PHARMACIST],
  [UserRole.RECEPTIONIST]: [UserRole.RECEPTIONIST],
  [UserRole.ACCOUNTANT]: [UserRole.ACCOUNTANT],
  [UserRole.PATIENT]: [UserRole.PATIENT],
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const userRole = req.user.role;
      const hasPermission = allowedRoles.includes(userRole);

      if (!hasPermission) {
        throw new ApiError(
          403,
          'FORBIDDEN',
          `User role ${userRole} is not authorized for this resource`
        );
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
          timestamp: new Date(),
          statusCode: error.statusCode,
        });
      } else {
        res.status(403).json({
          success: false,
          error: 'Access forbidden',
          timestamp: new Date(),
          statusCode: 403,
        });
      }
    }
  };
};

export const requireAllRoles = (...requiredRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const userRole = req.user.role;
      const hasAllRoles = requiredRoles.every((role) => role === userRole);

      if (!hasAllRoles) {
        throw new ApiError(
          403,
          'FORBIDDEN',
          `User does not have all required roles`
        );
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
          timestamp: new Date(),
          statusCode: error.statusCode,
        });
      } else {
        res.status(403).json({
          success: false,
          error: 'Access forbidden',
          timestamp: new Date(),
          statusCode: 403,
        });
      }
    }
  };
};

export const requireAdminOrAbove = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const adminRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
  requireRole(...adminRoles)(req, res, next);
};

export const requireMedicalStaff = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const medicalRoles = [
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.LAB_TECHNICIAN,
    UserRole.PHARMACIST,
  ];
  requireRole(...medicalRoles)(req, res, next);
};
