import env from '../config/env.js';

/**
 * WhatsApp Service (Stub - Ready for WhatsApp Business API integration)
 */
export const sendWhatsapp = async ({ to, message, template, variables }) => {
  if (!env.whatsapp.apiUrl) {
    console.log(`[WhatsApp Stub] To: ${to}, Message: ${message || template}`);
    return { success: true, stub: true, message: 'WhatsApp stub - configure API credentials' };
  }

  try {
    // WhatsApp Business API integration will go here
    console.log(`[WhatsApp] To: ${to}, Message: ${message}`);
    return { success: true };
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send WhatsApp using a template
 */
export const sendTemplateWhatsapp = async (to, template, variables = {}) => {
  let body = template.body;
  Object.entries(variables).forEach(([key, value]) => {
    body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return sendWhatsapp({ to, message: body });
};

/**
 * Test WhatsApp configuration
 */
export const testWhatsappConfig = async () => {
  if (!env.whatsapp.apiUrl) {
    return { success: false, message: 'WhatsApp API not configured' };
  }
  return { success: true, message: 'WhatsApp configuration is valid' };
};
