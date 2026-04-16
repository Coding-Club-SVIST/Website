import { Request, Response } from 'express';
import prisma from '../config/database';
import { asyncHandler } from '../utils/asyncHandler';
import { sendPushNotification, sendPushNotificationToAll } from '../lib/notifications/push';

export class PushNotificationController {
  static subscribe = asyncHandler(async (req: Request, res: Response) => {
    const { endpoint, keys } = req.body;
    const userId = (req as any).user.id;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ message: 'Invalid subscription data' });
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      create: {
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    res.status(201).json({ message: 'Subscribed successfully' });
  });

  static unsubscribe = asyncHandler(async (req: Request, res: Response) => {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ message: 'Endpoint is required' });
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint },
    });

    res.status(200).json({ message: 'Unsubscribed successfully' });
  });

  static getVapidPublicKey = asyncHandler(async (_req: Request, res: Response) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey) {
      return res.status(500).json({ message: 'VAPID public key not configured' });
    }
    res.status(200).json({ publicKey });
  });

  static sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const { title, body, url, userId, userIds } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    if (userIds && Array.isArray(userIds)) {
      const promises = userIds.map(id => sendPushNotification(Number(id), {
        title,
        body,
        data: { url },
      }));
      await Promise.allSettled(promises);
      res.status(200).json({ message: `Notification sent to ${userIds.length} users` });
    } else if (userId) {
      await sendPushNotification(Number(userId), {
        title,
        body,
        data: { url },
      });
      res.status(200).json({ message: `Notification sent to user ${userId}` });
    } else {
      await sendPushNotificationToAll({
        title,
        body,
        data: { url },
      });
      res.status(200).json({ message: 'Notification sent to all subscribers' });
    }
  });
}