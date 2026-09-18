import prisma from '../config/database.js';

/**
 * Payment Gateway Abstraction Service
 * Supports: Razorpay, Stripe (stubs for others)
 */

/**
 * Create a payment order
 */
export const createPaymentOrder = async ({ gateway, amount, currency = 'INR', metadata = {} }) => {
  // Create local transaction record
  const transaction = await prisma.paymentTransaction.create({
    data: {
      gateway,
      amount,
      currency,
      status: 'Pending',
      payerName: metadata.payerName,
      payerEmail: metadata.payerEmail,
      payerPhone: metadata.payerPhone,
      metadata,
    },
  });

  let gatewayOrder = null;

  switch (gateway) {
    case 'razorpay':
      // Razorpay order creation stub
      gatewayOrder = {
        id: `order_${transaction.id}`,
        amount: amount * 100, // Razorpay expects paise
        currency,
        receipt: transaction.id,
      };
      break;

    case 'stripe':
      // Stripe payment intent stub
      gatewayOrder = {
        id: `pi_${transaction.id}`,
        amount: amount * 100, // Stripe expects smallest unit
        currency: currency.toLowerCase(),
        client_secret: `secret_${transaction.id}`,
      };
      break;

    default:
      gatewayOrder = {
        id: transaction.id,
        amount,
        currency,
      };
  }

  // Update with gateway order ID
  await prisma.paymentTransaction.update({
    where: { id: transaction.id },
    data: { orderId: gatewayOrder.id },
  });

  return { transaction, gatewayOrder };
};

/**
 * Verify and process a payment
 */
export const verifyPayment = async ({ gateway, orderId, transactionId, responseData }) => {
  const transaction = await prisma.paymentTransaction.findFirst({
    where: { orderId },
  });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  let isValid = false;

  switch (gateway) {
    case 'razorpay':
      // Razorpay signature verification stub
      // In production: verify signature using HMAC-SHA256
      isValid = true;
      break;

    case 'stripe':
      // Stripe webhook verification stub
      isValid = true;
      break;

    default:
      isValid = true;
  }

  const status = isValid ? 'Completed' : 'Failed';

  const updated = await prisma.paymentTransaction.update({
    where: { id: transaction.id },
    data: {
      transactionId,
      status,
      responseData,
    },
  });

  return { transaction: updated, isValid };
};

/**
 * Get payment status
 */
export const getPaymentStatus = async (orderId) => {
  return prisma.paymentTransaction.findFirst({
    where: { orderId },
  });
};

/**
 * Get active payment gateways
 */
export const getActiveGateways = async () => {
  return prisma.paymentGatewayConfig.findMany({
    where: { isActive: true },
    select: { id: true, name: true, provider: true, isTestMode: true },
  });
};
