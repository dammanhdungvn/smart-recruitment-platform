const request = require("supertest");
const app = require("../../src/app");
const {
  cleanupDatabase,
  createTestUser,
  createTestJob,
} = require("../helpers/testHelpers");

describe("Job API Integration Tests", () => {
  let recruiter, recruiterToken;
  let candidate, candidateToken;

  beforeEach(async () => {
    await cleanupDatabase();

    // Create recruiter
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

    // Create candidate
    candidate = await createTestUser({
      email: "candidate@example.com",
      role: "candidate",
    });
    const candidateLogin = await request(app).post("/api/auth/login").send({
      email: "candidate@example.com",
      password: "Password123!",
    });
    candidateToken = candidateLogin.body.data.token;
  });

  describe("POST /api/jobs", () => {
    it("should create job as recruiter", async () => {
      const jobData = {
        title: "Senior Developer",
        description: "We are looking for a senior developer",
        requirements: "React, Node.js, 5 years experience",
        location: "Ho Chi Minh City",
        salary_range: "$2000-$3000",
        job_type: "full-time",
        category: "INFORMATION-TECHNOLOGY",
      };

      const response = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${recruiterToken}`)
        .send(jobData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.title).toBe(jobData.title);
      expect(response.body.data.job.recruiter_id).toBe(recruiter.id);
      expect(response.body.data.job.company).toBe(recruiter.company);
    });

    it("should reject job creation by candidate", async () => {
      const jobData = {
        title: "Test Job",
        description: "Test description",
      };

      const response = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send(jobData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it("should reject job creation without authentication", async () => {
      const jobData = {
        title: "Test Job",
        description: "Test description",
      };

      const response = await request(app)
        .post("/api/jobs")
        .send(jobData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid job data", async () => {
      const jobData = {
        title: "", // Empty title
        description: "Test",
      };

      const response = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${recruiterToken}`)
        .send(jobData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/jobs", () => {
    beforeEach(async () => {
      // Create test jobs
      await createTestJob(recruiter.id, {
        title: "React Developer",
        category: "INFORMATION-TECHNOLOGY",
        location: "Hanoi",
        status: "open",
      });
      await createTestJob(recruiter.id, {
        title: "Marketing Manager",
        category: "BUSINESS-DEVELOPMENT",
        location: "Ho Chi Minh City",
        status: "open",
      });
      await createTestJob(recruiter.id, {
        title: "Closed Job",
        status: "closed",
      });
    });

    it("should get all open jobs without authentication", async () => {
      const response = await request(app).get("/api/jobs").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs).toHaveLength(2); // Only open jobs
      expect(response.body.data.pagination).toBeDefined();
    });

    it("should filter jobs by category", async () => {
      const response = await request(app)
        .get("/api/jobs?category=INFORMATION-TECHNOLOGY")
        .expect(200);

      expect(response.body.data.jobs).toHaveLength(1);
      expect(response.body.data.jobs[0].category).toBe(
        "INFORMATION-TECHNOLOGY"
      );
    });

    it("should filter jobs by location", async () => {
      const response = await request(app)
        .get("/api/jobs?location=Hanoi")
        .expect(200);

      expect(response.body.data.jobs).toHaveLength(1);
      expect(response.body.data.jobs[0].location).toBe("Hanoi");
    });

    it("should search jobs by keyword", async () => {
      const response = await request(app)
        .get("/api/jobs?search=React")
        .expect(200);

      expect(response.body.data.jobs).toHaveLength(1);
      expect(response.body.data.jobs[0].title).toContain("React");
    });

    it("should paginate results", async () => {
      const response = await request(app)
        .get("/api/jobs?page=1&limit=1")
        .expect(200);

      expect(response.body.data.jobs).toHaveLength(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
      expect(response.body.data.pagination.total).toBe(2);
    });
  });

  describe("GET /api/jobs/:id", () => {
    let job;

    beforeEach(async () => {
      job = await createTestJob(recruiter.id, {
        title: "Test Job",
        description: "Full description",
      });
    });

    it("should get job details by ID", async () => {
      const response = await request(app)
        .get(`/api/jobs/${job.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.id).toBe(job.id);
      expect(response.body.data.job.title).toBe(job.title);
      expect(response.body.data.job.recruiter).toBeDefined();
    });

    it("should return 404 for non-existent job", async () => {
      const response = await request(app).get("/api/jobs/99999").expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/jobs/:id", () => {
    let job;

    beforeEach(async () => {
      job = await createTestJob(recruiter.id, {
        title: "Original Title",
      });
    });

    it("should update own job as recruiter", async () => {
      const updates = {
        title: "Updated Title",
        description: "Updated description",
      };

      const response = await request(app)
        .put(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.title).toBe(updates.title);
      expect(response.body.data.job.description).toBe(updates.description);
    });

    it("should reject update by non-owner recruiter", async () => {
      const otherRecruiter = await createTestUser({
        email: "other@example.com",
        role: "recruiter",
      });
      const otherLogin = await request(app).post("/api/auth/login").send({
        email: "other@example.com",
        password: "Password123!",
      });
      const otherToken = otherLogin.body.data.token;

      const response = await request(app)
        .put(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ title: "Hacked Title" })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it("should reject update by candidate", async () => {
      const response = await request(app)
        .put(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({ title: "New Title" })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/jobs/:id", () => {
    let job;

    beforeEach(async () => {
      job = await createTestJob(recruiter.id);
    });

    it("should delete own job as recruiter", async () => {
      const response = await request(app)
        .delete(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify job is deleted
      const getResponse = await request(app)
        .get(`/api/jobs/${job.id}`)
        .expect(404);
    });

    it("should reject delete by non-owner", async () => {
      const response = await request(app)
        .delete(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/jobs/my/jobs", () => {
    beforeEach(async () => {
      await createTestJob(recruiter.id, { title: "Job 1" });
      await createTestJob(recruiter.id, { title: "Job 2" });

      const otherRecruiter = await createTestUser({
        email: "other@example.com",
        role: "recruiter",
      });
      await createTestJob(otherRecruiter.id, { title: "Other Job" });
    });

    it("should get only own jobs", async () => {
      const response = await request(app)
        .get("/api/jobs/my/jobs")
        .set("Authorization", `Bearer ${recruiterToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs).toHaveLength(2);
      response.body.data.jobs.forEach((job) => {
        expect(job.recruiter_id).toBe(recruiter.id);
      });
    });

    it("should require authentication", async () => {
      const response = await request(app).get("/api/jobs/my/jobs").expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
