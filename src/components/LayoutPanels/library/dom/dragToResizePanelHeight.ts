import {
  DEFAULT_PANEL_MAX_HEIGHT_RATIO,
  DEFAULT_PANEL_MIN_HEIGHT_PX,
  PANEL_AUTO_CLOSE_THRESHOLD_PX,
  PANEL_MIN_MOVE_THRESHOLD_PX,
} from "../panelConstants";

import { convertCssDimensionValueToPixels } from "./convertCssDimensionValueToPixels";
import {
  disableTransition,
  getY,
  removeDragEventListeners,
  restoreTransition,
  setupDragEventListeners,
} from "./dragHelpers";

const getHeightProperty = (
  element: HTMLElement,
  property: string
): number | undefined => {
  try {
    return convertCssDimensionValueToPixels({
      element,
      cssDimensionProperty: property,
    });
  } catch {
    return undefined;
  }
};

const getInitialHeight = (element: HTMLElement): number => {
  const inlineHeight = element.style.height;
  if (inlineHeight) {
    const match = inlineHeight.match(/(\d+\.?\d*)px/);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  return element.getBoundingClientRect().height;
};

export function dragToResizePanelHeight({
  closePanel = () => {},
  divRef,
  event,
  isTopEdgeResizeTarget = false,
  onMoveEnd = () => {},
}: {
  closePanel: () => void;
  divRef: React.RefObject<HTMLDivElement | null>;
  event: React.MouseEvent | React.TouchEvent;
  isTopEdgeResizeTarget?: boolean;
  onMoveEnd?: (newHeight: string) => void;
}): void {
  if (event.type.includes("mouse")) {
    event.preventDefault();
  }

  if (!divRef.current) {
    throw new Error("divRef.current is not defined");
  }

  const element = divRef.current;
  const previousTransition = disableTransition(element);
  const initialHeight = getInitialHeight(element);
  const minHeight =
    getHeightProperty(element, "min-height") ?? DEFAULT_PANEL_MIN_HEIGHT_PX;
  const maxHeight =
    getHeightProperty(element, "max-height") ??
    window.innerHeight * DEFAULT_PANEL_MAX_HEIGHT_RATIO;
  const startY = getY(event);

  let newHeightPixels = `${initialHeight}px`;
  let hasMoved = false;

  const clampHeight = (height: number): string => {
    const clamped = Math.max(minHeight, Math.min(maxHeight, height));
    return `${clamped}px`;
  };

  const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
    const currentY = getY(moveEvent);
    const delta = currentY - startY;

    if (!hasMoved && Math.abs(delta) < PANEL_MIN_MOVE_THRESHOLD_PX) {
      return;
    }
    hasMoved = true;

    const newHeight = isTopEdgeResizeTarget
      ? initialHeight - delta
      : initialHeight + delta;
    if (newHeight < 0) {
      return;
    }

    // Only auto-close if dragged significantly below the threshold (very small)
    // This prevents accidental closing during normal resizing
    if (newHeight < PANEL_AUTO_CLOSE_THRESHOLD_PX / 2) {
      newHeightPixels = `${newHeight}px`;
      element.style.height = newHeightPixels;
      handleDragEnd();
      closePanel();
      return;
    }

    // If below threshold but above half-threshold, clamp to min height instead of closing
    if (newHeight < PANEL_AUTO_CLOSE_THRESHOLD_PX) {
      newHeightPixels = clampHeight(newHeight);
      element.style.height = newHeightPixels;
      return;
    }

    newHeightPixels = clampHeight(newHeight);
    element.style.height = newHeightPixels;
  };

  const handleDragEnd = () => {
    removeDragEventListeners(handleDragMove, handleDragEnd);
    restoreTransition(element, previousTransition);
    onMoveEnd(newHeightPixels);
  };

  setupDragEventListeners(handleDragMove, handleDragEnd);
}
