const {
  hashPassword,
  comparePassword,
} = require("../../../src/utils/password.util");

describe("Password Util", () => {
  describe("hashPassword", () => {
    it("should hash password successfully", async () => {
      const plainPassword = "mySecurePassword123";

      const hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe("string");
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it("should generate different hashes for same password", async () => {
      const plainPassword = "samePassword123";

      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);

      // Due to salt, same password should produce different hashes
      expect(hash1).not.toBe(hash2);
    });

    it("should handle empty string", async () => {
      const emptyPassword = "";

      const hashedPassword = await hashPassword(emptyPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe("string");
    });

    it("should hash complex passwords with special characters", async () => {
      const complexPassword = "P@ssw0rd!@#$%^&*()_+-=[]{}|;:,.<>?";

      const hashedPassword = await hashPassword(complexPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(complexPassword);
    });

    it("should produce consistent hash length", async () => {
      const password1 = "short";
      const password2 = "this is a much longer password with more characters";

      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);

      // bcrypt hashes have consistent length regardless of input
      expect(hash1.length).toBe(hash2.length);
    });
  });

  describe("comparePassword", () => {
    it("should return true for correct password", async () => {
      const plainPassword = "correctPassword123";
      const hashedPassword = await hashPassword(plainPassword);

      const isMatch = await comparePassword(plainPassword, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const plainPassword = "correctPassword123";
      const wrongPassword = "wrongPassword456";
      const hashedPassword = await hashPassword(plainPassword);

      const isMatch = await comparePassword(wrongPassword, hashedPassword);

      expect(isMatch).toBe(false);
    });

    it("should return false for empty password", async () => {
      const plainPassword = "password123";
      const hashedPassword = await hashPassword(plainPassword);

      const isMatch = await comparePassword("", hashedPassword);

      expect(isMatch).toBe(false);
    });

    it("should be case-sensitive", async () => {
      const plainPassword = "Password123";
      const hashedPassword = await hashPassword(plainPassword);

      const isMatchLower = await comparePassword("password123", hashedPassword);
      const isMatchUpper = await comparePassword("PASSWORD123", hashedPassword);

      expect(isMatchLower).toBe(false);
      expect(isMatchUpper).toBe(false);
    });

    it("should handle special characters correctly", async () => {
      const plainPassword = "P@ssw0rd!#$%";
      const hashedPassword = await hashPassword(plainPassword);

      const isMatch = await comparePassword("P@ssw0rd!#$%", hashedPassword);
      const isNotMatch = await comparePassword("P@ssw0rd!#$", hashedPassword); // Missing %

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });
  });

  describe("password security", () => {
    it("should create cryptographically secure hashes", async () => {
      const password = "securePassword123";

      const hash = await hashPassword(password);

      // bcrypt hashes start with $2a$, $2b$, or $2y$
      expect(hash).toMatch(/^\$2[aby]\$/);
    });

    it("should verify password after hash", async () => {
      const originalPassword = "myOriginalPassword";

      const hashedPassword = await hashPassword(originalPassword);
      const isValid = await comparePassword(originalPassword, hashedPassword);

      expect(isValid).toBe(true);
    });

    it("should reject tampered passwords", async () => {
      const password = "originalPassword";
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(
        "originalPassword ",
        hashedPassword
      ); // Extra space

      expect(isValid).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle very long passwords", async () => {
      const longPassword = "a".repeat(100);

      const hashedPassword = await hashPassword(longPassword);
      const isMatch = await comparePassword(longPassword, hashedPassword);

      expect(hashedPassword).toBeDefined();
      expect(isMatch).toBe(true);
    });

    it("should handle unicode characters", async () => {
      const unicodePassword = "пароль密码🔐";

      const hashedPassword = await hashPassword(unicodePassword);
      const isMatch = await comparePassword(unicodePassword, hashedPassword);

      expect(hashedPassword).toBeDefined();
      expect(isMatch).toBe(true);
    });

    it("should handle whitespace in passwords", async () => {
      const passwordWithSpaces = "  password with spaces  ";

      const hashedPassword = await hashPassword(passwordWithSpaces);
      const isMatch = await comparePassword(passwordWithSpaces, hashedPassword);
      const isNotMatch = await comparePassword(
        "password with spaces",
        hashedPassword
      ); // Trimmed

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });
  });
});
