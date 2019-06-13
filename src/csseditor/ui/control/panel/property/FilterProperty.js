import BaseProperty from "./BaseProperty";
import {
  LOAD,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import FilterEditor from "../property-editor/FilterEditor";

export default class FilterProperty extends BaseProperty {

  components () {
    return { FilterEditor } 
  }

  isHideHeader() {
    return true; 
  }

  getBody() {
    return `<div class='property-item full filter-property' ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current.filter;

    return `<FilterEditor ref='$1' value='${value}' title='Filter' onchange='changeFilterEditor' />`
  }

  [EVENT('changeFilterEditor')] (filter) {
    var current = editor.selection.current; 

    if (current) {
      current.reset({ filter })
      this.emit('refreshCanvas');
    }
  }
}
