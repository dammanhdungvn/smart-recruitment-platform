const resumeService = require("../../../src/services/resume.service");
const {
  createTestUser,
  createTestResume,
  cleanupDatabase,
} = require("../../helpers/testHelpers");
const path = require("path");
const fs = require("fs");

describe("Resume Service", () => {
  let candidate;

  beforeEach(async () => {
    await cleanupDatabase();
    candidate = await createTestUser({
      email: "candidate@example.com",
      role: "candidate",
    });
  });

  describe("uploadResume", () => {
    it("should upload resume successfully", async () => {
      const fileData = {
        originalname: "test-resume.pdf",
        path: "/uploads/resumes/test-resume.pdf",
        size: 2048,
      };

      const metadata = {
        category: "INFORMATION-TECHNOLOGY",
        resume_text: "Test resume content",
        is_primary: false,
      };

      const resume = await resumeService.uploadResume(
        candidate.id,
        fileData,
        metadata
      );

      expect(resume.user_id).toBe(candidate.id);
      expect(resume.file_name).toBe(fileData.originalname);
      expect(resume.file_path).toBe(fileData.path);
      expect(resume.category).toBe(metadata.category);
    });

    it("should set as primary and unset others when is_primary is true", async () => {
      // Create existing primary resume
      await createTestResume(candidate.id, { is_primary: true });

      const fileData = {
        originalname: "new-primary.pdf",
        path: "/uploads/resumes/new-primary.pdf",
        size: 2048,
      };

      const metadata = {
        is_primary: true,
      };

      const newResume = await resumeService.uploadResume(
        candidate.id,
        fileData,
        metadata
      );

      expect(newResume.is_primary).toBe(true);

      // Check all user's resumes
      const allResumes = await resumeService.getUserResumes(candidate.id);
      const primaryCount = allResumes.filter((r) => r.is_primary).length;

      expect(primaryCount).toBe(1);
    });
  });

  describe("getUserResumes", () => {
    it("should return all resumes for user", async () => {
      await createTestResume(candidate.id, { file_name: "resume1.pdf" });
      await createTestResume(candidate.id, { file_name: "resume2.pdf" });

      const resumes = await resumeService.getUserResumes(candidate.id);

      expect(resumes.length).toBe(2);
      resumes.forEach((resume) => {
        expect(resume.user_id).toBe(candidate.id);
      });
    });

    it("should return primary resume first", async () => {
      await createTestResume(candidate.id, {
        file_name: "resume1.pdf",
        is_primary: false,
      });
      await createTestResume(candidate.id, {
        file_name: "resume2.pdf",
        is_primary: true,
      });

      const resumes = await resumeService.getUserResumes(candidate.id);

      expect(resumes[0].is_primary).toBe(true);
    });

    it("should return empty array for user with no resumes", async () => {
      const resumes = await resumeService.getUserResumes(candidate.id);

      expect(resumes.length).toBe(0);
    });
  });

  describe("getResumeById", () => {
    it("should return resume by ID for owner", async () => {
      const created = await createTestResume(candidate.id);

      const resume = await resumeService.getResumeById(
        created.id,
        candidate.id
      );

      expect(resume.id).toBe(created.id);
      expect(resume.user_id).toBe(candidate.id);
    });

    it("should throw error when resume does not belong to user", async () => {
      const created = await createTestResume(candidate.id);
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });

      await expect(
        resumeService.getResumeById(created.id, otherCandidate.id)
      ).rejects.toThrow("Resume not found");
    });
  });

  describe("deleteResume", () => {
    it("should delete resume successfully", async () => {
      const resume = await createTestResume(candidate.id);

      await resumeService.deleteResume(resume.id, candidate.id);

      await expect(
        resumeService.getResumeById(resume.id, candidate.id)
      ).rejects.toThrow("Resume not found");
    });

    it("should throw error when non-owner tries to delete", async () => {
      const resume = await createTestResume(candidate.id);
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });

      await expect(
        resumeService.deleteResume(resume.id, otherCandidate.id)
      ).rejects.toThrow("Resume not found");
    });
  });

  describe("setPrimaryResume", () => {
    it("should set resume as primary successfully", async () => {
      const resume1 = await createTestResume(candidate.id, {
        is_primary: true,
      });
      const resume2 = await createTestResume(candidate.id, {
        is_primary: false,
      });

      await resumeService.setPrimaryResume(resume2.id, candidate.id);

      const allResumes = await resumeService.getUserResumes(candidate.id);
      const primaryResumes = allResumes.filter((r) => r.is_primary);

      expect(primaryResumes.length).toBe(1);
      expect(primaryResumes[0].id).toBe(resume2.id);
    });

    it("should throw error when non-owner tries to set primary", async () => {
      const resume = await createTestResume(candidate.id);
      const otherCandidate = await createTestUser({
        email: "other@example.com",
        role: "candidate",
      });

      await expect(
        resumeService.setPrimaryResume(resume.id, otherCandidate.id)
      ).rejects.toThrow("Resume not found");
    });
  });

  describe("getPrimaryResume", () => {
    it("should return primary resume", async () => {
      await createTestResume(candidate.id, { is_primary: false });
      const primary = await createTestResume(candidate.id, {
        is_primary: true,
      });

      const result = await resumeService.getPrimaryResume(candidate.id);

      expect(result.id).toBe(primary.id);
      expect(result.is_primary).toBe(true);
    });

    it("should return null if no primary resume", async () => {
      await createTestResume(candidate.id, { is_primary: false });

      const result = await resumeService.getPrimaryResume(candidate.id);

      expect(result).toBeNull();
    });
  });
});
