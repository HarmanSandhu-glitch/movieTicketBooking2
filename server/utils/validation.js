import mongoose from 'mongoose';
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const validateObjectId = (id, fieldName = 'ID') => {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ${fieldName}: ${id}`);
  }
  return true;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} is required`);
  }
  return true;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return true;
};

export const validateNumber = (value, fieldName, min = null, max = null) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a number`);
  }
  if (min !== null && num < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }
  if (max !== null && num > max) {
    throw new Error(`${fieldName} must be at most ${max}`);
  }
  return true;
};

export const validateEnum = (value, fieldName, allowedValues) => {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
  return true;
};
