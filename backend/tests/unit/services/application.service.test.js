const applicationService = require("../../../src/services/application.service");
const {
  createTestUser,
  createTestJob,
  createTestResume,
  createTestApplication,
  cleanupDatabase,
} = require("../../helpers/testHelpers");

describe("Application Service", () => {
  let candidate, recruiter, job, resume;

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

    job = await createTestJob(recruiter.id);
    resume = await createTestResume(candidate.id);
  });

  describe("createApplication", () => {
    it("should create application successfully", async () => {
      const applicationData = {
        job_id: job.id,
        resume_id: resume.id,
        cover_letter: "I am interested in this position",
      };

      const application = await applicationService.createApplication(
        candidate.id,
        applicationData
      );

      expect(application.job_id).toBe(job.id);
      expect(application.user_id).toBe(candidate.id);
      expect(application.resume_id).toBe(resume.id);
      expect(application.status).toBe("submitted");
    });

    it("should throw error for non-existent job", async () => {
      const applicationData = {
        job_id: 99999,
        resume_id: resume.id,
        cover_letter: "Test",
      };

      await expect(
        applicationService.createApplication(candidate.id, applicationData)
      ).rejects.toThrow("Job not found");
    });

    it("should throw error when job is closed", async () => {
      job.status = "closed";
      await job.save();

      const applicationData = {
        job_id: job.id,
        resume_id: resume.id,
        cover_letter: "Test",
      };

      await expect(
        applicationService.createApplication(candidate.id, applicationData)
      ).rejects.toThrow("Job is not accepting applications");
    });

    it("should throw error when resume does not belong to user", async () => {
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });

      const applicationData = {
        job_id: job.id,
        resume_id: resume.id,
        cover_letter: "Test",
      };

      await expect(
        applicationService.createApplication(otherCandidate.id, applicationData)
      ).rejects.toThrow("Resume not found");
    });

    it("should throw error for duplicate application", async () => {
      const applicationData = {
        job_id: job.id,
        resume_id: resume.id,
        cover_letter: "First application",
      };

      await applicationService.createApplication(candidate.id, applicationData);

      await expect(
        applicationService.createApplication(candidate.id, applicationData)
      ).rejects.toThrow("You have already applied for this job");
    });
  });

  describe("getUserApplications", () => {
    it("should return all applications for user", async () => {
      await createTestApplication(job.id, candidate.id, resume.id);

      const job2 = await createTestJob(recruiter.id, { job_title: "Job 2" });
      await createTestApplication(job2.id, candidate.id, resume.id);

      const applications = await applicationService.getUserApplications(
        candidate.id
      );

      expect(applications.length).toBe(2);
      applications.forEach((app) => {
        expect(app.user_id).toBe(candidate.id);
      });
    });

    it("should return empty array for user with no applications", async () => {
      const applications = await applicationService.getUserApplications(
        candidate.id
      );

      expect(applications.length).toBe(0);
    });
  });

  describe("getApplicationById", () => {
    it("should return application by ID", async () => {
      const created = await createTestApplication(
        job.id,
        candidate.id,
        resume.id
      );

      const application = await applicationService.getApplicationById(
        created.id,
        candidate.id
      );

      expect(application.id).toBe(created.id);
      expect(application.job_id).toBe(job.id);
    });

    it("should throw error for unauthorized access", async () => {
      const created = await createTestApplication(
        job.id,
        candidate.id,
        resume.id
      );
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });

      await expect(
        applicationService.getApplicationById(created.id, otherCandidate.id)
      ).rejects.toThrow("Unauthorized to view this application");
    });
  });

  describe("getJobApplications", () => {
    it("should return all applications for a job", async () => {
      await createTestApplication(job.id, candidate.id, resume.id);

      const candidate2 = await createTestUser({
        email: "candidate2@example.com",
        role: "candidate",
      });
      const resume2 = await createTestResume(candidate2.id);
      await createTestApplication(job.id, candidate2.id, resume2.id);

      const applications = await applicationService.getJobApplications(
        job.id,
        recruiter.id
      );

      expect(applications.length).toBe(2);
      applications.forEach((app) => {
        expect(app.job_id).toBe(job.id);
      });
    });

    it("should throw error when non-owner tries to access", async () => {
      const otherRecruiter = await createTestUser({
        email: "other@example.com",
        role: "recruiter",
      });

      await expect(
        applicationService.getJobApplications(job.id, otherRecruiter.id)
      ).rejects.toThrow("Unauthorized to view applications for this job");
    });
  });

  describe("updateApplicationStatus", () => {
    it("should update application status successfully", async () => {
      const application = await createTestApplication(
        job.id,
        candidate.id,
        resume.id
      );

      const updated = await applicationService.updateApplicationStatus(
        application.id,
        recruiter.id,
        "shortlisted",
        "Good candidate"
      );

      expect(updated.status).toBe("shortlisted");
      expect(updated.notes).toBe("Good candidate");
      expect(updated.reviewed_at).toBeTruthy();
    });

    it("should throw error when non-owner tries to update", async () => {
      const application = await createTestApplication(
        job.id,
        candidate.id,
        resume.id
      );
      const otherRecruiter = await createTestUser({
        email: "other@example.com",
        role: "recruiter",
      });

      await expect(
        applicationService.updateApplicationStatus(
          application.id,
          otherRecruiter.id,
          "rejected"
        )
      ).rejects.toThrow("Unauthorized to update this application");
    });
  });

  describe("withdrawApplication", () => {
    it("should withdraw application successfully", async () => {
      const application = await createTestApplication(
        job.id,
        candidate.id,
        resume.id
      );

      const withdrawn = await applicationService.withdrawApplication(
        application.id,
        candidate.id
      );

      expect(withdrawn.status).toBe("withdrawn");
    });

    it("should throw error when non-owner tries to withdraw", async () => {
      const application = await createTestApplication(
        job.id,
        candidate.id,
        resume.id
      );
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });

      await expect(
        applicationService.withdrawApplication(
          application.id,
          otherCandidate.id
        )
      ).rejects.toThrow("Unauthorized to withdraw this application");
    });

    it("should throw error when withdrawing already rejected application", async () => {
      const application = await createTestApplication(
        job.id,
        candidate.id,
        resume.id
      );
      application.status = "rejected";
      await application.save();

      await expect(
        applicationService.withdrawApplication(application.id, candidate.id)
      ).rejects.toThrow("Cannot withdraw this application");
    });
  });
});
