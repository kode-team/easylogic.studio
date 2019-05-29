import BaseProperty from "./BaseProperty";
import {
  LOAD,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import VarEditor from "../../shape/property-editor/VarEditor";

export default class VariableProperty extends BaseProperty {

  components () {
    return { VarEditor } 
  }

  getTitle() {
    return "Variables";
  }

  getBody() {
    return `<div class='property-item full var-property' ref='$body'>
      ${this.loadTemplate('$body')}
    </div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current.variable || '';

    return `<VarEditor ref='$1' value='${value}' onchange='changeVarEditor' />`
  }

  refresh() {
    this.load();
  }

  [EVENT('changeVarEditor')] (variable) {
    var current = editor.selection.current; 

    if (current) {
      current.reset({ variable })
      this.emit('refreshCanvas');
    }
  }
}
