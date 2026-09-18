import prisma from '../config/database.js';
import { sendEmail, sendTemplateEmail } from './email.service.js';
import { sendSms, sendTemplateSms } from './sms.service.js';
import { sendWhatsapp, sendTemplateWhatsapp } from './whatsapp.service.js';

/**
 * Unified Notification Service
 * Dispatches notifications across multiple channels: in-app, email, SMS, WhatsApp, push
 */

/**
 * Send an in-app notification
 */
export const createNotification = async ({ userId, title, body, type, data }) => {
  return prisma.notification.create({
    data: { userId, title, body, type, data },
  });
};

/**
 * Send notification to multiple users
 */
export const createBulkNotifications = async (userIds, { title, body, type, data }) => {
  return prisma.notification.createMany({
    data: userIds.map(userId => ({ userId, title, body, type, data })),
  });
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return { notifications, total };
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId, userId) => {
  return prisma.notification.update({
    where: { id: notificationId, userId },
    data: { isRead: true, readAt: new Date() },
  });
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
};

/**
 * Get unread count
 */
export const getUnreadCount = async (userId) => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

/**
 * Multi-channel notification dispatch
 * Sends via specified channels: ['inApp', 'email', 'sms', 'whatsapp']
 */
export const dispatchNotification = async ({
  userId,
  channels = ['inApp'],
  title,
  body,
  type,
  data,
  email,
  phone,
  templateSlug,
  variables = {},
}) => {
  const results = {};

  if (channels.includes('inApp')) {
    results.inApp = await createNotification({ userId, title, body, type, data });
  }

  if (channels.includes('email') && email) {
    if (templateSlug) {
      const template = await prisma.mailTemplate.findFirst({ where: { slug: templateSlug, isActive: true } });
      if (template) {
        results.email = await sendTemplateEmail(email, template, variables);
      }
    } else {
      results.email = await sendEmail({ to: email, subject: title, html: body });
    }
  }

  if (channels.includes('sms') && phone) {
    if (templateSlug) {
      const template = await prisma.smsTemplate.findFirst({ where: { slug: templateSlug, isActive: true } });
      if (template) {
        results.sms = await sendTemplateSms(phone, template, variables);
      }
    } else {
      results.sms = await sendSms({ to: phone, message: body });
    }
  }

  if (channels.includes('whatsapp') && phone) {
    if (templateSlug) {
      const template = await prisma.whatsappTemplate.findFirst({ where: { slug: templateSlug, isActive: true } });
      if (template) {
        results.whatsapp = await sendTemplateWhatsapp(phone, template, variables);
      }
    } else {
      results.whatsapp = await sendWhatsapp({ to: phone, message: body });
    }
  }

  return results;
};
