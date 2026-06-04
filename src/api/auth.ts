import { apiFetch } from './client';
import { User } from '../types';

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (email: string, password: string, name: string): Promise<{ token: string; user: User }> => {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return apiFetch('/auth/me');
};
