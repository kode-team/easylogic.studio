import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK,
} from "../../../util/Event";

import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { Transform } from "../../../editor/css-property/Transform";



var transformList = [

  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'rotate3d',    
  'skewX',    
  'skewY',   
  'translate',
  'translateX',  
  'translateY',
  'translateZ',
  'translate3d',
  'perspective',    
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'scale3d',
  'matrix',
  'matrix3d',  
];

const i18n = editor.initI18n('transform.property');

export default class TransformProperty extends BaseProperty {

  getTitle() {
    return i18n('title')
  }

  getBody() {
    return `<div class='full transform-property' ref='$body'></div>`;
  }

  hasKeyframe() {
    return true; 
  }

  getKeyframeProperty () {
    return 'transform'
  }

  getTools() {
    return /*html*/`
      <select ref="$transformSelect">
      ${transformList.map(transform => {
        var label = editor.i18n('css.item.' + transform)
        return `<option value='${transform}'>${label}</option>`;
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

    return /*html*/`<TransformEditor ref='$transformEditor' value='${value}' hide-label="true" onchange='changeTransformEditor' />`
  }

  [EVENT('changeTransformEditor')] (transform) {

    editor.selection.reset({ 
      transform
    })

    editor.selection.each(item => {
      item.reset({
        transform: Transform.replaceAll(item.transform, transform)
      })
    })

    this.emit("refreshSelectionStyleView");

  }

  [EVENT('refreshSelection', 'refreshSelectionStyleView', 'refreshStyleView') + DEBOUNCE(100)] () {
    this.refreshShowIsNot(['project', 'artboard']);
  }

  
}
