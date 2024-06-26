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

const paddingOpts = [
  "none",
  [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16].map(
    (x) => x + "rem",
  ),
  "1px",
];

const paddingClass = (prefix) => (option) => {
  if (option == "1px") return `${prefix}-px`;
  if (option == "none") return `${prefix}-0`;
  else {
    const rem = +option.slice(0, -3);
    return `${prefix}-${4 * rem}`;
  }
};

const paddingDeclass = (prefix) => (option) => {
  if (option == `${prefix}-px`) return paddingOpts.length - 1;
  if (option == `${prefix}-0`) return 0;
  else {
    return paddingOpts.findIndex(
      (el) => option.split("-").pop() / 4 + "rem" == el,
    );
  }
};

export const makePadding = (side) => ({
  name: `${side} padding`,
  id: `c-padding-${(side = side.toLowerCase())}`,
  kind: "select",
  options: paddingOpts,
  class: paddingClass(`p${(side = side[0])}`),
  declass: paddingDeclass(`p${side}`),
  existing: (el) => el.startsWith(`p${side}`),
});
