// Main export file - exports all notification functions
export * from './config';
export * from './discord';
export * from './email';
export * from './push';
export * from './handlers/user';
export * from './handlers/project';

// Re-export for convenience
export {
  // User notifications
  notifyNewUserSignup,
  notifyUserApproved,
  notifyUserRejected,
} from './handlers/user';

export {
  // Project notifications
  notifyNewProjectSubmission,
  notifyProjectApproved,
  notifyProjectRejected,
} from './handlers/project';

// Optional: Critical error notification for Winston integration
import { sendDiscordNotification } from './discord';
import { NOTIFICATION_CONFIG } from './config';
import logger from '../../utils/logger';

export async function sendCriticalErrorToDiscord(error: {
  message: string;
  stack?: string;
  level: string;
  timestamp: string;
}): Promise<void> {
  if (!NOTIFICATION_CONFIG.discord.errors) {
    return;
  }

  try {
    await sendDiscordNotification(NOTIFICATION_CONFIG.discord.errors, {
      title: '🚨 Critical Error',
      description: error.message,
      color: NOTIFICATION_CONFIG.colors.red,
      fields: [
        {
          name: 'Level',
          value: error.level.toUpperCase(),
          inline: true,
        },
        {
          name: 'Time',
          value: new Date(error.timestamp).toLocaleString(),
          inline: true,
        },
        ...(error.stack
          ? [
              {
                name: 'Stack Trace',
                value: '```' + error.stack.substring(0, 1000) + '```',
                inline: false,
              },
            ]
          : []),
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Failed to send critical error to Discord', {
      error: err.message,
    });
  }
}