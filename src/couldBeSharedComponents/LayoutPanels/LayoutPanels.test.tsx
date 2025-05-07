import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LayoutPanels } from "./LayoutPanels";

describe("Layout Panels default", async () => {
  it("shows the expected content defaulting to panels visible. Panels close and open when panel toggle button clicked.", async () => {
    render(
      <LayoutPanels
        leftPanelContent={<>left panel content</>}
        rightPanelContent={<>right panel content</>}
      >
        main content
      </LayoutPanels>,
    );

    expect(screen.getByText("left panel content")).toBeInTheDocument();
    expect(screen.getByText("right panel content")).toBeInTheDocument();
    expect(screen.getByText("main content")).toBeInTheDocument();

    const leftPanelToggleButton = screen.getByRole("button", {
      name: "Toggle left panel",
    });
    const rightPanelToggleButton = screen.getByRole("button", {
      name: "Toggle right panel",
    });

    fireEvent.click(leftPanelToggleButton);
    fireEvent.click(rightPanelToggleButton);
    fireEvent.transitionEnd(screen.getByTestId("leftPanel")); // RTL doesnt support css transitions so we need to fire this in the test manually
    fireEvent.transitionEnd(screen.getByTestId("rightPanel")); // RTL doesnt support css transitions so we need to fire this in the test manually

    await waitFor(() => {
      expect(screen.queryByText("left panel content")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("right panel content")).not.toBeInTheDocument();
    });

    fireEvent.click(leftPanelToggleButton);
    fireEvent.click(rightPanelToggleButton);
    // (opening the panels again doesnt rely on a CSS transition to end for content to be visible)

    expect(screen.getByText("left panel content")).toBeInTheDocument();
    expect(screen.getByText("right panel content")).toBeInTheDocument();
    expect(screen.getByText("main content")).toBeInTheDocument();
  });
});
