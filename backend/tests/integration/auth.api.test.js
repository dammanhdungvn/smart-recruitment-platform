const request = require("supertest");
const app = require("../../src/app");
const { cleanupDatabase, createTestUser } = require("../helpers/testHelpers");

describe("Auth API Integration Tests", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("POST /api/auth/register", () => {
    it("should register new candidate successfully", async () => {
      const userData = {
        email: "newcandidate@example.com",
        password: "Password123!",
        full_name: "New Candidate",
        role: "candidate",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.role).toBe(userData.role);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined(); // Password should not be returned
    });

    it("should register new recruiter successfully", async () => {
      const userData = {
        email: "newrecruiter@example.com",
        password: "Password123!",
        full_name: "New Recruiter",
        role: "recruiter",
        company: "Tech Corp",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe("recruiter");
      expect(response.body.data.user.company).toBe(userData.company);
    });

    it("should reject duplicate email", async () => {
      const userData = {
        email: "duplicate@example.com",
        password: "Password123!",
        full_name: "User One",
        role: "candidate",
      };

      // Register first user
      await request(app).post("/api/auth/register").send(userData).expect(201);

      // Try to register with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already");
    });

    it("should reject invalid email format", async () => {
      const userData = {
        email: "invalid-email",
        password: "Password123!",
        full_name: "Test User",
        role: "candidate",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject weak password", async () => {
      const userData = {
        email: "test@example.com",
        password: "123", // Too weak
        full_name: "Test User",
        role: "candidate",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject missing required fields", async () => {
      const userData = {
        email: "test@example.com",
        // Missing password, full_name, role
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    let existingUser;

    beforeEach(async () => {
      existingUser = await createTestUser({
        email: "existing@example.com",
        password: "Password123!",
        role: "candidate",
      });
    });

    it("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "existing@example.com",
          password: "Password123!",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe("existing@example.com");
      expect(response.body.data.user.password).toBeUndefined();
    });

    it("should reject incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "existing@example.com",
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid email or password");
    });

    it("should reject non-existent user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "Password123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject inactive user", async () => {
      await existingUser.update({ is_active: false });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "existing@example.com",
          password: "Password123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("inactive");
    });
  });

  describe("GET /api/auth/profile", () => {
    let user, token;

    beforeEach(async () => {
      const result = await createTestUser({
        email: "profile@example.com",
        role: "candidate",
      });
      user = result;

      // Login to get token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "profile@example.com",
        password: "Password123!",
      });

      token = loginResponse.body.data.token;
    });

    it("should get profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("profile@example.com");
      expect(response.body.data.user.password).toBeUndefined();
    });

    it("should reject request without token", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid_token")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/auth/profile", () => {
    let user, token;

    beforeEach(async () => {
      user = await createTestUser({
        email: "update@example.com",
        full_name: "Original Name",
        role: "candidate",
      });

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "update@example.com",
        password: "Password123!",
      });

      token = loginResponse.body.data.token;
    });

    it("should update profile successfully", async () => {
      const updates = {
        full_name: "Updated Name",
        phone: "0123456789",
      };

      const response = await request(app)
        .put("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.full_name).toBe(updates.full_name);
      expect(response.body.data.user.phone).toBe(updates.phone);
    });

    it("should not allow email update", async () => {
      const updates = {
        email: "newemail@example.com",
      };

      const response = await request(app)
        .put("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(updates)
        .expect(200);

      // Email should not be changed
      expect(response.body.data.user.email).toBe("update@example.com");
    });
  });

  describe("PUT /api/auth/change-password", () => {
    let user, token;

    beforeEach(async () => {
      user = await createTestUser({
        email: "changepass@example.com",
        password: "OldPassword123!",
        role: "candidate",
      });

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "changepass@example.com",
        password: "OldPassword123!",
      });

      token = loginResponse.body.data.token;
    });

    it("should change password successfully", async () => {
      const response = await request(app)
        .post("/api/auth/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "OldPassword123!",
          newPassword: "NewPassword123!",
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify can login with new password
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: "changepass@example.com",
          password: "NewPassword123!",
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it("should reject incorrect current password", async () => {
      const response = await request(app)
        .post("/api/auth/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "WrongPassword123!",
          newPassword: "NewPassword123!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
