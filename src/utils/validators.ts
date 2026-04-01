import { VALIDATION, ERROR_MESSAGES } from './constants';

// ==================== VALIDATORS ====================

export const validators = {
  email: (value: string): boolean => {
    return VALIDATION.EMAIL_REGEX.test(value);
  },

  password: (value: string): boolean => {
    return value.length >= VALIDATION.PASSWORD_MIN_LENGTH && 
           value.length <= VALIDATION.PASSWORD_MAX_LENGTH;
  },

  strongPassword: (value: string): boolean => {
    return VALIDATION.PASSWORD_REGEX.test(value);
  },

  phone: (value: string): boolean => {
    return VALIDATION.PHONE_REGEX.test(value.replace(/\D/g, ''));
  },

  pincode: (value: string): boolean => {
    return VALIDATION.PINCODE_REGEX.test(value);
  },

  name: (value: string): boolean => {
    return value.length >= VALIDATION.NAME_MIN_LENGTH && 
           value.length <= VALIDATION.NAME_MAX_LENGTH;
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  number: (value: string | number): boolean => {
    return !isNaN(Number(value));
  },

  min: (value: number, min: number): boolean => {
    return value >= min;
  },

  max: (value: number, max: number): boolean => {
    return value <= max;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  match: (value: string, compareTo: string): boolean => {
    return value === compareTo;
  },
};

// ==================== VALIDATION RULES ====================

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export const validationRules = {
  required: (fieldName: string = 'This field'): ValidationRule => ({
    validate: (value) => validators.required(value),
    message: `${fieldName} is required`,
  }),

  email: (): ValidationRule => ({
    validate: (value) => !value || validators.email(value),
    message: ERROR_MESSAGES.INVALID_EMAIL,
  }),

  password: (): ValidationRule => ({
    validate: (value) => validators.password(value),
    message: 'Password must be at least 8 characters',
  }),

  strongPassword: (): ValidationRule => ({
    validate: (value) => validators.strongPassword(value),
    message: ERROR_MESSAGES.INVALID_PASSWORD,
  }),

  phone: (): ValidationRule => ({
    validate: (value) => !value || validators.phone(value),
    message: ERROR_MESSAGES.INVALID_PHONE,
  }),

  pincode: (): ValidationRule => ({
    validate: (value) => !value || validators.pincode(value),
    message: 'Please enter a valid pincode',
  }),

  name: (): ValidationRule => ({
    validate: (value) => validators.name(value),
    message: 'Name must be between 2 and 100 characters',
  }),

  url: (): ValidationRule => ({
    validate: (value) => !value || validators.url(value),
    message: 'Please enter a valid URL',
  }),

  minLength: (min: number): ValidationRule => ({
    validate: (value) => validators.minLength(value || '', min),
    message: `Must be at least ${min} characters`,
  }),

  maxLength: (max: number): ValidationRule => ({
    validate: (value) => validators.maxLength(value || '', max),
    message: `Must be at most ${max} characters`,
  }),

  min: (min: number): ValidationRule => ({
    validate: (value) => validators.min(Number(value), min),
    message: `Must be at least ${min}`,
  }),

  max: (max: number): ValidationRule => ({
    validate: (value) => validators.max(Number(value), max),
    message: `Must be at most ${max}`,
  }),

  match: (compareTo: string, fieldName: string = 'fields'): ValidationRule => ({
    validate: (value) => validators.match(value, compareTo),
    message: `${fieldName} must match`,
  }),
};

// ==================== FORM VALIDATION ====================

export interface ValidateFormInput {
  [fieldName: string]: any;
}

export interface ValidateFormRules {
  [fieldName: string]: ValidationRule[];
}

export const validateForm = (
  values: ValidateFormInput,
  rules: ValidateFormRules
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  Object.keys(rules).forEach((fieldName) => {
    const fieldRules = rules[fieldName];
    const value = values[fieldName];

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        errors[fieldName] = rule.message;
        break;
      }
    }
  });

  return errors;
};

// ==================== SPECIFIC VALIDATORS ====================

export const validateEmail = (email: string): string => {
  if (!email) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (!validators.email(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (!validators.password(password)) {
    return 'Password must be at least 8 characters';
  }
  return '';
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string => {
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORD_MISMATCH;
  }
  return '';
};

export const validatePhone = (phone: string): string => {
  if (!phone) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (!validators.phone(phone)) return ERROR_MESSAGES.INVALID_PHONE;
  return '';
};

export const validateName = (name: string): string => {
  if (!name) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (!validators.name(name)) {
    return 'Name must be between 2 and 100 characters';
  }
  return '';
};
