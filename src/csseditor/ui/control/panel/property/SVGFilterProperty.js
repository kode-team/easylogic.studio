import BaseProperty from "./BaseProperty";
import {
  LOAD, CLICK, DEBOUNCE,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";


export default class SVGFilterProperty extends BaseProperty {

  getTitle() {
    return 'SVG Filter'
  }

  getBody() {
    return `<div class='property-item full svg-property' ref='$body'></div>`;
  }


  getTools() {
    return `
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `
  }
  

  [CLICK("$add")]() {
    this.children.$svgPropertyEditor.trigger('add', 'filter')
  }


  [LOAD('$body')] () {
    var current = editor.selection.currentProject || { svgfilters: []} 
    var value = JSON.stringify(current.svgfilters);

    // 줄 때는 json 포맷으로 

    return `<SVGPropertyEditor ref='$svgPropertyEditor' value='${value}' hide-label="true" onchange='changeEditor' />`
  }

  [EVENT('changeEditor')] (svg) {
    var current = editor.selection.currentProject; 

    if (current) {
      // 받을 때는 배열로 
      current.reset({ svg })
      this.emit('refreshStyleView', current);
    }
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot();
  }
}
