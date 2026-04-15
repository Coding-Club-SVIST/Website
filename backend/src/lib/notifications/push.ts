import webpush from 'web-push';
import prisma from '../../config/database';
import logger from '../../utils/logger';
import { PushSubscription } from '@prisma/client';

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
            logger.error("Subscription deletion error")
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
  const CHUNK_SIZE = 100;
  const MAX_CONCURRENT_CHUNKS = 5;
  let lastId: number | undefined;
  const payloadString = JSON.stringify(payload);

  // Helper function to send notifications for a single chunk
  const sendChunk = async (subscriptions: PushSubscription[]) => {
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
          try {
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            });
          } catch (delError) {
            logger.error("Subscription deletion error");
          }
        } else {
          logger.error(`Error sending push notification:`, error);
        }
      }
    });

    await Promise.allSettled(notifications);
  };

  // Collect all chunks from the database
  const chunks = [];
  
  while (true) {
    const subscriptions = await prisma.pushSubscription.findMany({
      take: CHUNK_SIZE,
      ...(lastId && { skip: 1, cursor: { id: lastId } }),
      orderBy: { id: 'asc' },
    });

    if (subscriptions.length === 0) {
      break;
    }

    lastId = subscriptions[subscriptions.length - 1].id;
    chunks.push(subscriptions);
  }

  // Process chunks concurrently in batches of MAX_CONCURRENT_CHUNKS
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT_CHUNKS) {
    const batch = chunks.slice(i, i + MAX_CONCURRENT_CHUNKS);
    await Promise.allSettled(batch.map(sendChunk));
  }
}
