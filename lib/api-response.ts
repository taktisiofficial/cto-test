export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export const apiResponse = {
  success: <T>(data: T, statusCode = 200): [ApiResponse<T>, number] => {
    return [
      {
        success: true,
        data,
      },
      statusCode,
    ];
  },

  error: (message: string, statusCode = 500): [ApiResponse, number] => {
    return [
      {
        success: false,
        error: message,
      },
      statusCode,
    ];
  },

  validationError: (
    errors: Record<string, string[]>
  ): [ApiResponse, number] => {
    return [
      {
        success: false,
        error: "Validation failed",
        errors,
      },
      400,
    ];
  },
};
