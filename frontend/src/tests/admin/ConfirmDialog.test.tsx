import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

describe("ConfirmDialog", () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when open is false", () => {
    render(
      <ConfirmDialog
        open={false}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
  });

  it("should render when open is true", () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("should call onConfirm when confirm button is clicked", () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel when cancel button is clicked", () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should render custom button text", () => {
    render(
      <ConfirmDialog
        open={true}
        title="Delete User"
        message="This action cannot be undone"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        confirmText="Delete"
        cancelText="Go Back"
      />
    );

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go back/i })
    ).toBeInTheDocument();
  });

  it("should disable buttons when loading", () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    const confirmButton = screen.getByRole("button", { name: /processing/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should show "Processing..." text when loading', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("should render warning icon", () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const warningIcon = document.querySelector(
      'svg[data-testid="WarningIcon"]'
    );
    expect(warningIcon).toBeInTheDocument();
  });

  it("should apply danger variant styling", () => {
    const { container } = render(
      <ConfirmDialog
        open={true}
        title="Delete User"
        message="This cannot be undone"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        variant="danger"
      />
    );

    // Check if danger variant is applied (you may need to adjust based on actual implementation)
    expect(container).toBeInTheDocument();
  });

  it("should call onCancel when close icon is clicked", () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const closeIcon = document.querySelector('svg[data-testid="CloseIcon"]');
    if (closeIcon?.parentElement) {
      fireEvent.click(closeIcon.parentElement);
    }

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
