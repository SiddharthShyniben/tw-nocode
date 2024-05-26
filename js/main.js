import { NC } from "./nc.js";

const root = document.querySelector("#main");
const buttons = document.querySelector("#buttons");
const options = document.querySelector("#options");
const path = document.querySelector("#path");
const contextmenu = document.querySelector("#context-menu");

new NC({ root, buttons, options, path, contextmenu });
