export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
  timestamp: string;
}

export const sendSuccess = <T>(data: T, message = 'Success'): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
});

export const sendError = (error: string, message: string, details?: any): ApiResponse => ({
  success: false,
  error,
  message,
  details,
  timestamp: new Date().toISOString(),
});