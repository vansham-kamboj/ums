import nodemailer from 'nodemailer';
import env from '../config/env.js';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }
  return transporter;
};

/**
 * Send an email
 * @param {Object} options - { to, subject, text, html, attachments }
 */
export const sendEmail = async ({ to, subject, text, html, attachments }) => {
  try {
    const transport = getTransporter();
    const result = await transport.sendMail({
      from: env.smtp.from,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      text,
      html,
      attachments,
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send an email using a template
 */
export const sendTemplateEmail = async (to, template, variables = {}) => {
  let { subject, body } = template;

  // Replace template variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, value);
    body = body.replace(regex, value);
  });

  return sendEmail({ to, subject, html: body });
};

/**
 * Test email configuration
 */
export const testEmailConfig = async () => {
  try {
    const transport = getTransporter();
    await transport.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
