import { componentClasses } from "./classes.js";
import { makePadding } from "./util.js";

export function createButton({ background } = { background: "blue" }) {
  const el = document.createElement("button");
  el.setAttribute("data-name", "button");
  el.innerHTML =
    "<span class='muy-editable' data-name='button text'>Button</span>";
  el.classList.add(...componentClasses.button(background));

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
  });
  return el;
}

export function createButtonGroup() {
  const el = document.createElement("div");
  el.classList.add(...componentClasses.buttonGroup);
  el.setAttribute("data-name", "button-group");
  return el;
}

export function createContainer() {
  const el = document.createElement("div");
  el.classList.add(...componentClasses.container);
  el.setAttribute("data-name", "container");
  return el;
}

export function createColumns({ number, gap } = { number: 3 }) {
  const el = document.createElement("div");
  el.classList.add(componentClasses.columns(number, gap));
  el.setAttribute("data-name", `columns (${number})`);
  return el;
}

export function createBox({ shadow } = { shadow: "" }) {
  const el = document.createElement("div");
  el.classList.add(componentClasses.box(shadow));
  el.setAttribute("data-name", "box");
  return el;
}

export function createHeading({ level } = { level: 1 }) {
  if (isNaN(level) || level < 1 || level > 6) level = 1;
  const el = document.createElement("h" + level);
  el.classList.add(componentClasses.heading(level));
  el.innerHTML = "heading goes here...";
  el.setAttribute("data-name", "h1");
  return el;
}

export function createImage({ src, alt } = { src: "", alt: "" }) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.setAttribute("data-name", "image");
  return img;
}

export function createNavbar({ brand } = { brand: "brand" }) {
  const nav = document.createElement("nav");
  nav.classList.add(...componentClasses.navbar);

  const div = document.createElement("div");
  div.classList.add(...componentClasses.navbarInner);

  const heroLink = document.createElement("a");
  heroLink.classList.add(...componentClasses.heroLink);

  const heroText = document.createElement("span");
  heroText.classList.add(...componentClasses.heroText);
  heroText.innerHTML = brand;

  const burger = document.createElement("button");
  burger.classList.add(...componentClasses.burger);
  // TODO: ARIA
  burger.innerHTML =
    '<span class="sr-only">Open main menu</span><svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/> </svg>';

  const links = document.createElement("div");
  links.classList.add(...componentClasses.navLinks);

  const linkList = document.createElement("ul");
  linkList.classList.add(...componentClasses.navUl);

  for (const item of ["About", "Services", "Pricing", "Contact"]) {
    const li = document.createElement("li");
    const a = document.createElement("a");
  }

  heroLink.appendChild(heroText);
  div.appendChild(heroLink);
  div.appendChild(burger);
  nav.appendChild(div);

  return nav;
}

export const options = [
  {
    name: "Padding",
    opts: ["Top", "Bottom", "Left", "Right"].map(makePadding),
  },
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
  {
    name: "image",
    icon: "image",
    fn: createImage,
    options: {
      src: { type: "file", accept: "image/*" },
      alt: "image",
    },
  },
  { name: "button group", icon: "ad_group", fn: createButtonGroup },
  {
    name: "navbar",
    icon: "menu",
    fn: createNavbar,
    options: {
      brand: "title",
      style: "blue-500",
    },
  },
];
