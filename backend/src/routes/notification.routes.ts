import { Router } from 'express';
import { authenticate, requirePermission } from '../middlewares/auth.middleware';
import { Permission } from '../types';
import { PushNotificationController } from '../controllers/notification.controller';

const router = Router();

router.get('/vapid-key', PushNotificationController.getVapidPublicKey);

// Authentication required for these routes
router.use(authenticate);
router.post('/subscribe', PushNotificationController.subscribe);
router.post('/unsubscribe', PushNotificationController.unsubscribe);
router.post('/send', requirePermission(Permission.SEND_NOTIFICATIONS), PushNotificationController.sendNotification);

export default router;
