import { Length } from "../../editor/unit/Length";

// import { parseParamNumber } from "../filter/functions";

export const DEFAULT_FUNCTION = item => item;

export function CSS_SORTING(style) {

  var keys = Object.keys(style);

  keys.sort(CSS_SORTING_FUNCTION);

  var newStyle = {};
  keys.forEach(key => {
    newStyle[key] = style[key];
  });

  return newStyle;
}

export function CSS_TO_STRING(style) {
  var newStyle = CSS_SORTING(style);

  return Object.keys(newStyle)
    .filter(key => {
      return !!newStyle[key];
    })
    .map(key => {
      return `${key}: ${newStyle[key]}`;
    })
    .join(";");
}


var ordering = {
  position: 1,
  left: 2,
  top: 2,
  right: 2,
  bottom: 2,
  width: 3,
  height: 3,

  "font-size": 4,
  "font-family": 4,

  opacity: 10,
  "border-radius": 10,

  "box-shadow": 15,
  "text-shadow": 15,
  filter: 15,

  "background-clip": 50,
  "-webkit-background-clip": 50,

  "background-repeat": 100,
  "background-blend-mode": 100,
  "background-image": 100,
  "background-size": 100,
  "background-position": 100,

  transform: 1000
};

const CSS_SORTING_FUNCTION = (a, b) => {

  if (a.includes('--') && !b.includes('--')) {
    return -1; 
  } else if (b.includes('--') && !a.includes('--')) {
    return 1; 
  }

  var aN = ordering[a] || Number.MAX_SAFE_INTEGER;
  var bN = ordering[b] || Number.MAX_SAFE_INTEGER;  

  if (aN == bN) return 0;

  return aN < bN ? -1 : 1;
};
