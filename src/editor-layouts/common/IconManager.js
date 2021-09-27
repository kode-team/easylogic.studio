import { EditorElement } from "el/editor/ui/common/EditorElement";
import { LOAD } from 'el/sapa/Event';
import icon from 'el/editor/icon/icon';
import { isString } from 'el/sapa/functions/func';


export default class IconManager extends EditorElement {

  template() {
    return /*html*/`
      <svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg" ref="$list" style="display:none;">
      </svg>
    `;
  }

  [LOAD('$list')] () {
    return Object.entries(icon).map(([key, value]) => {
      if (isString(value) === false ) return '';
      return value.replace(/\<svg/g, `<svg id="icon-${key}"`);
    })
  }
}