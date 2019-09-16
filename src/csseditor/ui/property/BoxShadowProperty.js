import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, CLICK } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";


export default class BoxShadowProperty extends BaseProperty {

  getTitle () {
    return 'Box Shadows';
  }

  getBody() {
    return `
      <div class="full box-shadow-item" ref="$shadowList"></div>
    `;
  }

  hasKeyframe() {
    return true; 
  }

  getKeyframeProperty () {
    return 'box-shadow'
  }


  [LOAD("$shadowList")]() {
    var current = editor.selection.current || {};
    return `
      <BoxShadowEditor ref='$boxshadow' value="${current['box-shadow'] || ''}" hide-label="true" onChange="changeBoxShadow" />
    `
  }


  getTools() {
    return `<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$boxshadow.trigger('add');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShowIsNot('artboard')

  }  

  [EVENT("changeBoxShadow")](boxshadow) {

    editor.selection.reset({ 
      'box-shadow': boxshadow
    })

    this.emit("refreshSelectionStyleView");

  }
}
