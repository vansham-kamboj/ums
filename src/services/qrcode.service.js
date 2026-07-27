import QRCode from 'qrcode';

/**
 * QR Code Generation Service
 */

/**
 * Generate a QR code as a data URL (base64)
 */
export const generateQrDataUrl = async (data, options = {}) => {
  return QRCode.toDataURL(data, {
    width: options.width || 200,
    margin: options.margin || 2,
    color: {
      dark: options.darkColor || '#000000',
      light: options.lightColor || '#ffffff',
    },
  });
};

/**
 * Generate a QR code as a buffer
 */
export const generateQrBuffer = async (data, options = {}) => {
  return QRCode.toBuffer(data, {
    type: 'png',
    width: options.width || 200,
    margin: options.margin || 2,
  });
};

/**
 * Generate a QR code and save to file
 */
export const generateQrFile = async (data, filePath, options = {}) => {
  return QRCode.toFile(filePath, data, {
    type: 'png',
    width: options.width || 200,
    margin: options.margin || 2,
  });
};
