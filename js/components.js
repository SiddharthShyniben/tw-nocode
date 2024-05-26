export function createButton() {
  const classes =
    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
  const el = document.createElement("button");
  el.innerText = "Button";
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
