import { useCallback, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerPushNotifications } from '../services/notifications.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  const registeringRef = useRef(false);

  const register = useCallback(async () => {
    if (registeringRef.current) return;

    registeringRef.current = true;
    try {
      await registerPushNotifications();
    } catch (error) {
      console.warn('No se pudieron registrar notificaciones push:', error);
    } finally {
      registeringRef.current = false;
    }
  }, []);

  useEffect(() => {
    const responseSub = Notifications.addNotificationResponseReceivedListener(() => undefined);
    return () => {
      responseSub.remove();
    };
  }, []);

  return { register };
}

