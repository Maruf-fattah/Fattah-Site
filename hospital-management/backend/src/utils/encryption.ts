import crypto from 'crypto';
import config from '../config/config';

// Encrypt sensitive data for storage in database
export const encryptData = (data: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', config.ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decrypt sensitive data retrieved from database
export const decryptData = (encryptedData: string): string => {
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', config.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
};

// Generate unique identifiers
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

// Generate secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash sensitive data (one-way)
export const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};
