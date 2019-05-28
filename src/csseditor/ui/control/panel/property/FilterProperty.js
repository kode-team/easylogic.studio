import BaseProperty from "./BaseProperty";
import {
  LOAD,
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import FilterEditor from "../../shape/property-editor/FilterEditor";

export default class FilterProperty extends BaseProperty {

  components () {
    return { FilterEditor } 
  }

  getTitle() {
    return "Filter";
  }

  getBody() {
    return `<div class='property-item full filter-property' ref='$body'>
      ${this.loadTemplate('$body')}
    </div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {} 
    var value = current.filter;

    return `<FilterEditor ref='$1' value='${value}' onchange='changeFilterEditor' />`
  }

  refresh() {
    this.load();
  }

  [EVENT('changeFilterEditor')] (filter) {
    var current = editor.selection.current; 

    if (current) {
      current.reset({ filter })
      this.emit('refreshCanvas');
    }
  }
}
