import { components, createButton } from "./components.js";
import { getLineDistance, getOffset, walk } from "./util.js";

export class NC {
  constructor(root, buttons, options, path) {
    this.root = root;
    this.buttons = buttons;
    this.options = options;
    this.path = path;

    this.insertMarkers = [];

    this.creator = createButton;
    this.creatorOptions = {};

    this.init();
  }

  init() {
    this.createButtons();
    this.populateInsertMarkers();
    this.listen();
  }

  createButtons() {
    for (const component of components) {
      const button = document.createElement("button");
      button.classList.add(
        ..."bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded".split(
          " ",
        ),
      );
      button.innerText = "Create a " + component.name;
      button.addEventListener("click", () => {
        this.options.innerHTML = "";
        this.creator = component.fn;

        this.creatorOptions = component.options || {};
        if (component.options) {
          for (const k in component.options) {
            const input = document.createElement("input");
            input.setAttribute("placeholder", k);
            input.classList.add(
              ..."bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500".split(
                " ",
              ),
            );
            input.addEventListener("keydown", (e) => {
              if (e.key == "Enter") {
                const value = e.target.value;
                this.creatorOptions[k] = value;
                e.target.value = "";
              }
            });
            this.options.appendChild(input);
          }
        }
      });

      this.buttons.appendChild(button);
    }
  }

  populateInsertMarkers() {
    this.insertMarkers.forEach((marker) => marker.remove());
    this.insertMarkers = [];

    walk(this.root, (el) => {
      const children = el.childNodes;
      if (!children) return;
      if (children.length == 0) return el.appendChild(this.marker());
      if (el.classList.contains("muy-editable")) return;

      const toExecute = [];

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        toExecute.push(() => el.insertBefore(this.marker(), child));
        if (i == children.length - 1)
          toExecute.push(() => el.appendChild(this.marker()));
      }

      toExecute.forEach((el) => el());
    });
  }

  listen() {
    window.addEventListener("mousemove", (e) => {
      if (!this.inside(e))
        return this.insertMarkers.forEach((e) => e.classList.remove("hl"));
      const here = { x: e.clientX, y: e.clientY };
      const p = [...document.elementsFromPoint(here.x, here.y)]
        .slice(0, -3)
        .map((el) => el.getAttribute("data-name"))
        .filter(Boolean)
        .reverse()
        .join(" > ");
      (this.path.innerText = p) || (this.path.innerHTML = "&nbsp;");
      this.insertMarkers
        .sort(
          (a, b) =>
            getLineDistance(here, getOffset(a)) -
            getLineDistance(here, getOffset(b)),
        )
        .forEach((el, i) =>
          i == 0 ? el.classList.add("hl") : el.classList.remove("hl"),
        );
    });

    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.target.setAttribute("contenteditable", true);

      const p = e.target.querySelectorAll(".muy-editable");
      if (!p) return;
      const s = window.getSelection(),
        r = document.createRange();

      r.setStart(p, 0);
      r.setEnd(p, 0);
      s.removeAllRanges();
      s.addRange(r);
    });

    window.addEventListener("click", (e) => {
      if (!this.inside(e)) return;
      const here = { x: e.clientX, y: e.clientY };
      const closestInsertMarker = this.insertMarkers.sort(
        (a, b) =>
          getLineDistance(here, getOffset(a)) -
          getLineDistance(here, getOffset(b)),
      )[0];

      closestInsertMarker.replaceWith(this.creator(this.creatorOptions));
      this.populateInsertMarkers();
    });
  }

  marker() {
    const insertMarker = document.createElement("div");
    insertMarker.classList.add("insert-marker");
    this.insertMarkers.push(insertMarker);
    return insertMarker;
  }

  inside({ clientX, clientY }) {
    const rect = getOffset(this.root);
    return (
      clientX >= rect.x &&
      clientY >= rect.y &&
      clientX <= rect.x2 &&
      clientY <= rect.y2
    );
  }
}