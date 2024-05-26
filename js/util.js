export function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    x2: rect.right + window.scrollX,
    y2: rect.bottom + window.scrollY,
  };
}

export const distance = (el1, el2) =>
  Math.sqrt((el1.x - el2.x) ** 2 + (el1.y - el2.y) ** 2);

export function walk(node, func, depth = 0) {
  func(node, depth);
  node.childNodes.forEach((child) => {
    if (
      child.nodeType !== Node.TEXT_NODE &&
      !child.classList.contains("insert-marker")
    )
      walk(child, func, depth++);
  });
}

export function getLineDistance(point, line) {
  const { x, y } = point;
  const { x: x1, y: y1, x2, y2 } = line;

  const deltaX = x - x1;
  const deltaY = y - y1;
  const lineDeltaX = x2 - x1;
  const lineDeltaY = y2 - y1;

  const dotProduct = deltaX * lineDeltaX + deltaY * lineDeltaY;
  const lineLengthSquared = lineDeltaX * lineDeltaX + lineDeltaY * lineDeltaY;
  const parameter =
    lineLengthSquared !== 0 ? dotProduct / lineLengthSquared : -1;

  const nearestX =
    parameter < 0 ? x1 : parameter > 1 ? x2 : x1 + parameter * lineDeltaX;
  const nearestY =
    parameter < 0 ? y1 : parameter > 1 ? y2 : y1 + parameter * lineDeltaY;

  const dx = x - nearestX;
  const dy = y - nearestY;

  // Squared distance is okay for comparison
  // return Math.sqrt(dx * dx + dy * dy)
  return dx * dx + dy * dy;
}

export const classNames = {
  button: ["text-white", "px-3", "opacity-70", "hover:opacity-100"],
  input: [
    "bg-gray-50",
    "border",
    "border-gray-300",
    "text-gray-900",
    "text-sm",
    "rounded-lg",
    "focus:ring-blue-500",
    "focus:border-blue-500",
    "block",
    "w-full",
    "p-2.5",
    "dark:bg-gray-700",
    "dark:border-gray-600",
    "dark:placeholder-gray-400",
    "dark:text-white",
    "dark:focus:ring-blue-500",
    "dark:focus:border-blue-500",
  ],
  label: [
    "block",
    "mb-2",
    "text-sm",
    "font-medium",
    "text-gray-900",
    "dark:text-white",
  ],
  select: [
    "bg-gray-50",
    "border",
    "border-gray-300",
    "text-gray-900",
    "text-sm",
    "rounded-lg",
    "focus:ring-blue-500",
    "focus:border-blue-500",
    "block",
    "w-full",
    "p-2.5",
    "dark:bg-gray-700",
    "dark:border-gray-600",
    "dark:placeholder-gray-400",
    "dark:text-white",
    "dark:focus:ring-blue-500",
    "dark:focus:border-blue-500",
    "z-[99999]",
    "mb-3",
  ],
};
