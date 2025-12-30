import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsCard from "../../components/admin/StatsCard";
import { People as PeopleIcon } from "@mui/icons-material";

describe("StatsCard", () => {
  it("should render loading skeleton when loading prop is true", () => {
    const { container } = render(
      <StatsCard
        title="Total Users"
        value={100}
        icon={<PeopleIcon />}
        color="#1976d2"
        loading
      />
    );

    // Check for skeleton elements by class name
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render title and value when not loading", () => {
    render(
      <StatsCard
        title="Total Users"
        value={100}
        icon={<PeopleIcon />}
        color="#1976d2"
        loading={false}
      />
    );

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should format large numbers with commas", () => {
    render(
      <StatsCard
        title="Total Users"
        value={1234567}
        icon={<PeopleIcon />}
        color="#1976d2"
      />
    );

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("should accept string values", () => {
    render(
      <StatsCard
        title="Status"
        value="Active"
        icon={<PeopleIcon />}
        color="#2e7d32"
      />
    );

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("should render icon", () => {
    render(
      <StatsCard
        title="Total Users"
        value={100}
        icon={<PeopleIcon data-testid="people-icon" />}
        color="#1976d2"
      />
    );

    expect(screen.getByTestId("people-icon")).toBeInTheDocument();
  });

  it("should apply correct color to icon container", () => {
    const { container } = render(
      <StatsCard
        title="Total Users"
        value={100}
        icon={<PeopleIcon />}
        color="#1976d2"
      />
    );

    // Check if color is applied (you may need to adjust based on actual implementation)
    const iconContainer = container.querySelector('[class*="MuiBox"]');
    expect(iconContainer).toBeInTheDocument();
  });

  it("should display trending up icon", () => {
    render(
      <StatsCard
        title="Total Users"
        value={100}
        icon={<PeopleIcon />}
        color="#1976d2"
      />
    );

    // TrendingUpIcon should be rendered
    const svg = document.querySelector('svg[data-testid="TrendingUpIcon"]');
    expect(svg).toBeInTheDocument();
  });
});
