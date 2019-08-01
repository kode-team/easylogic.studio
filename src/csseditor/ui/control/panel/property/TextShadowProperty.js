import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, CLICK } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";


export default class TextShadowProperty extends BaseProperty {

  getTitle() {
    return 'Text Shadows'
  }

  getBody() {
    return `
      <div class="property-item full text-shadow-item" ref="$shadowList"></div>
    `;
  }


  getTools() {
    return `<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$textshadow.trigger('add');
  }  
  
  [LOAD("$shadowList")]() {
    var current = editor.selection.current || {};
    return `
      <TextShadowEditor ref='$textshadow' value="${current['text-shadow'] || ''}" hide-label="true" onChange="changeTextShadow" />
    `
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow('text');

  }  

  [EVENT("changeTextShadow")](textshadow) {

    editor.selection.reset({ 
      'text-shadow': textshadow
    })

    this.emit("refreshSelectionStyleView");
  }
}
