import { Router } from 'express';
import authRoutes from './auth.routes';
import memberRoutes from './member.routes';
import projectRoutes from './project.routes';
import skillRoutes from './skill.routes';
import tagRoutes from './tag.routes';
import eventRoutes from './event.routes';
import adminRoutes from './admin.routes';
import customRoleRoutes from './customRole.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/members', memberRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/tags', tagRoutes);
router.use('/events', eventRoutes);
router.use('/admin', adminRoutes);
router.use('/admin/custom-roles', customRoleRoutes);
router.use('/notifications', notificationRoutes);

export default router;
