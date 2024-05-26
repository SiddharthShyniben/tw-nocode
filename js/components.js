export function createButton({ background } = { background: "blue" }) {
  const classes = `bg-${background}-500 hover:bg-${background}-700 text-white font-bold py-2 px-4 rounded`;
  const el = document.createElement("button");
  el.setAttribute("data-name", "button");
  el.innerHTML = '<span class="muy-editable">Button</span>';
  el.classList.add(...classes.split(" "));
  return el;
}

export function createButtonGroup() {
  const classes = "inline-flex rounded-md shadow-sm";
  const el = document.createElement("div");
  el.classList.add(...classes.split(" "));
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

export const components = [
  { name: "container", fn: createContainer },
  {
    name: "columns",
    fn: createColumns,
    options: {
      number: 3,
      gap: 0,
    },
  },
  {
    name: "button",
    fn: createButton,
    options: {
      background: "blue",
    },
  },
  { name: "button group", fn: createButtonGroup },
];
