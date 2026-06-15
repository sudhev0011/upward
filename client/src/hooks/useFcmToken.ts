import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { api } from '@/api/axios';
import { messaging } from '@/utils/firebase/firebaseConfig';
import { toast } from 'sonner';

export const useFcmToken = (isAuthenticated: boolean) => {
  useEffect(() => {
    const requestPermissionAndRegister = async () => {
      try {
        // 1. Request permission from the browser user interface
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Notification permission denied by user.');
          return;
        }

        // 2. Fetch the registration token from Firebase
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_REACT_APP_FIREBASE_VAPID_KEY // The key generated in Step 3 of backend configuration
        });

        if (token) {
          // 3. Post the token to your Express API layer
          await api.post('/api/notifications/fcm-token', {
            token: token,
            deviceType: 'web'
          });
          console.log('FCM Token successfully synced to backend.');
        } else {
          console.warn('No registration token available. Check your configuration permissions.');
        }
      } catch (error) {
        console.error('An error occurred while retrieving FCM token:', error);
      }
    };

    if (isAuthenticated) {
      requestPermissionAndRegister();

      // 4. Listen for foreground notifications (when user is actively using the app)
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received: ', payload);
        toast.notification(payload?.data?.title,{
          description: payload?.data?.body
        })
      });

      return () => unsubscribe();
    }
  }, [isAuthenticated]);
};