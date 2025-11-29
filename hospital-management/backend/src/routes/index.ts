import { Router, Request, Response } from 'express';
import { authController } from '../controllers/authController';
import { patientController } from '../controllers/patientController';
import { authMiddleware, requireRole, requireAdminOrAbove, requireMedicalStaff } from '../middleware';
import { UserRole } from '@hospital-system/shared';

const router = Router();

// ============================================
// AUTH ROUTES
// ============================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.getCurrentUser);
router.post('/auth/logout', authMiddleware, authController.logout);

// ============================================
// PATIENT ROUTES
// ============================================
router.get(
  '/patients',
  authMiddleware,
  requireRole(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.RECEPTIONIST
  ),
  patientController.getAll
);

router.post(
  '/patients',
  authMiddleware,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPTIONIST),
  patientController.create
);

router.get(
  '/patients/:id',
  authMiddleware,
  patientController.getById
);

// ============================================
// HEALTH CHECK
// ============================================
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
  });
});

export default router;
