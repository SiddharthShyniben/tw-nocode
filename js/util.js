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

export function getLineDistance(here, line) {
  const { x: x1, y: y1, x2, y2 } = line;
  const { x: x0, y: y0 } = here;

  return (
    Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1)) /
    distance({ x: x1, y: y1 }, { x: x2, y: y2 })
  );
}
