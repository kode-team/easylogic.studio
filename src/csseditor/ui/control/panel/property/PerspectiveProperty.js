import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, CLICK, DEBOUNCE } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";

import icon from "../../../icon/icon";

export default class PerspectiveProperty extends BaseProperty {

  getTitle() {
    return "Perspective";
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return `<div class='property-item' ref='$perspective'></div>`;
  }  

  [LOAD("$perspective")]() {
    var current = editor.selection.current || {};

    var perspective = current['perspective'] || ''
    return `<RangeEditor ref='$1' key='perspective' label='Perspective' removable="true" value="${perspective}" onchange="changePerspective" />`;
  }

  [EVENT('changePerspective')] (key, value) {

    editor.selection.reset({ 
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }
}
