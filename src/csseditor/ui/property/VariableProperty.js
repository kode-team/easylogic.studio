import BaseProperty from "./BaseProperty";
import {
  LOAD, CLICK, DEBOUNCE
} from "../../../util/Event";

import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";

export default class VariableProperty extends BaseProperty {

  getTitle() {
    return 'Variables';
  }

  getClassName() {
    return 'item'
  }

  getBody() {
    return `<div class='property-item full var-property' ref='$body'></div>`;
  }

  getTools() {
    return `<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$varEditor.trigger('add');
  }    

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current.variable || '';

    return `<VarEditor ref='$varEditor' value='${value}' hide-label="true" onchange='changeVarEditor' />`
  }

  [EVENT('changeVarEditor')] (variable) {
    var current = editor.selection.current; 

    if (current) {
      current.reset({ variable })
      this.emit('refreshElement');
    }
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot()
  }
}
