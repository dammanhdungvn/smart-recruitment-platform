const jobService = require("../../../src/services/job.service");
const {
  createTestUser,
  createTestJob,
  cleanupDatabase,
} = require("../../helpers/testHelpers");

describe("Job Service", () => {
  let recruiter;

  beforeEach(async () => {
    await cleanupDatabase();
    recruiter = await createTestUser({
      email: "recruiter@example.com",
      role: "recruiter",
    });
  });

  describe("createJob", () => {
    it("should create a new job successfully", async () => {
      const jobData = {
        job_title: "Senior Developer",
        job_type: "full-time",
        position_level: "senior",
        city: "Ho Chi Minh",
        experience: "3-5 years",
        skills: "Node.js, React",
        job_fields: "IT",
        description: "Great opportunity",
        salary_min: 30000000,
        salary_max: 50000000,
        unit: "VND",
        status: "open",
      };

      const job = await jobService.createJob(recruiter.id, jobData);

      expect(job.job_title).toBe(jobData.job_title);
      expect(job.user_id).toBe(recruiter.id);
      expect(job.status).toBe("open");
    });
  });

  describe("getAllJobs", () => {
    beforeEach(async () => {
      await createTestJob(recruiter.id, {
        job_title: "Job 1",
        city: "Ho Chi Minh",
      });
      await createTestJob(recruiter.id, { job_title: "Job 2", city: "Ha Noi" });
      await createTestJob(recruiter.id, {
        job_title: "Job 3",
        status: "closed",
      });
    });

    it("should return only open jobs", async () => {
      const jobs = await jobService.getAllJobs();

      expect(jobs.length).toBe(2);
      jobs.forEach((job) => {
        expect(job.status).toBe("open");
      });
    });

    it("should filter jobs by city", async () => {
      const jobs = await jobService.getAllJobs({ city: "Ho Chi Minh" });

      expect(jobs.length).toBeGreaterThan(0);
      jobs.forEach((job) => {
        expect(job.city).toContain("Ho Chi Minh");
      });
    });

    it("should filter jobs by job_type", async () => {
      await createTestJob(recruiter.id, { job_type: "part-time" });

      const jobs = await jobService.getAllJobs({ job_type: "part-time" });

      expect(jobs.some((job) => job.job_type === "part-time")).toBe(true);
    });

    it("should search jobs by keyword", async () => {
      await createTestJob(recruiter.id, {
        job_title: "Python Developer",
        skills: "Python, Django",
      });

      const jobs = await jobService.getAllJobs({ search: "Python" });

      expect(jobs.length).toBeGreaterThan(0);
    });

    it("should respect limit parameter", async () => {
      const jobs = await jobService.getAllJobs({ limit: 1 });

      expect(jobs.length).toBeLessThanOrEqual(1);
    });
  });

  describe("getJobById", () => {
    it("should return job by ID", async () => {
      const createdJob = await createTestJob(recruiter.id);

      const job = await jobService.getJobById(createdJob.id);

      expect(job.id).toBe(createdJob.id);
      expect(job.job_title).toBe(createdJob.job_title);
    });

    it("should throw error for non-existent job", async () => {
      await expect(jobService.getJobById(99999)).rejects.toThrow(
        "Job not found"
      );
    });
  });

  describe("getJobsByRecruiter", () => {
    it("should return all jobs by recruiter", async () => {
      await createTestJob(recruiter.id, { job_title: "Job 1" });
      await createTestJob(recruiter.id, { job_title: "Job 2" });

      const result = await jobService.getJobsByRecruiter(recruiter.id);

      expect(result.rows.length).toBe(2);
      expect(result.count).toBe(2);
      result.rows.forEach((job) => {
        expect(job.user_id).toBe(recruiter.id);
      });
    });

    it("should return empty array for recruiter with no jobs", async () => {
      const newRecruiter = await createTestUser({
        email: "newrecruiter@example.com",
        role: "recruiter",
      });

      const result = await jobService.getJobsByRecruiter(newRecruiter.id);

      expect(result.rows.length).toBe(0);
      expect(result.count).toBe(0);
    });
  });

  describe("updateJob", () => {
    it("should update job successfully", async () => {
      const job = await createTestJob(recruiter.id);

      const updated = await jobService.updateJob(job.id, recruiter.id, {
        job_title: "Updated Title",
        salary_min: 40000000,
      });

      expect(updated.job_title).toBe("Updated Title");
      expect(parseFloat(updated.salary_min)).toBe(40000000);
    });

    it("should throw error when non-owner tries to update", async () => {
      const job = await createTestJob(recruiter.id);
      const otherRecruiter = await createTestUser({
        email: "other@example.com",
        role: "recruiter",
      });

      await expect(
        jobService.updateJob(job.id, otherRecruiter.id, { job_title: "Hacked" })
      ).rejects.toThrow("Unauthorized to update this job");
    });
  });

  describe("deleteJob", () => {
    it("should delete job successfully", async () => {
      const job = await createTestJob(recruiter.id);

      await jobService.deleteJob(job.id, recruiter.id);

      await expect(jobService.getJobById(job.id)).rejects.toThrow(
        "Job not found"
      );
    });

    it("should throw error when non-owner tries to delete", async () => {
      const job = await createTestJob(recruiter.id);
      const otherRecruiter = await createTestUser({
        email: "other@example.com",
        role: "recruiter",
      });

      await expect(
        jobService.deleteJob(job.id, otherRecruiter.id)
      ).rejects.toThrow("Unauthorized to delete this job");
    });
  });

  describe("updateJobStatus", () => {
    it("should update job status successfully", async () => {
      const job = await createTestJob(recruiter.id);

      const updated = await jobService.updateJobStatus(
        job.id,
        recruiter.id,
        "closed"
      );

      expect(updated.status).toBe("closed");
    });

    it("should throw error when non-owner tries to update status", async () => {
      const job = await createTestJob(recruiter.id);
      const otherRecruiter = await createTestUser({
        email: "other@example.com",
        role: "recruiter",
      });

      await expect(
        jobService.updateJobStatus(job.id, otherRecruiter.id, "closed")
      ).rejects.toThrow("Unauthorized to update this job");
    });
  });
});
