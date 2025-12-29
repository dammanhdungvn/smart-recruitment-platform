const { generateToken, verifyToken } = require("../../../src/utils/jwt.util");

describe("JWT Util", () => {
  describe("generateToken", () => {
    it("should generate valid JWT token", () => {
      const payload = { userId: 123, email: "test@example.com" };

      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("should generate token with custom expiration", () => {
      const payload = { userId: 123 };

      const token = generateToken(payload, "1h");

      expect(token).toBeDefined();

      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(123);
    });

    it("should include payload data in token", () => {
      const payload = {
        userId: 456,
        email: "user@example.com",
        role: "candidate",
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token successfully", () => {
      const payload = { userId: 789 };
      const token = generateToken(payload);

      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(789);
      expect(decoded.iat).toBeDefined(); // issued at
      expect(decoded.exp).toBeDefined(); // expiration
    });

    it("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.string";

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });

    it("should throw error for expired token", () => {
      const payload = { userId: 123 };
      const token = generateToken(payload, "0s"); // Expires immediately

      // Wait a bit to ensure expiration
      return new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
        expect(() => {
          verifyToken(token);
        }).toThrow();
      });
    });

    it("should throw error for malformed token", () => {
      const malformedToken = "not-a-jwt-token";

      expect(() => {
        verifyToken(malformedToken);
      }).toThrow();
    });

    it("should throw error for token with invalid signature", () => {
      const payload = { userId: 123 };
      const token = generateToken(payload);

      // Tamper with the token by changing last character
      const tamperedToken = token.slice(0, -5) + "xxxxx";

      expect(() => {
        verifyToken(tamperedToken);
      }).toThrow();
    });
  });

  describe("token lifecycle", () => {
    it("should generate and verify token successfully", () => {
      const originalPayload = {
        userId: 999,
        email: "lifecycle@example.com",
      };

      const token = generateToken(originalPayload);
      const decodedPayload = verifyToken(token);

      expect(decodedPayload.userId).toBe(originalPayload.userId);
      expect(decodedPayload.email).toBe(originalPayload.email);
    });

    it("should maintain data integrity through encode/decode cycle", () => {
      const complexPayload = {
        userId: 111,
        email: "complex@example.com",
        role: "recruiter",
        permissions: ["read", "write"],
      };

      const token = generateToken(complexPayload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(complexPayload.userId);
      expect(decoded.email).toBe(complexPayload.email);
      expect(decoded.role).toBe(complexPayload.role);
      expect(decoded.permissions).toEqual(complexPayload.permissions);
    });
  });
});
