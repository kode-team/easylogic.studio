import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";



var transformList = [
  'matrix',
  'matrix3d',
  'translate',
  'translateX',  
  'translateY',
  'translateZ',
  'translate3d',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'scale3d',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'rotate3d',  
  'skewX',    
  'skewY',   
  'perspective'
];

export default class TransformProperty extends BaseProperty {

  getTitle() {
    return 'Transform'
  }

  getBody() {
    return `<div class='property-item full transform-property' ref='$body'></div>`;
  }


  getTools() {
    return `
      <select ref="$transformSelect">
      ${transformList.map(transform => {
        return `<option value='${transform}'>${transform}</option>`;
      }).join('')}
      </select>
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `
  }
  

  [CLICK("$add")]() {
    var transformType = this.refs.$transformSelect.value;

    this.children.$transformEditor.trigger('add', transformType)
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current.transform;

    return `<TransformEditor ref='$transformEditor' value='${value}' hide-label="true" onchange='changeTransformEditor' />`
  }

  [EVENT('changeTransformEditor')] (transform) {

    editor.selection.reset({ 
      transform
    })

    this.emit("refreshSelectionStyleView");

  }

  [EVENT('refreshSelection', 'refreshSelectionStyleView', 'refreshStyleView') + DEBOUNCE(100)] () {
    this.refresh();
  }
  
}
