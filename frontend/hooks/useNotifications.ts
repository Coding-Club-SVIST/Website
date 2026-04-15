import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../lib/api';

export const useNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const checkSubscription = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setLoading(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      
      setIsSubscribed(!!sub);
      setSubscription(sub);
      setPermission(Notification.permission);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscription();

    // Listen for permission changes using the Permissions API
    let permissionStatus: PermissionStatus | null = null;
    
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' as PermissionName }).then((status) => {
        permissionStatus = status;
        const handleChange = () => {
          setPermission(Notification.permission);
          checkSubscription();
        };
        
        status.addEventListener('change', handleChange);
        
        // Cleanup listener
        return () => {
          status.removeEventListener('change', handleChange);
        };
      }).catch(err => {
        console.warn('Permissions API not supported or failed:', err);
      });
    }

    // Fallback: check on window focus
    window.addEventListener('focus', checkSubscription);

    return () => {
      window.removeEventListener('focus', checkSubscription);
    };
  }, [checkSubscription]);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      const registration = await navigator.serviceWorker.ready;
      const { data } = await notificationApi.getVapidPublicKey();
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      await notificationApi.subscribe(sub);
      
      setIsSubscribed(true);
      setSubscription(sub);
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  };

  const unsubscribe = async () => {
    try {
      if (subscription) {
        await notificationApi.unsubscribe(subscription.endpoint);
        await subscription.unsubscribe();
      }
      
      setIsSubscribed(false);
      setSubscription(null);
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  };

  return {
    isSubscribed,
    subscription,
    loading,
    permission,
    subscribe,
    unsubscribe,
  };
};
