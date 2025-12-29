const authService = require("../../../src/services/auth.service");
const { User } = require("../../../src/models");
const {
  hashPassword,
  comparePassword,
} = require("../../../src/utils/password.util");
const { cleanupDatabase } = require("../../helpers/testHelpers");

describe("Auth Service", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "newuser@example.com",
        password: "password123",
        full_name: "New User",
        role: "candidate",
        phone: "0123456789",
      };

      const result = await authService.register(userData);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe(userData.email);
      expect(result.user.full_name).toBe(userData.full_name);
      expect(result.user.role).toBe(userData.role);
      expect(result.user.password).toBeUndefined();
    });

    it("should throw error for duplicate email", async () => {
      const userData = {
        email: "duplicate@example.com",
        password: "password123",
        full_name: "User One",
        role: "candidate",
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow(
        "Email already registered"
      );
    });

    it("should hash password before saving", async () => {
      const userData = {
        email: "hashtest@example.com",
        password: "password123",
        full_name: "Hash Test",
        role: "candidate",
      };

      await authService.register(userData);

      const user = await User.findOne({ where: { email: userData.email } });
      expect(user.password).not.toBe(userData.password);

      const isPasswordValid = await comparePassword(
        userData.password,
        user.password
      );
      expect(isPasswordValid).toBe(true);
    });

    it("should default to candidate role if not specified", async () => {
      const userData = {
        email: "defaultrole@example.com",
        password: "password123",
        full_name: "Default Role",
      };

      const result = await authService.register(userData);

      expect(result.user.role).toBe("candidate");
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      await authService.register({
        email: "logintest@example.com",
        password: "password123",
        full_name: "Login Test",
        role: "candidate",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const result = await authService.login(
        "logintest@example.com",
        "password123"
      );

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe("logintest@example.com");
      expect(result.user.password).toBeUndefined();
    });

    it("should throw error for invalid email", async () => {
      await expect(
        authService.login("nonexistent@example.com", "password123")
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error for wrong password", async () => {
      await expect(
        authService.login("logintest@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error for inactive account", async () => {
      await User.update(
        { is_active: false },
        { where: { email: "logintest@example.com" } }
      );

      await expect(
        authService.login("logintest@example.com", "password123")
      ).rejects.toThrow("Account is inactive");
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      const registered = await authService.register({
        email: "profile@example.com",
        password: "password123",
        full_name: "Profile Test",
        role: "candidate",
      });

      const profile = await authService.getProfile(registered.user.id);

      expect(profile.email).toBe("profile@example.com");
      expect(profile.full_name).toBe("Profile Test");
      expect(profile.password).toBeUndefined();
    });

    it("should throw error for non-existent user", async () => {
      await expect(authService.getProfile(99999)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("updateProfile", () => {
    it("should update user profile successfully", async () => {
      const registered = await authService.register({
        email: "update@example.com",
        password: "password123",
        full_name: "Original Name",
        role: "candidate",
      });

      const updated = await authService.updateProfile(registered.user.id, {
        full_name: "Updated Name",
        phone: "0987654321",
      });

      expect(updated.full_name).toBe("Updated Name");
      expect(updated.phone).toBe("0987654321");
    });

    it("should not update password through updateProfile", async () => {
      const registered = await authService.register({
        email: "noupdate@example.com",
        password: "password123",
        full_name: "No Update",
        role: "candidate",
      });

      const originalUser = await User.findByPk(registered.user.id);
      const originalPassword = originalUser.password;

      await authService.updateProfile(registered.user.id, {
        password: "newpassword",
      });

      const updatedUser = await User.findByPk(registered.user.id);
      expect(updatedUser.password).toBe(originalPassword);
    });
  });

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      const registered = await authService.register({
        email: "changepass@example.com",
        password: "oldpassword",
        full_name: "Change Pass",
        role: "candidate",
      });

      await authService.changePassword(
        registered.user.id,
        "oldpassword",
        "newpassword"
      );

      // Should be able to login with new password
      const result = await authService.login(
        "changepass@example.com",
        "newpassword"
      );
      expect(result.user.email).toBe("changepass@example.com");
    });

    it("should throw error for incorrect old password", async () => {
      const registered = await authService.register({
        email: "wrongold@example.com",
        password: "password123",
        full_name: "Wrong Old",
        role: "candidate",
      });

      await expect(
        authService.changePassword(
          registered.user.id,
          "wrongpassword",
          "newpassword"
        )
      ).rejects.toThrow("Current password is incorrect");
    });
  });
});
