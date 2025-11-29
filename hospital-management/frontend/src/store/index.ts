import { create } from 'zustand';
import { User, UserRole } from '@hospital-system/shared';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  hasRole: (role) => {
    const { user } = get();
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  },

  hasPermission: (requiredRole) => {
    return get().hasRole(requiredRole);
  },
}));

// Theme store
interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark' || false;

  return {
    isDarkMode: isDark,
    toggleTheme: () =>
      set((state) => {
        const newMode = !state.isDarkMode;
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
        return { isDarkMode: newMode };
      }),
    setDarkMode: (value) => {
      set({ isDarkMode: value });
      localStorage.setItem('theme', value ? 'dark' : 'light');
    },
  };
});
