import { createButton, createButtonGroup } from "./components.js";
import { getLineDistance, getOffset, walk } from "./util.js";

const root = document.querySelector("#main");
let insertMarkers = [];

const inside = ({ clientX, clientY }) => {
  const rect = getOffset(root);
  return (
    clientX >= rect.x &&
    clientY >= rect.y &&
    clientX <= rect.x2 &&
    clientY <= rect.y2
  );
};

let creator = createButton;

document
  .querySelector("#btn2")
  .addEventListener("click", () => (creator = createButtonGroup));

document
  .querySelector("#btn")
  .addEventListener("click", () => (creator = createButton));

function marker() {
  const insertMarker = document.createElement("div");
  insertMarker.classList.add("insert-marker");
  insertMarkers.push(insertMarker);
  return insertMarker;
}

function populateInsertMarkers() {
  insertMarkers.forEach((marker) => marker.remove());
  insertMarkers = [];

  walk(root, (el) => {
    const children = el.childNodes;
    if (!children) return;
    if (children.length == 0) return el.appendChild(marker());

    const toExecute = [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      toExecute.push(() => el.insertBefore(marker(), child));
      if (i == children.length - 1)
        toExecute.push(() => el.appendChild(marker()));
    }

    toExecute.forEach((el) => el());
  });
}

populateInsertMarkers();

window.addEventListener("mousemove", (e) => {
  if (!inside(e)) return insertMarkers.forEach((e) => e.classList.remove("hl"));
  const here = { x: e.clientX, y: e.clientY };
  insertMarkers
    .sort(
      (a, b) =>
        getLineDistance(here, getOffset(a)) -
        getLineDistance(here, getOffset(b)),
    )
    .forEach((el, i) =>
      i == 0 ? el.classList.add("hl") : el.classList.remove("hl"),
    );
});

window.addEventListener("click", (e) => {
  if (!inside(e)) return;
  const here = { x: e.clientX, y: e.clientY };
  const closestInsertMarker = insertMarkers.sort(
    (a, b) =>
      getLineDistance(here, getOffset(a)) - getLineDistance(here, getOffset(b)),
  )[0];

  closestInsertMarker.replaceWith(creator());
  populateInsertMarkers();
});
