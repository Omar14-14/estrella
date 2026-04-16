import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import diaryRoutes from './routes/diary.routes';
import galleryRoutes from './routes/gallery.routes';
import notificationsRoutes from './routes/notifications.routes';
import { startDailyNotificationScheduler } from './services/notification.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/notifications', notificationsRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

startDailyNotificationScheduler();

export default app;
