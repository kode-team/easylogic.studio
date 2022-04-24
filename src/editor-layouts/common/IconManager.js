import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { LOAD } from "sapa";
import icon from "elf/editor/icon/icon";
import { isString } from "sapa";

export default class IconManager extends EditorElement {
  template() {
    return /*html*/ `
      <svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg" ref="$list" style="display:none;">
      </svg>
    `;
  }

  [LOAD("$list")]() {
    return Object.entries(icon).map(([key, value]) => {
      if (isString(value) === false) return "";
      // eslint-disable-next-line no-useless-escape
      return value.replace(/\<svg/g, `<svg id="icon-${key}"`);
    });
  }
}
