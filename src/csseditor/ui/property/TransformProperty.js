import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK,
} from "../../../util/Event";

import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { Transform } from "../../../editor/css-property/Transform";
import RotateEditorView from "../view-items/RotateEditorView";

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


export default class TransformProperty extends BaseProperty {

  components() {
    return {
      ...super.components(),
      RotateEditorView
    }
  }

  getTitle() {
    return this.$i18n('transform.property.title')
  }

  getBody() {
    return `
      <RotateEditorView />
      <div class='full transform-property' ref='$body'></div>
    `;
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
        var label = this.$i18n('css.item.' + transform)
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
    var current = this.$selection.current || {} 
    var value = current.transform;

    return /*html*/`
      <TransformEditor ref='$transformEditor' value='${value}' hide-label="true" onchange='changeTransformEditor' />
    `
  }

  [EVENT('changeTransformEditor')] (transform) {
    this.emit('setAttribute', { 
      transform: (item) => {
        return Transform.replaceAll(item.transform, transform)
      }
    })
  }

  [EVENT('refreshSelection')] () {
    this.refreshShowIsNot(['project']);
  }

  [EVENT('refreshRect')] () {
    this.refresh();
  }

}
