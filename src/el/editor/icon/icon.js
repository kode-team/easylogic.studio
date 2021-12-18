
import icons_list from './icons_list';

export function iconUse(name, transform = "", opt = { width: 24, height: 24 }) {
  return /*html*/`
    <svg viewBox="0 0 ${opt.width} ${opt.height}" xmlns="http://www.w3.org/2000/svg">
      <use href="#icon-${name}" transform="${transform || ""}" width="${opt.width}" height="${opt.height}" /> 
    </svg>
  `
}


export default icons_list;
