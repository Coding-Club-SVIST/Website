import webpush from 'web-push';
import prisma from '../../config/database';
import logger from '../../utils/logger';

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidEmail = `mailto:${process.env.NOTIFICATION_EMAIL}` || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: {
    url?: string;
  };
}

export async function sendPushNotification(
  userId: number,
  payload: PushNotificationPayload
): Promise<void> {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  if (subscriptions.length === 0) {
    return;
  }

  const payloadString = JSON.stringify(payload);

  const notifications = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payloadString
      );
    } catch (error: any) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        // Subscription expired or gone, remove it
        try {
            await prisma.pushSubscription.delete({
            where: { id: sub.id },
            });
        } catch (delError) {
            // Already deleted or some other issue
        }
      } else {
        logger.error(`Error sending push notification to user ${userId}:`, error);
      }
    }
  });

  await Promise.allSettled(notifications);
}

export async function sendPushNotificationToAll(
  payload: PushNotificationPayload
): Promise<void> {
  const subscriptions = await prisma.pushSubscription.findMany();

  if (subscriptions.length === 0) {
    return;
  }

  const payloadString = JSON.stringify(payload);

  const notifications = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payloadString
      );
    } catch (error: any) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        // Subscription expired or gone, remove it
        try {
            await prisma.pushSubscription.delete({
                where: { id: sub.id },
            });
        } catch (delError) {
            // Already deleted or some other issue
        }
      } else {
        logger.error(`Error sending push notification:`, error);
      }
    }
  });

  await Promise.allSettled(notifications);
}
