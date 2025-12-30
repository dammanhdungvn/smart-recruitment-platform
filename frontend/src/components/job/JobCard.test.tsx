import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import JobCard from "./JobCard";
import type { Job } from "../../types/job.types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("JobCard", () => {
  const mockJob: Job = {
    id: 1,
    job_title: "Senior Frontend Developer",
    city: "Ho Chi Minh",
    job_type: "full-time",
    position_level: "senior",
    job_fields: "IT",
    experience: "3-5 years",
    skills: "React, TypeScript, Node.js",
    description: "Great opportunity",
    salary_min: 30000000,
    salary_max: 50000000,
    unit: "VND",
    status: "open",
    user_id: 1,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  const renderJobCard = (
    props?: Partial<React.ComponentProps<typeof JobCard>>
  ) => {
    return render(
      <BrowserRouter>
        <JobCard job={mockJob} {...props} />
      </BrowserRouter>
    );
  };

  it("should render job title", () => {
    renderJobCard();
    expect(screen.getByText("Senior Frontend Developer")).toBeInTheDocument();
  });

  it("should render job location", () => {
    renderJobCard();
    expect(screen.getByText("Ho Chi Minh")).toBeInTheDocument();
  });

  it("should render job type", () => {
    renderJobCard();
    expect(screen.getByText("full-time")).toBeInTheDocument();
  });

  it("should render position level chip", () => {
    renderJobCard();
    expect(screen.getByText("senior")).toBeInTheDocument();
  });

  it("should render job fields chip", () => {
    renderJobCard();
    expect(screen.getByText("IT")).toBeInTheDocument();
  });

  it("should render formatted salary", () => {
    renderJobCard();
    // formatSalary should return "30 - 50 triệu VND" or similar
    const salaryText = screen.getByText(/triệu VND/i);
    expect(salaryText).toBeInTheDocument();
  });

  it("should navigate to job detail page on card click", async () => {
    const user = userEvent.setup();
    renderJobCard();

    const card = screen
      .getByText("Senior Frontend Developer")
      .closest(".MuiCard-root");
    expect(card).toBeInTheDocument();

    if (card) {
      await user.click(card);
      expect(mockNavigate).toHaveBeenCalledWith("/candidate/jobs/1");
    }
  });

  it("should not show apply button by default", () => {
    renderJobCard();
    expect(
      screen.queryByRole("button", { name: /ứng tuyển/i })
    ).not.toBeInTheDocument();
  });

  it("should show apply button when showApplyButton is true", () => {
    renderJobCard({ showApplyButton: true, onApply: vi.fn() });
    expect(
      screen.getByRole("button", { name: /ứng tuyển/i })
    ).toBeInTheDocument();
  });

  it("should call onApply callback when apply button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnApply = vi.fn();

    renderJobCard({ showApplyButton: true, onApply: mockOnApply });

    const applyButton = screen.getByRole("button", { name: /ứng tuyển/i });
    await user.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith(1);
    expect(mockNavigate).not.toHaveBeenCalled(); // Should not navigate when clicking apply button
  });

  it("should render job without salary_min and salary_max", () => {
    const jobWithoutSalary: Job = {
      ...mockJob,
      salary_min: undefined,
      salary_max: undefined,
    };

    render(
      <BrowserRouter>
        <JobCard job={jobWithoutSalary} />
      </BrowserRouter>
    );

    // Should show "Thỏa thuận" or similar
    expect(screen.getByText(/thỏa thuận/i)).toBeInTheDocument();
  });

  it("should have hover effect styles", () => {
    renderJobCard();
    const card = screen
      .getByText("Senior Frontend Developer")
      .closest(".MuiCard-root");

    expect(card).toHaveStyle({ cursor: "pointer" });
  });

  it("should display all job information correctly", () => {
    renderJobCard();

    // Check all main info is present
    expect(screen.getByText("Senior Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Ho Chi Minh")).toBeInTheDocument();
    expect(screen.getByText("full-time")).toBeInTheDocument();
    expect(screen.getByText("senior")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();
  });
});
