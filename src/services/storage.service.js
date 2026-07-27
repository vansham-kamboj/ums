import fs from 'fs';
import path from 'path';
import env from '../config/env.js';

/**
 * File Storage Abstraction Service
 * Supports: Local, S3/Wasabi (stubs)
 */

/**
 * Get the full file path for a stored file
 */
export const getFilePath = (filename) => {
  return path.join(env.storage.uploadDir, filename);
};

/**
 * Get the file URL for serving
 */
export const getFileUrl = (filename) => {
  if (env.storage.driver === 'local') {
    return `/uploads/${filename}`;
  }
  // S3/Wasabi URL would go here
  return `/uploads/${filename}`;
};

/**
 * Delete a file
 */
export const deleteFile = async (filename) => {
  if (env.storage.driver === 'local') {
    const filePath = getFilePath(filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
  // S3/Wasabi delete would go here
  return false;
};

/**
 * Ensure upload directory exists
 */
export const ensureUploadDir = () => {
  const uploadDir = env.storage.uploadDir;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

/**
 * Get file info
 */
export const getFileInfo = (filename) => {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) return null;

  const stats = fs.statSync(filePath);
  return {
    name: filename,
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
  };
};
