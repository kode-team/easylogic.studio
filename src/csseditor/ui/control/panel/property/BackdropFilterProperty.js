import BaseProperty from "./BaseProperty";
import {
  LOAD,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";

export default class BackdropFilterProperty extends BaseProperty {
  isHideHeader() {
    return true; 
  }

  getBody() {
    return `<div class='property-item full filter-property' ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current['backdrop-filter'];

    return `<FilterEditor ref='$1' value='${value}' title='Backdrop Filter' onchange='changeFilterEditor' />`
  }

  [EVENT('changeFilterEditor')] (filter) {

    editor.selection.reset({ 
      'backdrop-filter' : filter 
    })

    this.emit("refreshSelectionStyleView");

  }
}
