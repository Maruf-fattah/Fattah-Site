import jwt from 'jsonwebtoken';
import config from '../config/config';
import { User, UserRole } from '@hospital-system/shared';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRY,
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.REFRESH_TOKEN_SECRET as string, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET as string) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET as string) as {
      userId: string;
    };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
