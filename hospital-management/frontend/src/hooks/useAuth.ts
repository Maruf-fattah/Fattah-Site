import { useAuthStore } from '../store';
import { UserRole } from '@hospital-system/shared';

export const useAuth = () => {
  return useAuthStore();
};

export const useAuthCheck = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return {
    isAuthenticated,
    user,
    isSuperAdmin: user?.role === UserRole.SUPER_ADMIN,
    isAdmin: user?.role === UserRole.ADMIN,
    isDoctor: user?.role === UserRole.DOCTOR,
    isNurse: user?.role === UserRole.NURSE,
    isLabTech: user?.role === UserRole.LAB_TECHNICIAN,
    isPharmacist: user?.role === UserRole.PHARMACIST,
    isReceptionist: user?.role === UserRole.RECEPTIONIST,
    isAccountant: user?.role === UserRole.ACCOUNTANT,
    isPatient: user?.role === UserRole.PATIENT,
  };
};
