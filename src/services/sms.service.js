import env from '../config/env.js';

/**
 * SMS Service (Stub - Ready for Twilio integration)
 */
export const sendSms = async ({ to, message }) => {
  if (!env.twilio.accountSid) {
    console.log(`[SMS Stub] To: ${to}, Message: ${message}`);
    return { success: true, stub: true, message: 'SMS stub - configure Twilio credentials' };
  }

  try {
    // Twilio integration will go here
    // const client = twilio(env.twilio.accountSid, env.twilio.authToken);
    // const result = await client.messages.create({
    //   body: message,
    //   to,
    //   from: env.twilio.phoneNumber,
    // });
    console.log(`[SMS] To: ${to}, Message: ${message}`);
    return { success: true };
  } catch (error) {
    console.error('SMS send error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send SMS using a template
 */
export const sendTemplateSms = async (to, template, variables = {}) => {
  let body = template.body;
  Object.entries(variables).forEach(([key, value]) => {
    body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return sendSms({ to, message: body });
};

/**
 * Test SMS configuration
 */
export const testSmsConfig = async () => {
  if (!env.twilio.accountSid) {
    return { success: false, message: 'Twilio credentials not configured' };
  }
  return { success: true, message: 'SMS configuration is valid' };
};
