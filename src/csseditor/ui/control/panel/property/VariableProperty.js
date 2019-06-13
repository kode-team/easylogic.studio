import BaseProperty from "./BaseProperty";
import {
  LOAD,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import VarEditor from "../property-editor/VarEditor";

export default class VariableProperty extends BaseProperty {

  components () {
    return { VarEditor } 
  }

  isHideHeader() {
    return true; 
  }

  getBody() {
    return `<div class='property-item full var-property' ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current.variable || '';

    return `<VarEditor ref='$1' value='${value}' title='Variables' onchange='changeVarEditor' />`
  }

  [EVENT('changeVarEditor')] (variable) {
    var current = editor.selection.current; 

    if (current) {
      current.reset({ variable })
      this.emit('refreshCanvas');
    }
  }
}
