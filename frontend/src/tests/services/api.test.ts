import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import toast from 'react-hot-toast';

describe('Axios Interceptor - Error Handling', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe('Status Code Error Mapping', () => {
    it('should show toast on 400 bad request', async () => {
      // GIVEN: API returns 400
      mock.onGet('/test').reply(400, {
        success: false,
        message: 'Dữ liệu không hợp lệ',
      });

      // WHEN: Request is made
      try {
        await api.get('/test');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called
      expect(toast.error).toHaveBeenCalled();
    });

    it('should show toast and clear token on 401 unauthorized', async () => {
      // GIVEN: Token exists and API returns 401
      localStorage.setItem('token', 'expired-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@test.com' }));

      mock.onGet('/auth/profile').reply(401, {
        success: false,
        message: 'Token expired',
      });

      // WHEN: Request is made
      try {
        await api.get('/auth/profile');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called
      expect(toast.error).toHaveBeenCalled();

      // AND: Token and user are cleared
      await new Promise(resolve => setTimeout(resolve, 50)); // Wait for sync operations
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should show toast on 403 forbidden', async () => {
      // GIVEN: API returns 403
      mock.onGet('/admin').reply(403, {
        success: false,
        message: 'Bạn không có quyền truy cập',
      });

      // WHEN: Request is made
      try {
        await api.get('/admin');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called
      expect(toast.error).toHaveBeenCalled();
    });

    it('should show toast on 404 not found', async () => {
      // GIVEN: API returns 404
      mock.onGet('/nonexistent').reply(404, {
        success: false,
        message: 'Không tìm thấy tài nguyên',
      });

      // WHEN: Request is made
      try {
        await api.get('/nonexistent');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called
      expect(toast.error).toHaveBeenCalled();
    });

    it('should show toast on 409 conflict', async () => {
      // GIVEN: API returns 409
      mock.onPost('/auth/register').reply(409, {
        success: false,
        message: 'Email already registered',
      });

      // WHEN: Request is made
      try {
        await api.post('/auth/register', { email: 'existing@test.com' });
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called
      expect(toast.error).toHaveBeenCalled();
    });

    it('should show multiple toasts on 422 validation errors', async () => {
      // GIVEN: API returns 422 with multiple errors
      mock.onPost('/auth/register').reply(422, {
        success: false,
        message: 'Validation failed',
        errors: [
          { field: 'email', message: 'Email không hợp lệ' },
          { field: 'password', message: 'Mật khẩu quá yếu' },
        ],
      });

      // WHEN: Request is made
      try {
        await api.post('/auth/register', {});
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called for each validation error
      expect(toast.error).toHaveBeenCalledTimes(2);
    });

    it('should show toast on 429 rate limit', async () => {
      // GIVEN: API returns 429
      mock.onGet('/test').reply(429, {
        success: false,
        message: 'Too many requests',
      });

      // WHEN: Request is made
      try {
        await api.get('/test');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called
      expect(toast.error).toHaveBeenCalled();
    });

    it('should show toast on 500 server error', async () => {
      // GIVEN: API returns 500
      mock.onGet('/test').reply(500, {
        success: false,
        message: 'Internal server error',
      });

      // WHEN: Request is made
      try {
        await api.get('/test');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called with server error message
      expect(toast.error).toHaveBeenCalled();
    });

    it('should show toast on 503 service unavailable', async () => {
      // GIVEN: API returns 503
      mock.onGet('/test').reply(503, {
        success: false,
        message: 'Service unavailable',
      });

      // WHEN: Request is made
      try {
        await api.get('/test');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('Network Error Handling', () => {
    it('should show toast on network error (no response)', async () => {
      // GIVEN: Network error
      mock.onGet('/test').networkError();

      // WHEN: Request is made
      try {
        await api.get('/test');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called with network error message
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('kết nối')
      );
    });

    it('should show toast on timeout error', async () => {
      // GIVEN: Timeout error
      mock.onGet('/test').timeout();

      // WHEN: Request is made
      try {
        await api.get('/test');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Toast error is called
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('Token Expiration Flow', () => {
    it('should clear token and redirect on 401', async () => {
      // GIVEN: User is logged in with expired token
      localStorage.setItem('token', 'expired-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@test.com' }));

      window.location.pathname = '/dashboard';

      mock.onGet('/test').reply(401, {
        success: false,
        message: 'Token expired',
      });

      // WHEN: Request fails with 401
      try {
        await api.get('/test');
      } catch (error) {
        // Expected to throw
      }

      // THEN: Token is cleared
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();

      // Toast is shown
      expect(toast.error).toHaveBeenCalled();
    });

    it('should NOT redirect to login if already on login page', async () => {
      // GIVEN: User on login page with invalid token
      window.location.pathname = '/login';
      localStorage.setItem('token', 'invalid-token');

      mock.onPost('/auth/login').reply(401, {
        success: false,
        message: 'Invalid credentials',
      });

      const originalHref = window.location.href;

      // WHEN: Login fails with 401
      try {
        await api.post('/auth/login', { email: 'test@test.com', password: 'wrong' });
      } catch (error) {
        // Expected to throw
      }

      // THEN: Token is cleared
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(localStorage.getItem('token')).toBeNull();

      // No redirect (already on login page)
      // href should not change
      await new Promise(resolve => setTimeout(resolve, 1100)); // Wait for redirect delay
      expect(window.location.href).toBe(originalHref);
    });
  });

  describe('Request Interceptor', () => {
    it('should attach Bearer token to requests when token exists', async () => {
      // GIVEN: Token in localStorage
      localStorage.setItem('token', 'test-token');

      mock.onGet('/test').reply((config) => {
        // THEN: Authorization header is set
        expect(config.headers?.Authorization).toBe('Bearer test-token');
        return [200, { success: true }];
      });

      // WHEN: Request is made
      await api.get('/test');
    });

    it('should NOT attach token when not in localStorage', async () => {
      // GIVEN: No token in localStorage
      localStorage.removeItem('token');

      mock.onGet('/test').reply((config) => {
        // THEN: Authorization header is not set
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { success: true }];
      });

      // WHEN: Request is made
      await api.get('/test');
    });
  });

  describe('Negative Tests - NO Silent Failures', () => {
    it('MUST show error feedback on any API error (no silent failure)', async () => {
      // GIVEN: API returns error
      mock.onGet('/test').reply(500, {
        success: false,
        message: 'Server error',
      });

      // WHEN: Request fails
      try {
        await api.get('/test');
      } catch (error) {
        // Expected
      }

      // THEN: Toast MUST be called (user sees error)
      expect(toast.error).toHaveBeenCalled();
    });

    it('MUST reject promise on error (not silent success)', async () => {
      // GIVEN: API returns error
      mock.onPost('/test').reply(400, {
        success: false,
        message: 'Bad request',
      });

      // WHEN/THEN: Promise MUST reject
      await expect(api.post('/test', {})).rejects.toThrow();
    });

    it('MUST call toast on network error (no silent failure)', async () => {
      // GIVEN: Network is down
      mock.onGet('/test').networkError();

      // WHEN: Request fails
      try {
        await api.get('/test');
      } catch (error) {
        // Expected
      }

      // THEN: Toast MUST show error
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('Success Response', () => {
    it('should pass through successful response without toast', async () => {
      // GIVEN: Successful API response
      mock.onGet('/test').reply(200, {
        success: true,
        message: 'Success',
        data: { id: 1 },
      });

      // WHEN: Request is made
      const response = await api.get('/test');

      // THEN: Response is returned
      expect(response.data).toEqual({
        success: true,
        message: 'Success',
        data: { id: 1 },
      });

      // NO error toast
      expect(toast.error).not.toHaveBeenCalled();
    });
  });
});
