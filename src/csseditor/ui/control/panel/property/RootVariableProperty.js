import BaseProperty from "./BaseProperty";
import {
  LOAD,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";

export default class RootVariableProperty extends BaseProperty {
  isHideHeader() {
    return true;
  }

  getBody() {
    return `<div class='property-item full var-property' ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.currentProject || {} 
    var value = current.rootVariable || '';

    return `<VarEditor ref='$1' value='${value}' title='Root Variables' onchange='changeVarEditor' />`
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
