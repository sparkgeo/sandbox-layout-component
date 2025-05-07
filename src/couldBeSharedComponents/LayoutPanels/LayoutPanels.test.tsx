import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LayoutPanels } from "./LayoutPanels";
import { useState } from "react";

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
describe("Layout Panels using a subpanel", () => {
  it("Throws an error if no external subpanel state is provided", () => {
    expect(() =>
      render(
        <LayoutPanels
          leftPanelContent={<>left panel content</>}
          rightPanelContent={<>right panel content</>}
          subpanelContent={<>subpanel content</>}
        >
          main content
        </LayoutPanels>,
      ),
    ).toThrow();
    expect(() =>
      render(
        <LayoutPanels
          leftPanelContent={<>left panel content</>}
          rightPanelContent={<>right panel content</>}
          subpanelContent={<>subpanel content</>}
          setIsSubpanelOpen={() => {}} // setter but missing state
        >
          main content
        </LayoutPanels>,
      ),
    ).toThrow();
    expect(() =>
      render(
        <LayoutPanels
          leftPanelContent={<>left panel content</>}
          rightPanelContent={<>right panel content</>}
          subpanelContent={<>subpanel content</>}
          isSubpanelOpen={true} // state but missing setter
        >
          main content
        </LayoutPanels>,
      ),
    ).toThrow();
    expect(() =>
      render(
        <LayoutPanels
          leftPanelContent={<>left panel content</>}
          rightPanelContent={<>right panel content</>}
          subpanelContent={<>subpanel content</>}
          isSubpanelOpen={true}
          setIsSubpanelOpen={() => {}}
        >
          main content
        </LayoutPanels>,
      ),
    ).not.toThrow();
  });
  it("Opens and closes the subpanel as expected", () => {
    const ControlledLayout = () => {
      const [isSubpanelOpen, setIsSubpanelOpen] = useState(true);

      const toggleSubpanel = () => {
        setIsSubpanelOpen((previous) => !previous);
      };

      return (
        <>
          <LayoutPanels
            leftPanelContent={<>left panel content</>}
            rightPanelContent={<>right panel content</>}
            subpanelContent={<>subpanel content</>}
            isSubpanelOpen={isSubpanelOpen}
            setIsSubpanelOpen={setIsSubpanelOpen}
          >
            main content
          </LayoutPanels>
          <button onClick={toggleSubpanel}>toggle subpanel</button>
        </>
      );
    };
    render(<ControlledLayout />);

    const subpanelToggleButton = screen.getByRole("button", {
      name: "toggle subpanel",
    });
    expect(screen.getByText("subpanel content")).toBeInTheDocument();
    fireEvent.click(subpanelToggleButton);
    expect(screen.queryByText("subpanel content")).not.toBeInTheDocument();
    fireEvent.click(subpanelToggleButton);
    expect(screen.getByText("subpanel content")).toBeInTheDocument();
  });
  it("Automatically closes the subpanel when the left panel is closed. When the left panel is opened, the subpanel is not opened automatically.", () => {
    const ControlledLayout = () => {
      const [isSubpanelOpen, setIsSubpanelOpen] = useState(true);

      const toggleSubpanel = () => {
        setIsSubpanelOpen((previous) => !previous);
      };

      return (
        <>
          <LayoutPanels
            leftPanelContent={<>left panel content</>}
            rightPanelContent={<>right panel content</>}
            subpanelContent={<>subpanel content</>}
            isSubpanelOpen={isSubpanelOpen}
            setIsSubpanelOpen={setIsSubpanelOpen}
          >
            main content
          </LayoutPanels>
          <button onClick={toggleSubpanel}>toggle subpanel</button>
        </>
      );
    };
    render(<ControlledLayout />);

    const leftPanelToggleButton = screen.getByRole("button", {
      name: "Toggle left panel",
    });
    expect(screen.getByText("subpanel content")).toBeInTheDocument();
    fireEvent.click(leftPanelToggleButton);
    expect(screen.queryByText("subpanel content")).not.toBeInTheDocument();
    fireEvent.click(leftPanelToggleButton);
    expect(screen.queryByText("subpanel content")).not.toBeInTheDocument();
  });
});
