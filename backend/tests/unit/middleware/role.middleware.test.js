const { requireRole } = require("../../../src/middleware/role.middleware");
const {
  createTestUser,
  cleanupDatabase,
} = require("../../helpers/testHelpers");

describe("Role Middleware", () => {
  let candidate, recruiter, admin;
  let req, res, next;

  beforeEach(async () => {
    await cleanupDatabase();

    candidate = await createTestUser({
      email: "candidate@example.com",
      role: "candidate",
    });
    recruiter = await createTestUser({
      email: "recruiter@example.com",
      role: "recruiter",
    });
    admin = await createTestUser({ email: "admin@example.com", role: "admin" });

    req = {
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("requireRole - single role", () => {
    it("should allow user with correct role", () => {
      req.user = recruiter;
      const middleware = requireRole("recruiter");

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject user with incorrect role", () => {
      req.user = candidate;
      const middleware = requireRole("recruiter");

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Access denied. Insufficient permissions.",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should reject when no user attached", () => {
      req.user = null;
      const middleware = requireRole("recruiter");

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("requireRole - multiple roles", () => {
    it("should allow user with one of allowed roles", () => {
      req.user = recruiter;
      const middleware = requireRole(["recruiter", "admin"]);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should allow admin when multiple roles specified", () => {
      req.user = admin;
      const middleware = requireRole(["recruiter", "admin"]);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject user not in allowed roles", () => {
      req.user = candidate;
      const middleware = requireRole(["recruiter", "admin"]);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("role hierarchy", () => {
    it("should allow admin role for any permission check", () => {
      req.user = admin;
      const middleware = requireRole("candidate");

      middleware(req, res, next);

      // Assuming admin has access to everything
      // This test depends on your actual implementation
      // Adjust based on whether admin should bypass or not
      expect(next).toHaveBeenCalled();
    });

    it("should not allow candidate to access recruiter endpoints", () => {
      req.user = candidate;
      const middleware = requireRole("recruiter");

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("should not allow recruiter to access admin endpoints", () => {
      req.user = recruiter;
      const middleware = requireRole("admin");

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
