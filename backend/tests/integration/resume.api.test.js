const request = require("supertest");
const app = require("../../src/app");
const path = require("path");
const fs = require("fs");
const {
  cleanupDatabase,
  createTestUser,
  createTestResume,
} = require("../helpers/testHelpers");

describe("Resume API Integration Tests", () => {
  let candidate, candidateToken;
  let recruiter, recruiterToken;

  beforeEach(async () => {
    await cleanupDatabase();

    // Create and login candidate
    candidate = await createTestUser({
      email: "candidate@example.com",
      role: "candidate",
    });
    const candidateLogin = await request(app).post("/api/auth/login").send({
      email: "candidate@example.com",
      password: "Password123!",
    });
    candidateToken = candidateLogin.body.data.token;

    // Create and login recruiter
    recruiter = await createTestUser({
      email: "recruiter@example.com",
      role: "recruiter",
    });
    const recruiterLogin = await request(app).post("/api/auth/login").send({
      email: "recruiter@example.com",
      password: "Password123!",
    });
    recruiterToken = recruiterLogin.body.data.token;
  });

  describe("POST /api/resumes/upload", () => {
    it("should upload resume successfully", async () => {
      // Create a mock PDF file
      const testFilePath = path.join(__dirname, "../fixtures/test-resume.pdf");
      const testFileDir = path.dirname(testFilePath);

      // Ensure fixtures directory exists
      if (!fs.existsSync(testFileDir)) {
        fs.mkdirSync(testFileDir, { recursive: true });
      }

      // Create a simple test file
      if (!fs.existsSync(testFilePath)) {
        fs.writeFileSync(testFilePath, "Mock PDF content for testing");
      }

      const response = await request(app)
        .post("/api/resumes/upload")
        .set("Authorization", `Bearer ${candidateToken}`)
        .field("category", "INFORMATION-TECHNOLOGY")
        .field("resume_text", "Sample resume text content")
        .attach("resume", testFilePath)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.resume.user_id).toBe(candidate.id);
      expect(response.body.data.resume.category).toBe("INFORMATION-TECHNOLOGY");
      expect(response.body.data.resume.file_path).toBeDefined();

      // Cleanup
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    });

    it("should reject upload without file", async () => {
      const response = await request(app)
        .post("/api/resumes/upload")
        .set("Authorization", `Bearer ${candidateToken}`)
        .field("category", "INFORMATION-TECHNOLOGY")
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject upload by recruiter", async () => {
      const response = await request(app)
        .post("/api/resumes/upload")
        .set("Authorization", `Bearer ${recruiterToken}`)
        .field("category", "INFORMATION-TECHNOLOGY")
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it("should reject upload without authentication", async () => {
      const response = await request(app)
        .post("/api/resumes/upload")
        .field("category", "INFORMATION-TECHNOLOGY")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/resumes", () => {
    beforeEach(async () => {
      await createTestResume(candidate.id, {
        file_name: "resume1.pdf",
        category: "INFORMATION-TECHNOLOGY",
        is_primary: true,
      });
      await createTestResume(candidate.id, {
        file_name: "resume2.pdf",
        category: "ENGINEERING",
        is_primary: false,
      });
    });

    it("should get all user resumes", async () => {
      const response = await request(app)
        .get("/api/resumes")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.resumes).toHaveLength(2);
      expect(response.body.data.resumes[0].is_primary).toBe(true); // Primary first
      response.body.data.resumes.forEach((resume) => {
        expect(resume.user_id).toBe(candidate.id);
      });
    });

    it("should require authentication", async () => {
      const response = await request(app).get("/api/resumes").expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return empty array for user with no resumes", async () => {
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });
      const otherLogin = await request(app).post("/api/auth/login").send({
        email: "other@example.com",
        password: "Password123!",
      });

      const response = await request(app)
        .get("/api/resumes")
        .set("Authorization", `Bearer ${otherLogin.body.data.token}`)
        .expect(200);

      expect(response.body.data.resumes).toHaveLength(0);
    });
  });

  describe("GET /api/resumes/:id", () => {
    let resume;

    beforeEach(async () => {
      resume = await createTestResume(candidate.id);
    });

    it("should get resume details as owner", async () => {
      const response = await request(app)
        .get(`/api/resumes/${resume.id}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.resume.id).toBe(resume.id);
      expect(response.body.data.resume.user_id).toBe(candidate.id);
    });

    it("should reject access by other user", async () => {
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });
      const otherLogin = await request(app).post("/api/auth/login").send({
        email: "other@example.com",
        password: "Password123!",
      });

      const response = await request(app)
        .get(`/api/resumes/${resume.id}`)
        .set("Authorization", `Bearer ${otherLogin.body.data.token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 for non-existent resume", async () => {
      const response = await request(app)
        .get("/api/resumes/99999")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/resumes/:id", () => {
    let resume;

    beforeEach(async () => {
      resume = await createTestResume(candidate.id);
    });

    it("should delete resume as owner", async () => {
      const response = await request(app)
        .delete(`/api/resumes/${resume.id}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify resume is deleted
      const getResponse = await request(app)
        .get(`/api/resumes/${resume.id}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(404);
    });

    it("should reject delete by non-owner", async () => {
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });
      const otherLogin = await request(app).post("/api/auth/login").send({
        email: "other@example.com",
        password: "Password123!",
      });

      const response = await request(app)
        .delete(`/api/resumes/${resume.id}`)
        .set("Authorization", `Bearer ${otherLogin.body.data.token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/resumes/:id/primary", () => {
    let resume1, resume2;

    beforeEach(async () => {
      resume1 = await createTestResume(candidate.id, { is_primary: true });
      resume2 = await createTestResume(candidate.id, { is_primary: false });
    });

    it("should set resume as primary", async () => {
      const response = await request(app)
        .put(`/api/resumes/${resume2.id}/primary`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.resume.is_primary).toBe(true);

      // Verify only one primary resume
      const allResumes = await request(app)
        .get("/api/resumes")
        .set("Authorization", `Bearer ${candidateToken}`);

      const primaryResumes = allResumes.body.data.resumes.filter(
        (r) => r.is_primary
      );
      expect(primaryResumes).toHaveLength(1);
      expect(primaryResumes[0].id).toBe(resume2.id);
    });

    it("should reject setting primary by non-owner", async () => {
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });
      const otherLogin = await request(app).post("/api/auth/login").send({
        email: "other@example.com",
        password: "Password123!",
      });

      const response = await request(app)
        .put(`/api/resumes/${resume1.id}/primary`)
        .set("Authorization", `Bearer ${otherLogin.body.data.token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/resumes/primary", () => {
    it("should get primary resume", async () => {
      const primary = await createTestResume(candidate.id, {
        is_primary: true,
      });
      await createTestResume(candidate.id, { is_primary: false });

      const response = await request(app)
        .get("/api/resumes/primary")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.resume.id).toBe(primary.id);
      expect(response.body.data.resume.is_primary).toBe(true);
    });

    it("should return 404 if no primary resume", async () => {
      await createTestResume(candidate.id, { is_primary: false });

      const response = await request(app)
        .get("/api/resumes/primary")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .get("/api/resumes/primary")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
