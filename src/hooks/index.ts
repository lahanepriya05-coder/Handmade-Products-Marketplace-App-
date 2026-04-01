import { useState, useCallback, useRef, useEffect } from 'react';
import { VALIDATION, DEBOUNCE, ERROR_MESSAGES } from '../utils/constants';
import { validateForm, ValidateFormRules } from '../utils/validators';

// ==================== useForm HOOK ====================

export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Record<string, string>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, isTouched: boolean) => void;
  resetForm: () => void;
  setValues: (values: T) => void;
  setErrors: (errors: Record<string, string>) => void;
}

export const useForm = <T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> => {
  const { initialValues, onSubmit, validate, validateOnChange = true, validateOnBlur = true } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);

  const validateField = useCallback(
    (fieldName: string, value: any) => {
      if (!validate) return '';

      const fieldErrors = validate({ ...values, [fieldName]: value });
      return fieldErrors[fieldName] || '';
    },
    [validate, values]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({ ...prev, [name]: fieldValue }));

      if (validateOnChange && touched[name]) {
        const error = validateField(name, fieldValue);
        setErrors((prev) => (error ? { ...prev, [name]: error } : { ...prev, [name]: '' }));
      }
    },
    [validateOnChange, touched, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateOnBlur) {
        const error = validateField(name, values[name as keyof T]);
        setErrors((prev) => (error ? { ...prev, [name]: error } : { ...prev, [name]: '' }));
      }
    },
    [validateOnBlur, validateField, values]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (validate) {
        const formErrors = validate(values);
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
          return;
        }
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, values, onSubmit]
  );

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    setValues,
    setErrors,
  };
};

// ==================== useFetch HOOK ====================

export interface UseFetchOptions {
  skip?: boolean;
  cacheTime?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const fetchCache = new Map<string, { data: any; timestamp: number }>();

export const useFetch = <T = any>(
  url: string | null,
  options?: UseFetchOptions
): { data: T | null; loading: boolean; error: string | null; refetch: () => Promise<void> } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip && !!url);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    // Check cache
    const cached = fetchCache.get(url);
    if (cached && Date.now() - cached.timestamp < (options?.cacheTime || 5 * 60 * 1000)) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      fetchCache.set(url, { data: result, timestamp: Date.now() });

      options?.onSuccess?.(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      options?.onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (!options?.skip) {
      fetchData();
    }
  }, [url, options?.skip, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// ==================== useDebounce HOOK ====================

export const useDebounce = <T = any>(value: T, delay: number = DEBOUNCE.INPUT): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ==================== useLocalStorage HOOK ====================

export const useLocalStorage = <T = any>(
  key: string,
  initialValue?: T
): [T | null, (value: T) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue || null;
    } catch {
      return initialValue || null;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('localStorage error:', error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(null);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage error:', error);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
};

// ==================== usePagination HOOK ====================

export interface UsePaginationOptions {
  itemsPerPage?: number;
  initialPage?: number;
}

export const usePagination = <T = any>(
  items: T[],
  options?: UsePaginationOptions
) => {
  const itemsPerPage = options?.itemsPerPage || 10;
  const [currentPage, setCurrentPage] = useState(options?.initialPage || 1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

// ==================== useAsync HOOK ====================

export interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export const useAsync = <T = any, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
  options?: UseAsyncOptions<T>
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      setError(error as E);
      setStatus('error');
      options?.onError?.(error as E);
    } finally {
      options?.onSettled?.();
    }
  }, [asyncFunction, options]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
};

// ==================== useMeasure HOOK ====================

export const useMeasure = (deps?: React.DependencyList) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect());
      }
    };

    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, deps);

  return [ref, rect] as const;
};

// ==================== useToggle HOOK ====================

export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle] as const;
};

// ==================== useClickOutside HOOK ====================

export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);

  return ref;
};

// ==================== usePrevious HOOK ====================

export const usePrevious = <T = any>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// ==================== useProfile HOOK ====================

/**
 * useProfile - Hook for accessing profile context
 * Provides: user data, loading state, error handling, update/password change methods
 * 
 * Usage:
 * const { user, loading, error, updateProfile, changePassword } = useProfile();
 */
export const useProfile = () => {
  // Import dynamically to avoid circular dependency
  const ProfileContext = require('../contexts/ProfileContext').ProfileContext;
  const context = require('react').useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }

  return context;
};
