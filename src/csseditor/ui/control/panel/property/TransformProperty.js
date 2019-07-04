import BaseProperty from "./BaseProperty";
import {
  LOAD,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";

export default class TransformProperty extends BaseProperty {

  isHideHeader() {
    return true; 
  }

  getBody() {
    return `<div class='property-item full transform-property' ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current.transform;

    return `<TransformEditor ref='$1' value='${value}' title='Transform' onchange='changeTransformEditor' />`
  }

  [EVENT('changeTransformEditor')] (transform) {
    var current = editor.selection.current; 

    if (current) {
      current.reset({ transform })
      this.emit('refreshElement', current);
    }
  }
}
