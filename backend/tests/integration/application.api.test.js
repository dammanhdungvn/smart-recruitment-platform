const request = require("supertest");
const app = require("../../src/app");
const {
  cleanupDatabase,
  createTestUser,
  createTestJob,
  createTestResume,
  createTestApplication,
} = require("../helpers/testHelpers");

describe("Application API Integration Tests", () => {
  let candidate, candidateToken;
  let recruiter, recruiterToken;
  let job, resume;

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
      company: "Tech Corp",
    });
    const recruiterLogin = await request(app).post("/api/auth/login").send({
      email: "recruiter@example.com",
      password: "Password123!",
    });
    recruiterToken = recruiterLogin.body.data.token;

    // Create test job and resume
    job = await createTestJob(recruiter.id, {
      title: "Software Engineer",
      status: "open",
    });
    resume = await createTestResume(candidate.id, {
      is_primary: true,
    });
  });

  describe("POST /api/applications", () => {
    it("should create application successfully", async () => {
      const applicationData = {
        job_id: job.id,
        resume_id: resume.id,
        cover_letter: "I am very interested in this position",
      };

      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send(applicationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.job_id).toBe(job.id);
      expect(response.body.data.application.user_id).toBe(candidate.id);
      expect(response.body.data.application.resume_id).toBe(resume.id);
      expect(response.body.data.application.status).toBe("submitted");
    });

    it("should reject duplicate application", async () => {
      // Create first application
      await createTestApplication(candidate.id, job.id, resume.id);

      // Try to create duplicate
      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          job_id: job.id,
          resume_id: resume.id,
          cover_letter: "Second application",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already applied");
    });

    it("should reject application without authentication", async () => {
      const response = await request(app)
        .post("/api/applications")
        .send({
          job_id: job.id,
          resume_id: resume.id,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject application with invalid resume", async () => {
      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          job_id: job.id,
          resume_id: 99999, // Non-existent resume
          cover_letter: "Test",
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should reject application to closed job", async () => {
      await job.update({ status: "closed" });

      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          job_id: job.id,
          resume_id: resume.id,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not accepting");
    });

    it("should reject recruiter applying to jobs", async () => {
      const recruiterResume = await createTestResume(recruiter.id);

      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${recruiterToken}`)
        .send({
          job_id: job.id,
          resume_id: recruiterResume.id,
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/applications/my", () => {
    beforeEach(async () => {
      await createTestApplication(candidate.id, job.id, resume.id, {
        status: "submitted",
      });

      const otherJob = await createTestJob(recruiter.id, {
        title: "Another Job",
      });
      await createTestApplication(candidate.id, otherJob.id, resume.id, {
        status: "reviewing",
      });
    });

    it("should get all user applications", async () => {
      const response = await request(app)
        .get("/api/applications")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toHaveLength(2);
      response.body.data.applications.forEach((app) => {
        expect(app.user_id).toBe(candidate.id);
        expect(app.job).toBeDefined();
        expect(app.resume).toBeDefined();
      });
    });

    it("should filter applications by status", async () => {
      const response = await request(app)
        .get("/api/applications")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      const submitted = response.body.data.applications.filter(
        (a) => a.status === "submitted"
      );
      expect(submitted).toHaveLength(1);
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .get("/api/applications/my")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/applications/:id", () => {
    let application;

    beforeEach(async () => {
      application = await createTestApplication(
        candidate.id,
        job.id,
        resume.id
      );
    });

    it("should get application details as applicant", async () => {
      const response = await request(app)
        .get(`/api/applications/${application.id}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.id).toBe(application.id);
      expect(response.body.data.application.job).toBeDefined();
      expect(response.body.data.application.resume).toBeDefined();
    });

    it("should get application details as job owner", async () => {
      const response = await request(app)
        .get(`/api/applications/${application.id}`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.id).toBe(application.id);
    });

    it("should reject access by other users", async () => {
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });
      const otherLogin = await request(app).post("/api/auth/login").send({
        email: "other@example.com",
        password: "Password123!",
      });

      const response = await request(app)
        .get(`/api/applications/${application.id}`)
        .set("Authorization", `Bearer ${otherLogin.body.data.token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/applications/job/:jobId", () => {
    beforeEach(async () => {
      await createTestApplication(candidate.id, job.id, resume.id);

      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });
      const otherResume = await createTestResume(otherCandidate.id);
      await createTestApplication(otherCandidate.id, job.id, otherResume.id);
    });

    it("should get all applications for job as recruiter", async () => {
      const response = await request(app)
        .get(`/api/applications/job/${job.id}`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toHaveLength(2);
      response.body.data.applications.forEach((app) => {
        expect(app.job_id).toBe(job.id);
        expect(app.candidate).toBeDefined();
        expect(app.resume).toBeDefined();
      });
    });

    it("should reject access by non-owner recruiter", async () => {
      const otherRecruiter = await createTestUser({
        email: "other_recruiter@example.com",
        role: "recruiter",
      });
      const otherLogin = await request(app).post("/api/auth/login").send({
        email: "other_recruiter@example.com",
        password: "Password123!",
      });

      const response = await request(app)
        .get(`/api/applications/job/${job.id}`)
        .set("Authorization", `Bearer ${otherLogin.body.data.token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it("should reject access by candidates", async () => {
      const response = await request(app)
        .get(`/api/applications/job/${job.id}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/applications/:id/status", () => {
    let application;

    beforeEach(async () => {
      application = await createTestApplication(
        candidate.id,
        job.id,
        resume.id
      );
    });

    it("should update application status as recruiter", async () => {
      const response = await request(app)
        .patch(`/api/applications/${application.id}/status`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .send({ status: "reviewing" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.status).toBe("reviewing");
    });

    it("should reject invalid status", async () => {
      const response = await request(app)
        .patch(`/api/applications/${application.id}/status`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .send({ status: "invalid_status" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject status update by candidate", async () => {
      const response = await request(app)
        .patch(`/api/applications/${application.id}/status`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({ status: "accepted" })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/applications/:id", () => {
    let application;

    beforeEach(async () => {
      application = await createTestApplication(
        candidate.id,
        job.id,
        resume.id
      );
    });

    it("should withdraw application as candidate", async () => {
      const response = await request(app)
        .patch(`/api/applications/${application.id}/withdraw`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify application is withdrawn
      const getResponse = await request(app)
        .get(`/api/applications/${application.id}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(getResponse.body.data.application.status).toBe("withdrawn");
    });

    it("should reject withdrawal of accepted application", async () => {
      await application.update({ status: "offered" });

      const response = await request(app)
        .patch(`/api/applications/${application.id}/withdraw`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "Cannot withdraw this application"
      );
    });

    it("should reject withdrawal by non-owner", async () => {
      const response = await request(app)
        .patch(`/api/applications/${application.id}/withdraw`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
