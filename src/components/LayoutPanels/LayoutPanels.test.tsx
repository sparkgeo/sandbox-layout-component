import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
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
      </LayoutPanels>
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
    expect(screen.getByText("main content")).toBeInTheDocument();

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
        </LayoutPanels>
      )
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
        </LayoutPanels>
      )
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
        </LayoutPanels>
      )
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
        </LayoutPanels>
      )
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
          <button onClick={toggleSubpanel}>external toggle sub panel</button>
        </>
      );
    };
    render(<ControlledLayout />);

    const externalSubpanelToggleButton = screen.getByRole("button", {
      name: "external toggle sub panel",
    });
    const internalSubpanelCloseButton = screen.getByRole("button", {
      name: "Close sub panel",
    });
    expect(screen.getByText("subpanel content")).toBeInTheDocument();
    fireEvent.click(internalSubpanelCloseButton);
    expect(screen.queryByText("subpanel content")).not.toBeInTheDocument();

    fireEvent.click(externalSubpanelToggleButton);
    expect(screen.getByText("subpanel content")).toBeInTheDocument();
    fireEvent.click(externalSubpanelToggleButton);
    expect(screen.queryByText("subpanel content")).not.toBeInTheDocument();
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
describe("controlling panel hide/show state externally", () => {
  it("hides and shows panels as expected using external state", async () => {
    const ControlledLayout = () => {
      const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
      const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

      return (
        <>
          <LayoutPanels
            leftPanelContent={<>left panel content</>}
            rightPanelContent={<>right panel content</>}
            isLeftPanelOpen={isLeftPanelOpen}
            setIsLeftPanelOpen={setIsLeftPanelOpen}
            isRightPanelOpen={isRightPanelOpen}
            setIsRightPanelOpen={setIsRightPanelOpen}
          >
            main content
          </LayoutPanels>
          <button onClick={() => setIsRightPanelOpen((previous) => !previous)}>
            external toggle right panel
          </button>
          <button onClick={() => setIsLeftPanelOpen((previous) => !previous)}>
            external toggle left panel
          </button>
        </>
      );
    };
    render(<ControlledLayout />);

    // Internally state has these panels are open by default. We've set the external state to have them closed to
    // lend some assurace to the test that external state is being used.
    expect(screen.queryByText("left panel content")).not.toBeInTheDocument();
    expect(screen.queryByText("right panel content")).not.toBeInTheDocument();

    const internalRightToggleButton = screen.getByRole("button", {
      name: "Toggle right panel",
    });
    const internalLeftToggleButton = screen.getByRole("button", {
      name: "Toggle left panel",
    });
    const externalRightToggleButton = screen.getByRole("button", {
      name: "external toggle right panel",
    });
    const externalLeftToggleButton = screen.getByRole("button", {
      name: "external toggle left panel",
    });

    // we want to ensure that both the internal buttons and external buttons use the same external state consistently
    fireEvent.click(externalRightToggleButton);
    fireEvent.click(externalLeftToggleButton);
    // Note: opening panels doesnt rely on a CSS transition to end for content to be visible

    expect(await screen.findByText("right panel content")).toBeInTheDocument();
    expect(screen.getByText("left panel content")).toBeInTheDocument();

    fireEvent.click(externalRightToggleButton);
    fireEvent.click(externalLeftToggleButton);
    fireEvent.transitionEnd(screen.getByTestId("leftPanel")); // RTL doesnt support css transitions so we need to fire this in the test manually
    fireEvent.transitionEnd(screen.getByTestId("rightPanel")); // RTL doesnt support css transitions so we need to fire this in the test manually

    await waitFor(() => {
      expect(screen.queryByText("left panel content")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("right panel content")).not.toBeInTheDocument();
    });

    fireEvent.click(internalRightToggleButton);
    fireEvent.click(internalLeftToggleButton);

    expect(await screen.findByText("right panel content")).toBeInTheDocument();
    expect(screen.getByText("left panel content")).toBeInTheDocument();

    fireEvent.click(internalRightToggleButton);
    fireEvent.click(internalLeftToggleButton);
    fireEvent.transitionEnd(screen.getByTestId("leftPanel")); // RTL doesnt support css transitions so we need to fire this in the test manually
    fireEvent.transitionEnd(screen.getByTestId("rightPanel")); // RTL doesnt support css transitions so we need to fire this in the test manually

    await waitFor(() => {
      expect(screen.queryByText("left panel content")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("right panel content")).not.toBeInTheDocument();
    });
  });
});
