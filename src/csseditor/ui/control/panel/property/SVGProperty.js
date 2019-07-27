import BaseProperty from "./BaseProperty";
import {
  LOAD, CLICK,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";



var propertyList = [
  {type: "filter", title: 'FILTER' },
  {type: "clip-path", title: 'CLIP-PATH' }
];


export default class SVGProperty extends BaseProperty {

  getTitle() {
    return 'SVG Property'
  }

  getBody() {
    return `<div class='property-item full svg-property' ref='$body'></div>`;
  }


  getTools() {
    return `
      <select ref="$propertySelect">
        ${propertyList.map(property => {
          return `<option value='${property.type}'>${property.title}</option>`;
        }).join('')}
      </select>
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `
  }
  

  [CLICK("$add")]() {
    var svgType = this.refs.$propertySelect.value;

    this.children.$svgPropertyEditor.trigger('add', svgType)
  }


  [LOAD('$body')] () {
    var current = editor.selection.currentProject || { svg: []} 
    var value = JSON.stringify(current.svg);

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
}
