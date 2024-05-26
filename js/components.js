export function createButton() {
  const classes =
    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
  const el = document.createElement("button");
  el.innerHTML = '<span class="muy-editable">Button</span>';
  el.classList.add(...classes.split(" "));
  return el;
}

export function createGreenButton() {
  const classes =
    "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded";
  const el = document.createElement("button");
  el.innerText = "Button";
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
  el.classList.add("container");
  return el;
}

export const components = [
  { name: "container", fn: createContainer },
  { name: "button", fn: createButton },
  { name: "green button", fn: createGreenButton },
  { name: "button group", fn: createButtonGroup },
];
