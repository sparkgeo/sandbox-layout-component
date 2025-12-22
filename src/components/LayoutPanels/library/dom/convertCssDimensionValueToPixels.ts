const parseCssValue = (value: string): { number: number; unit: string } => {
  if (value.endsWith("px")) {
    return { number: parseFloat(value), unit: "px" };
  }

  // Find where the numeric portion ends and the unit begins
  const numericMatch = value.match(/^-?\d+(\.\d+)?/);
  const unitIndex = numericMatch ? numericMatch[0].length : -1;
  if (unitIndex === -1) {
    throw new Error(`Invalid CSS value: ${value}`);
  }

  const number = parseFloat(value);
  const unit = value.slice(unitIndex).trim();

  if (isNaN(number) || !unit) {
    throw new Error(`Invalid CSS value: ${value}`);
  }

  return { number, unit };
};

const inferDimensionFromCssProperty = (
  cssDimensionProperty: string
): "height" | "width" => {
  if (cssDimensionProperty.includes("height")) {
    return "height";
  }
  if (cssDimensionProperty.includes("width")) {
    return "width";
  }
  throw new Error(
    `Cannot infer dimension from CSS property "${cssDimensionProperty}".`
  );
};

/**
 * Converts a CSS dimension property value to pixels.
 * Supports: px, %, em, rem, vh, vw.
 * The dimension is automatically inferred from the cssDimensionProperty name.
 */
export const convertCssDimensionValueToPixels = ({
  element,
  cssDimensionProperty,
}: {
  element: HTMLElement;
  cssDimensionProperty: string;
}): number => {
  if (!element || !cssDimensionProperty) {
    throw new Error("Invalid element or CSS dimension property provided.");
  }

  const computedStyle = getComputedStyle(element);
  const cssValue = computedStyle.getPropertyValue(cssDimensionProperty).trim();

  if (!cssValue) {
    throw new Error(
      `CSS property "${cssDimensionProperty}" is not defined or invalid.`
    );
  }

  const { number, unit } = parseCssValue(cssValue);

  if (unit === "px") {
    return number;
  }

  switch (unit) {
    case "%": {
      const dimension = inferDimensionFromCssProperty(cssDimensionProperty);
      const parent = element.parentElement;
      if (!parent) {
        throw new Error(
          `Element uses percent unit but has no parent element to calculate ${dimension} from.`
        );
      }
      const parentDimension = parseFloat(getComputedStyle(parent)[dimension]);
      return (parentDimension * number) / 100;
    }
    case "em":
      return number * parseFloat(computedStyle.fontSize);
    case "rem":
      return (
        number * parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
    case "vh":
      return (window.innerHeight * number) / 100;
    case "vw":
      return (window.innerWidth * number) / 100;
    default:
      throw new Error(`Unsupported CSS unit: ${unit}`);
  }
};
