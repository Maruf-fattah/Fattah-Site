import { ApiResponse, ErrorResponse } from '@hospital-system/shared';

export const successResponse = <T>(
  data: T,
  statusCode: number = 200
): ApiResponse<T> => {
  return {
    success: true,
    data,
    timestamp: new Date(),
    statusCode,
  };
};

export const errorResponse = (
  code: string,
  message: string,
  details?: Record<string, unknown>,
  statusCode: number = 400
): ApiResponse<null> => {
  return {
    success: false,
    error: message,
    timestamp: new Date(),
    statusCode,
  };
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const createErrorResponse = (error: ApiError): ErrorResponse => {
  return {
    code: error.code,
    message: error.message,
    details: error.details,
    timestamp: new Date(),
  };
};
