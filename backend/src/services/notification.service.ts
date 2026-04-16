import { createHash } from 'crypto';
import { db } from '../config/firebase';
import { DAILY_NOTIFICATION_PHRASES } from '../constants/notificationPhrases';

const COLLECTION = 'notificationDevices';
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const DEFAULT_TIMEZONE = 'America/Mexico_City';
const SEND_HOUR = 23;
const SEND_MINUTE = 0;

interface NotificationDevice {
  expoPushToken: string;
  active: boolean;
  remainingPhraseIds?: number[];
  createdAt: string;
  updatedAt: string;
  lastSentAt?: string;
  lastSentDate?: string;
}

function shufflePhraseIds(): number[] {
  const ids = DAILY_NOTIFICATION_PHRASES.map((_phrase, index) => index);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

function tokenDocId(expoPushToken: string): string {
  return createHash('sha256').update(expoPushToken).digest('hex');
}

function isExpoPushToken(token: string): boolean {
  return /^Expo(nent)?PushToken\[[\w-]+\]$/.test(token);
}

function getTimezoneParts(timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => parts.find(part => part.type === type)?.value ?? '00';
  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  };
}

async function sendExpoPush(expoPushToken: string, body: string) {
  const response = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      body,
      sound: 'default',
      priority: 'high',
    }),
  });

  if (!response.ok) {
    throw new Error(`Expo push failed with status ${response.status}`);
  }

  return response.json();
}

export async function registerNotificationDevice(expoPushToken: string) {
  if (!isExpoPushToken(expoPushToken)) {
    throw new Error('Token push invalido');
  }

  const id = tokenDocId(expoPushToken);
  const ref = db.collection(COLLECTION).doc(id);
  const now = new Date().toISOString();
  const existing = await ref.get();

  if (!existing.exists) {
    await ref.set({
      expoPushToken,
      active: true,
      remainingPhraseIds: shufflePhraseIds(),
      createdAt: now,
      updatedAt: now,
    });
    return;
  }

  await ref.set({
    expoPushToken,
    active: true,
    updatedAt: now,
  }, { merge: true });
}

export async function sendDailyNotifications(dateKey: string) {
  const snapshot = await db.collection(COLLECTION).where('active', '==', true).get();
  const now = new Date().toISOString();

  await Promise.all(snapshot.docs.map(async (doc) => {
    const device = doc.data() as NotificationDevice;
    if (!device.expoPushToken || device.lastSentDate === dateKey) return;

    const queue = device.remainingPhraseIds?.length
      ? [...device.remainingPhraseIds]
      : shufflePhraseIds();
    const phraseId = queue.shift();
    if (phraseId === undefined) return;

    const nextQueue = queue.length > 0 ? queue : shufflePhraseIds();
    const body = DAILY_NOTIFICATION_PHRASES[phraseId];

    try {
      await sendExpoPush(device.expoPushToken, body);
      await doc.ref.set({
        remainingPhraseIds: nextQueue,
        lastSentAt: now,
        lastSentDate: dateKey,
        updatedAt: now,
      }, { merge: true });
    } catch (error) {
      console.error('Error enviando notificacion push:', error);
    }
  }));
}

export function startDailyNotificationScheduler() {
  let lastRunDate = '';
  const timeZone = process.env.NOTIFICATION_TIMEZONE ?? DEFAULT_TIMEZONE;

  const checkAndSend = async () => {
    const { dateKey, hour, minute } = getTimezoneParts(timeZone);
    if (hour !== SEND_HOUR || minute !== SEND_MINUTE || lastRunDate === dateKey) return;

    try {
      await sendDailyNotifications(dateKey);
      lastRunDate = dateKey;
    } catch (error) {
      console.error('Error ejecutando ciclo diario de notificaciones:', error);
    }
  };

  void checkAndSend();
  setInterval(() => {
    void checkAndSend();
  }, 60 * 1000);
}
