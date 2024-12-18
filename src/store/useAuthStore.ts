import { create } from 'zustand';
import type { User } from '../types/user';
import { loginUser, registerUser, updateUserProfile } from '../lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateBalance: (newBalance: number) => void;
  initAuth: () => void;
}

// Funções auxiliares para localStorage
const saveToStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth_user');
  }
};

const loadFromStorage = (): User | null => {
  const stored = localStorage.getItem('auth_user');
  return stored ? JSON.parse(stored) : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: loadFromStorage() || null,
  isAuthenticated: Boolean(loadFromStorage()),

  initAuth: () => {
    const storedUser = loadFromStorage();
    if (storedUser) {
      set({ user: storedUser, isAuthenticated: true });
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      await registerUser(name, email, password);
      set({ user: null, isAuthenticated: false });
      saveToStorage(null);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      set({ user, isAuthenticated: true });
      saveToStorage(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false });
    saveToStorage(null);
  },

  updateProfile: async (data) => {
    const { user: currentUser } = useAuthStore.getState();
    if (!currentUser?.id) return;

    try {
      await updateUserProfile(currentUser.id, data);
      const updatedUser = { ...currentUser, ...data };
      set({ user: updatedUser });
      saveToStorage(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  updateBalance: (newBalance: number) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, balance: newBalance };
      saveToStorage(updatedUser);
      return { user: updatedUser };
    });
  },
}));