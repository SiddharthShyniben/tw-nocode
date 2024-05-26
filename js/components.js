export function createButton({ background } = { background: "blue" }) {
  const classes = `muy-stop-propagation bg-${background}-500 hover:bg-${background}-700 text-white font-bold pt-2 pb-2 pl-4 pr-4 rounded`;
  const el = document.createElement("button");
  el.setAttribute("data-name", "button");
  el.innerHTML =
    "<span class='muy-editable' data-name='button text'>Button</span>";
  el.classList.add(...classes.split(" "));

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
  });
  return el;
}

export function createButtonGroup() {
  const classes = "inline-flex rounded-md shadow-sm";
  const el = document.createElement("div");
  el.classList.add(...classes.split(" "));
  el.setAttribute("data-name", "button-group");
  return el;
}

export function createContainer() {
  const el = document.createElement("div");
  el.classList.add("container", "mx-auto");
  el.setAttribute("data-name", "container");
  return el;
}

export function createColumns({ number, gap } = { number: 3 }) {
  const el = document.createElement("div");
  el.classList.add("columns-" + number);
  if (gap) el.classList.add("gap-" + gap);
  el.setAttribute("data-name", `columns (${number})`);
  return el;
}

export function createBox({ shadow } = { shadow: "" }) {
  const el = document.createElement("div");
  el.classList.add("shadow" + (shadow ? "-" + shadow : ""));
  el.setAttribute("data-name", "box");
  return el;
}

export function createHeading({ level } = { level: 1 }) {
  if (isNaN(level) || level < 1 || level > 6) level = 1;
  const el = document.createElement("h" + level);
  if (level == 1)
    el.classList.add(
      ..."muy-editable mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white".split(
        " ",
      ),
    );
  else if (level > 1 && level < 6)
    el.classList.add(
      ...`text-${6 - level == 1 ? "" : 6 - level}xl font-extrabold dark:text-white`.split(
        " ",
      ),
    );
  else el.classList.add("text-lg", "font-bold", "dark:text-white");
  el.innerHTML = "heading goes here...";
  el.setAttribute("data-name", "h1");
  return el;
}

const paddingOpts = [
  "none",
  ...[.25, .5, .75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16].map(x => x + "rem"),
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

const makePadding = (side) => ({
  name: `${side} padding`,
  id: `c-padding-${(side = side.toLowerCase())}`,
  kind: "select",
  options: paddingOpts,
  class: paddingClass(`p${(side = side[0])}`),
  declass: paddingDeclass(`p${side}`),
  existing: (el) => el.startsWith(`p${side}`),
});

export const options = [
  makePadding("Top"),
  makePadding("Bottom"),
  makePadding("Left"),
  makePadding("Right"),
];

export const components = [
  { name: "container", icon: "image_aspect_ratio", fn: createContainer },
  {
    name: "columns",
    icon: "view_column",
    fn: createColumns,
    options: {
      number: 3,
      gap: 0,
    },
  },
  {
    name: "box",
    icon: "square",
    fn: createBox,
    options: { shadow: "" },
  },
  {
    name: "heading",
    icon: "format_h1",
    fn: createHeading,
    options: { level: 1 },
  },
  {
    name: "button",
    icon: "buttons_alt",
    fn: createButton,
    options: {
      background: "blue",
    },
  },
  { name: "button group", icon: "ad_group", fn: createButtonGroup },
];
