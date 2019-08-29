import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { LOAD, CLICK, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";

export default class PerspectiveProperty extends BaseProperty {

  getTitle() {
    return "Perspective";
  }

  hasKeyframe() {
    return true; 
  }

  getKeyframeProperty () {
    return 'perspective'
  }

  getBody() {
    return `<div class='property-item' ref='$perspective'></div>`;
  }  

  [LOAD("$perspective")]() {
    var current = editor.selection.current || {};

    var perspective = current['perspective'] || ''
    return /*html*/`
        <RangeEditor ref='$1' key='perspective' removable="true" value="${perspective}" max="2000px" onchange="changePerspective" />
    `;
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
