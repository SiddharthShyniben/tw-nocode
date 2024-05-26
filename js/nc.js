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

    this.undoHistory = [];
    this.redoHistory = [];
    this.maxUndo = 100;

    this.init();
  }

  init() {
    this.createButtons();
    this.populateInsertMarkers();
    this.listen();
  }

  saveUndo() {
    this.undoHistory.push(this.root.innerHTML);
    if (this.undoHistory.length > this.maxUndo) this.undoHistory.shift();
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
    this.root.addEventListener("mousemove", (e) => {
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

    const editEl = (el) => {
      el.setAttribute("contenteditable", true);

      let p = el.querySelector(".muy-editable");
      if (!p) {
        if (el.classList.contains("muy-editable")) p = el;
        else return;
      }

      const s = window.getSelection(),
        r = document.createRange();

      r.setStart(p, 0);
      r.setEnd(p, 0);
      s.removeAllRanges();
      s.addRange(r);
    };

    this.root.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      editEl(e.target);
    });

    this.root.addEventListener("click", (e) => {
      if (e.target instanceof HTMLHeadingElement) {
        editEl(e.target);
        e.target.addEventListener("change", this.saveUndo);
        return;
      }

      const here = { x: e.clientX, y: e.clientY };
      const closestInsertMarker = this.insertMarkers.sort(
        (a, b) =>
          getLineDistance(here, getOffset(a)) -
          getLineDistance(here, getOffset(b)),
      )[0];

      this.redoHistory = [];
      this.saveUndo();
      closestInsertMarker.replaceWith(this.creator(this.creatorOptions));
      this.populateInsertMarkers();
    });

    window.addEventListener("keypress", (e) => {
      if (e.key == "z" && e.ctrlKey) {
        const content = this.root.innerHTML;
        this.redoHistory.push(content);
        this.root.innerHTML = this.undoHistory.pop() || content;
      } else if (e.key == "r" && e.ctrlKey) {
        const content = this.root.innerHTML;
        this.saveUndo();
        this.root.innerHTML = this.redoHistory.pop() || content;
      }
    });
  }

  marker() {
    const insertMarker = document.createElement("div");
    insertMarker.classList.add("insert-marker");
    this.insertMarkers.push(insertMarker);
    return insertMarker;
  }
}
