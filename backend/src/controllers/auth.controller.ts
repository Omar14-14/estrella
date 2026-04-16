import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PinValidationRequest } from '../types';

// El PIN se guarda hasheado en Firestore (colección: config, doc: pin)
// Por ahora usamos una comparación directa para el scaffolding
export const validatePin = async (req: Request, res: Response): Promise<void> => {
  const { pin } = req.body as PinValidationRequest;

  if (!pin || pin.length < 4) {
    res.status(400).json({ error: 'PIN inválido' });
    return;
  }

  try {
    // TODO: comparar con PIN almacenado en Firestore
    const storedPin = process.env.APP_PIN ?? '0000';
    if (pin !== storedPin) {
      res.status(401).json({ error: 'PIN incorrecto' });
      return;
    }

    const token = jwt.sign(
      { sessionId: Date.now().toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '12h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
