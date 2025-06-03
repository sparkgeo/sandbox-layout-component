import { convertCssWidthPropertyValueToPixels } from "./convertCssWidthPropertyToPixels";

const AUTO_CLOSE_PANEL_DRAG_THRESHOLD = 25; // px

export function dragToResizePanelWidth({
  closePanel = () => {},
  divRef,
  event,
  isLeftEdgeResizeTarget = false,
  onMoveEnd = () => {},
}: {
  closePanel: () => void;
  divRef: React.RefObject<HTMLDivElement>;
  event: React.MouseEvent | React.TouchEvent;
  isLeftEdgeResizeTarget?: boolean;
  onMoveEnd?: (newWidth: string) => void;
}): void {
  if (event.type.includes("mouse")) {
    // for touch events we rely on css's touch-action: none.
    // we dont call preventDefault for touch to prevent console errors
    event.preventDefault();
  }

  if (!divRef.current) {
    throw new Error("divRef.current is not defined");
  }

  const previousCssTransition = divRef.current.style.transition;
  const currentCssMaxWidth = convertCssWidthPropertyValueToPixels({
    element: divRef.current,
    cssProperty: "max-width",
  });
  const currentCssMinWidth = convertCssWidthPropertyValueToPixels({
    element: divRef.current,
    cssProperty: "min-width",
  });

  const dragStartPosition =
    "touches" in event ? event.touches[0].screenX : event.screenX;

  divRef.current.style.transition = "none"; // remove the transition do the div width updates in real time with the mouse/touch movement

  const panelRectangle = divRef.current.getBoundingClientRect();
  let newPanelWidthPixels: string = `${panelRectangle.width}px`;

  const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
    const currentDragPositionRelativeToScreen =
      "touches" in moveEvent ? moveEvent.touches[0].screenX : moveEvent.screenX;

    const dragPositionChange =
      dragStartPosition - currentDragPositionRelativeToScreen;
    const newPanelWidth = isLeftEdgeResizeTarget
      ? panelRectangle.width + dragPositionChange
      : panelRectangle.width - dragPositionChange;
    const isNewWidthNegative = newPanelWidth < 0;
    if (isNewWidthNegative) {
      return;
    }
    const hasDragCrossedCssMinWidthThreshold =
      newPanelWidth < (currentCssMinWidth ?? 10);
    const hasDragCrossedCssMaxWidthThreshold =
      newPanelWidth > (currentCssMaxWidth ?? 300);
    const hasDragCrossedAutoCloseThreshold =
      newPanelWidth < AUTO_CLOSE_PANEL_DRAG_THRESHOLD;

    if (hasDragCrossedAutoCloseThreshold) {
      handleDragEnd();
      closePanel();

      return;
    }

    if (hasDragCrossedCssMinWidthThreshold) {
      // no need to continue on to update element width, as it is already at min width.
      return;
    }

    if (hasDragCrossedCssMaxWidthThreshold) {
      // no need to continue on to update element width, as it is already at max width.
      return;
    }

    newPanelWidthPixels = `${newPanelWidth}px`;
    divRef.current!.style.width = newPanelWidthPixels;
  };

  const removeEventListeners = () => {
    window.removeEventListener("mousemove", handleDragMove);
    window.removeEventListener("touchmove", handleDragMove);
    window.removeEventListener("mouseup", handleDragEnd);
    window.removeEventListener("touchend", handleDragEnd);
  };
  const resetStyleTransition = () => {
    divRef.current!.style.transition = previousCssTransition;
  };

  const handleDragEnd = () => {
    removeEventListeners();
    resetStyleTransition();
    onMoveEnd(newPanelWidthPixels);
  };

  window.addEventListener("mousemove", handleDragMove);
  window.addEventListener("touchmove", handleDragMove);
  window.addEventListener("mouseup", handleDragEnd);
  window.addEventListener("touchend", handleDragEnd);
}
