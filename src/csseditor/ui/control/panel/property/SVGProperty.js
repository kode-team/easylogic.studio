import BaseProperty from "./BaseProperty";
import {
  LOAD,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";

export default class SVGProperty extends BaseProperty {

  isHideHeader() {
    return true; 
  }

  getBody() {
    return `<div class='property-item full svg-property' ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.currentProject || { svg: []} 
    var value = JSON.stringify(current.svg);

    // 줄 때는 json 포맷으로 

    return `<SVGPropertyEditor ref='$1' value='${value}' title='SVG' onchange='changeEditor' />`
  }

  [EVENT('changeEditor')] (svg) {
    var current = editor.selection.currentProject; 

    if (current) {
      // 받을 때는 배열로 
      current.reset({ svg })
      this.emit('refreshStyleView', current);
    }
  }
}
