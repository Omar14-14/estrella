import { useState } from 'react';
import { validatePin } from '../services/auth.service';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const login = async (pin: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    const success = await validatePin(pin);
    if (!success) setError('PIN incorrecto');
    setLoading(false);
    return success;
  };

  return { login, loading, error };
};
