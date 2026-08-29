export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
  timestamp: string;
}

export function sendSuccess<T>(
  data: T,
  message = 'Operation successful'
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function sendError(
  error: string,
  message: string,
  details: any = null
): ApiResponse {
  return {
    success: false,
    error,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
}