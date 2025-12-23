import { convertCssDimensionValueToPixels } from "./convertCssDimensionValueToPixels";
import {
  disableTransition,
  getX,
  removeDragEventListeners,
  restoreTransition,
  setupDragEventListeners,
} from "./dragHelpers";

const AUTO_CLOSE_PANEL_DRAG_THRESHOLD = 25; // px

export function dragToResizePanelWidth({
  closePanel = () => {},
  divRef,
  event,
  isLeftEdgeResizeTarget = false,
  onMoveEnd = () => {},
}: {
  closePanel: () => void;
  divRef: React.RefObject<HTMLDivElement | null>;
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

  const previousCssTransition = disableTransition(divRef.current);
  const currentCssMaxWidth = convertCssDimensionValueToPixels({
    element: divRef.current,
    cssDimensionProperty: "max-width",
  });
  const currentCssMinWidth = convertCssDimensionValueToPixels({
    element: divRef.current,
    cssDimensionProperty: "min-width",
  });

  const dragStartPosition = getX(event);

  const panelRectangle = divRef.current.getBoundingClientRect();
  let newPanelWidthPixels = `${panelRectangle.width}px`;

  const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
    const currentDragPositionRelativeToScreen = getX(moveEvent);

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
    if (divRef.current) {
      divRef.current.style.width = newPanelWidthPixels;
    }
  };

  const handleDragEnd = () => {
    removeDragEventListeners(handleDragMove, handleDragEnd);
    if (divRef.current) {
      restoreTransition(divRef.current, previousCssTransition);
    }
    onMoveEnd(newPanelWidthPixels);
  };

  setupDragEventListeners(handleDragMove, handleDragEnd);
}
