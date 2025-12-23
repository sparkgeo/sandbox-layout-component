export const getX = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): number => {
  if ("touches" in event) {
    return (event as TouchEvent).touches[0].screenX;
  }
  return (event as MouseEvent).screenX;
};

export const getY = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): number => {
  if ("touches" in event) {
    return (event as TouchEvent).touches[0].screenY;
  }
  return (event as MouseEvent).screenY;
};

export const setupDragEventListeners = (
  handleDragMove: (event: MouseEvent | TouchEvent) => void,
  handleDragEnd: () => void
): void => {
  window.addEventListener("mousemove", handleDragMove);
  window.addEventListener("touchmove", handleDragMove);
  window.addEventListener("mouseup", handleDragEnd);
  window.addEventListener("touchend", handleDragEnd);
};

export const removeDragEventListeners = (
  handleDragMove: (event: MouseEvent | TouchEvent) => void,
  handleDragEnd: () => void
): void => {
  window.removeEventListener("mousemove", handleDragMove);
  window.removeEventListener("touchmove", handleDragMove);
  window.removeEventListener("mouseup", handleDragEnd);
  window.removeEventListener("touchend", handleDragEnd);
};

export const disableTransition = (element: HTMLElement): string => {
  const previousTransition = element.style.transition;
  element.style.transition = "none";
  return previousTransition;
};

export const restoreTransition = (
  element: HTMLElement,
  previousTransition: string
): void => {
  element.style.transition = previousTransition || "";
};
