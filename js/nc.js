import { components, options } from "./components.js";
import { classNames, getLineDistance, getOffset, walk } from "./util.js";

export class NC {
  constructor({ root, buttons, options, path, contextmenu }) {
    this.root = root;
    this.buttons = buttons;
    this.options = options;
    this.path = path;
    this.contextmenu = contextmenu;

    this.insertMarkers = [];

    this.creator = null;
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

  createButtons() {
    const buttons = [];

    for (const component of components) {
      const button = document.createElement("button");
      button.classList.add(...classNames.button);
      button.setAttribute("draggable", true);
      button.setAttribute("data-tippy-content", component.name);
      button.innerHTML = `<span class='material-symbols-outlined'>${component.icon}</span>`;
      buttons.push(button);

      const applyButton = () => {
        this.options.innerHTML = "";
        this.creator = component.fn;
        buttons.forEach((b) => b.classList.remove("opacity-100"));
        button.classList.add("opacity-100");

        this.creatorOptions = component.options || {};
        if (component.options) {
          for (const k in component.options) {
            const input = document.createElement("input");
            input.setAttribute("placeholder", k);
            input.classList.add(...classNames.input);
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
      };

      button.addEventListener("click", applyButton);
      button.addEventListener("dragstart", () => {
        applyButton();
        walk(this.root, (el) => el.classList.add("drag-hover"));
      });
      button.addEventListener("drag", (e) => this.renderInserts(e));
      button.addEventListener("dragend", (e) => {
        walk(this.root, (el) => el.classList.remove("drag-hover"));
        if (this.inside(e)) this.create(e);
      });

      this.buttons.appendChild(button);
    }

    tippy.createSingleton(tippy("[data-tippy-content]"), {
      delay: [500, 0],
      moveTransition: "transform 0.2s ease-out",
    });
  }

  populateInsertMarkers() {
    this.insertMarkers.forEach((marker) => marker.remove());
    this.insertMarkers = [];

    walk(this.root, (el) => {
      const children = el.childNodes;
      if (!children) return;
      if (children.length == 0) return el.appendChild(this.marker());
      if (
        el.classList.contains("muy-editable") ||
        el.classList.contains("muy-stop-propagation")
      )
        return;

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
    window.addEventListener("keydown", listener);
    this.root.addEventListener("mousemove", (e) => {
      if (this.creator) this.renderInserts(e);
    });

    this.root.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      const element = e.target;
      this._elToCopy = element;

      this.contextmenu.innerHTML = `<h3 id="c-title" class="text-lg text-white font-bold mb-4">${element.dataset.name}</h3>`;

      for (const group of options) {
        const item = document.createElement("p");
        item.classList.add("border-bottom", "border-grey-600");
        item.innerHTML = group.name + " >";

        const tippyEl = document.createElement("div");

        for (const option of group.opts) {
          if (option.kind == "select") {
            const label = document.createElement("label");
            label.innerHTML = option.name;
            label.setAttribute("for", option.id);
            label.classList.add(...classNames.label);

            const select = document.createElement("select");
            select.classList.add(...classNames.select);
            select.id = option.id;

            for (let s of option.options) {
              const option = document.createElement("option");
              option.innerText = s;
              select.appendChild(option);
            }

            tippyEl.appendChild(label);
            tippyEl.appendChild(select);

            const existingClass = [...element.classList].find(option.existing);
            select.selectedIndex = existingClass
              ? option.declass(existingClass)
              : 0;

            if (select.selectedIndex < 0) select.selectedIndex = 0;
            console.log(select.selectedIndex);

            const o = select.children[select.selectedIndex];
            o.setAttribute("selected", "selected");

            select.onchange = (e) => {
              const value = option.options[e.target.selectedIndex];

              if (existingClass)
                element.classList.replace(existingClass, option.class(value));
              else element.classList.add(option.class(value));
            };
          }
        }
        this.contextmenu.appendChild(item);

        tippy(item, {
          content: tippyEl,
          allowHTML: true,
          interactive: true,
          appendTo: () => document.body, // NOTE: a1:wq1y?
          sticky: true,
          placement: "left",
        });
      }

      tippy(e.target, {
        content: this.contextmenu,
        allowHTML: true,
        interactive: true,
        appendTo: () => document.body, // NOTE: a11y?
        sticky: true,
        placement: "auto-start",
        trigger: "manual",
        onHide() {
          this._elToCopy = null;
        },
      }).show();

      this.editEl(element);
    });

    this.root.addEventListener("click", (e) => this.create(e));

    window.addEventListener("keypress", (e) => {
      if (e.ctrlKey) {
        if (e.key == "z") {
          const content = this.root.innerHTML;
          this.redoHistory.push(content);
          this.root.innerHTML = this.undoHistory.pop() || content;
        } else if (e.key == "r") {
          const content = this.root.innerHTML;
          this.saveUndo();
          this.root.innerHTML = this.redoHistory.pop() || content;
        } else if (e.key == "c") {
          e.preventDefault();
          const content = this._elToCopy.innerHTML || this.root.innerHTML;
          console.log("copying", { content });
        }
      }
    });
  }

  editEl(el) {
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
  }

  renderInserts(e) {
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
  }

  create(e) {
    if (!this.inside(e)) return;
    if (e.target instanceof HTMLHeadingElement) {
      this.editEl(e.target);
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
    if (this.creator)
      closestInsertMarker.replaceWith(this.creator(this.creatorOptions));
    this.populateInsertMarkers();
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

  saveUndo() {
    this.undoHistory.push(this.root.innerHTML);
    if (this.undoHistory.length > this.maxUndo) this.undoHistory.shift();
  }
}
