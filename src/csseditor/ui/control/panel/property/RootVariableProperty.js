import BaseProperty from "./BaseProperty";
import {
  LOAD, CLICK,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";

export default class RootVariableProperty extends BaseProperty {

  getTitle() {
    return 'Root Variables';
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
    var current = editor.selection.currentProject || {} 
    var value = current.rootVariable || '';

    return `<VarEditor ref='$varEditor' value='${value}' hide-label="true" onchange='changeVarEditor' />`
  }

  refresh() {
    this.load();
  }

  [EVENT('changeVarEditor')] (rootVariable) {
    var current = editor.selection.currentProject; 

    if (current) {
      current.reset({ rootVariable })
      this.emit('refreshStyleView', current);
    }
  }
}
