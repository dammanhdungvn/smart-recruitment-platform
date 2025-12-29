const authMiddleware = require("../../../src/middleware/auth.middleware");
const { generateToken } = require("../../../src/utils/jwt.util");
const {
  createTestUser,
  cleanupDatabase,
} = require("../../helpers/testHelpers");

describe("Auth Middleware", () => {
  let user;
  let req, res, next;

  beforeEach(async () => {
    await cleanupDatabase();
    user = await createTestUser({ email: "user@example.com" });

    req = {
      headers: {},
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("authenticateToken", () => {
    it("should authenticate valid token successfully", async () => {
      const token = generateToken({ userId: user.id });
      req.headers.authorization = `Bearer ${token}`;

      await authMiddleware.authenticateToken(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(user.id);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject request without token", async () => {
      await authMiddleware.authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Access token is missing",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should reject invalid token format", async () => {
      req.headers.authorization = "InvalidTokenFormat";

      await authMiddleware.authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should reject expired token", async () => {
      // Generate token that expires immediately
      const token = generateToken({ userId: user.id }, "0s");
      req.headers.authorization = `Bearer ${token}`;

      // Wait a bit to ensure expiration
      await new Promise((resolve) => setTimeout(resolve, 100));

      await authMiddleware.authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should reject when user not found in database", async () => {
      const token = generateToken({ userId: 99999 }); // Non-existent user
      req.headers.authorization = `Bearer ${token}`;

      await authMiddleware.authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "User not found",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should reject inactive user", async () => {
      // Update user to inactive
      await user.update({ is_active: false });

      const token = generateToken({ userId: user.id });
      req.headers.authorization = `Bearer ${token}`;

      await authMiddleware.authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "User account is inactive",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("optionalAuth", () => {
    it("should attach user if valid token provided", async () => {
      const token = generateToken({ userId: user.id });
      req.headers.authorization = `Bearer ${token}`;

      await authMiddleware.optionalAuth(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(user.id);
      expect(next).toHaveBeenCalled();
    });

    it("should proceed without user if no token provided", async () => {
      await authMiddleware.optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should proceed without user if invalid token provided", async () => {
      req.headers.authorization = "Bearer invalid_token";

      await authMiddleware.optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
