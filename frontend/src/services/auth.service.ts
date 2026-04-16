import { api } from './api';
import { tokenStorage } from './tokenStorage';

export const validatePin = async (pin: string): Promise<boolean> => {
  try {
    const { data } = await api.post('/auth/validate-pin', { pin });
    await tokenStorage.set(data.token);
    return true;
  } catch {
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await tokenStorage.remove();
};

export const getToken = async (): Promise<string | null> => {
  return tokenStorage.get();
};
