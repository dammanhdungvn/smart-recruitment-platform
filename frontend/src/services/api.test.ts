import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

// Mock axios
vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should create axios instance with correct base URL', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:5000/api');
  });

  it('should add Authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-token-123');

    const mockRequest = {
      headers: {},
    };

    // Get the request interceptor
    const interceptors = (api.interceptors.request as any).handlers;
    const requestInterceptor = interceptors[0];

    if (requestInterceptor && requestInterceptor.fulfilled) {
      const result = requestInterceptor.fulfilled(mockRequest);
      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    }
  });

  it('should not add Authorization header when token does not exist', async () => {
    const mockRequest = {
      headers: {},
    };

    const interceptors = (api.interceptors.request as any).handlers;
    const requestInterceptor = interceptors[0];

    if (requestInterceptor && requestInterceptor.fulfilled) {
      const result = requestInterceptor.fulfilled(mockRequest);
      expect(result.headers.Authorization).toBeUndefined();
    }
  });

  it('should redirect to /login on 401 error', async () => {
    const originalLocation = window.location.href;
    
    // Mock window.location.href setter
    delete (window as any).location;
    window.location = { href: '' } as any;

    const mockError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
      },
    };

    const interceptors = (api.interceptors.response as any).handlers;
    const responseInterceptor = interceptors[0];

    if (responseInterceptor && responseInterceptor.rejected) {
      try {
        await responseInterceptor.rejected(mockError);
      } catch (error) {
        // Expected to throw
      }

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(window.location.href).toBe('/login');
    }

    // Restore
    window.location.href = originalLocation;
  });

  it('should pass through non-401 errors', async () => {
    const mockError = {
      response: {
        status: 500,
        data: { message: 'Server error' },
      },
    };

    const interceptors = (api.interceptors.response as any).handlers;
    const responseInterceptor = interceptors[0];

    if (responseInterceptor && responseInterceptor.rejected) {
      await expect(responseInterceptor.rejected(mockError)).rejects.toEqual(mockError);
    }
  });

  it('should handle network errors without response', async () => {
    const mockError = {
      message: 'Network Error',
    };

    const interceptors = (api.interceptors.response as any).handlers;
    const responseInterceptor = interceptors[0];

    if (responseInterceptor && responseInterceptor.rejected) {
      await expect(responseInterceptor.rejected(mockError)).rejects.toEqual(mockError);
    }
  });
});
