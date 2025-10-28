/**
 * Standard API response utilities for consistent response formatting
 */

export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const validationErrorResponse = (res, errors) => {
  return errorResponse(res, `Validation failed ${errors}`, 400, errors);
};

export const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(res, `${resource} not found`, 404);
};

export const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return errorResponse(res, message, 401);
};

export const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, message, 403);
};
