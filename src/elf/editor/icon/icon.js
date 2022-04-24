import icons_list from "./icons_list";

export function iconUse(name, transform = "", opt = { width: 24, height: 24 }) {
  if (!name) return "";

  return /*html*/ `<svg viewBox="0 0 ${opt.width} ${
    opt.height
  }" xmlns="http://www.w3.org/2000/svg">
  <use href="#icon-${name}" transform="${transform || ""}" width="${
    opt.width
  }" height="${opt.height}" /> 
</svg>`;
}

export function iconUseForPath(pathString, opt = { width: 24, height: 24 }) {
  return /*html*/ `
    <svg viewBox="0 0 ${opt.width} ${
    opt.height
  }" xmlns="http://www.w3.org/2000/svg">
      <path d="${pathString}" style="fill:${opt.fill || "transparent"};stroke:${
    opt.stroke || "white"
  }" stroke-width="1" />
    </svg>
  `;
}

export function iconMake(svgString, opt = { width: 24, height: 24 }) {
  return /*html*/ `
    <svg viewBox="0 0 ${opt.width} ${opt.height}" xmlns="http://www.w3.org/2000/svg">
      ${svgString}
    </svg>
  `;
}

export function iconBlank() {
  return iconMake(
    /*html*/ `<path d="M0 0h24v24H0z" fill="none" fill-opacity="0"/>`
  );
}

export default icons_list;
