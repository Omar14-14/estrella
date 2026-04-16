import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { registerNotificationDevice } from '../services/notification.service';

export const registerDevice = async (req: AuthRequest, res: Response): Promise<void> => {
  const { expoPushToken } = req.body as { expoPushToken?: string };

  if (!expoPushToken) {
    res.status(400).json({ error: 'Token push requerido' });
    return;
  }

  try {
    await registerNotificationDevice(expoPushToken);
    res.status(201).json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Token push invalido' });
  }
};

