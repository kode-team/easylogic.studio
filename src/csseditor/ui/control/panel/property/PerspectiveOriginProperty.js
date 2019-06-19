import BaseProperty from "./BaseProperty";
import { LOAD, CLICK } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { CHANGE_ARTBOARD, CHANGE_SELECTION } from "../../../../types/event";
import icon from "../../../icon/icon";


export default class PerspectiveOriginProperty extends BaseProperty {

  getTitle() {
    return "Perspective Origin";  
  }


  getTools() {
    return `
        <button type="button" class="remove" ref='$remove'>${icon.close}</button>
    `
  }

  [CLICK('$remove')] () {
    this.trigger('changePerspectiveOrigin', '');
  }  

  getBody() {
    return html`
      <div class="property-item full perspective-origin-item" ref='$body'></div>
    `;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {}; 
    var value = current['perspective-origin'] || ''

    return `<PerspectiveOriginEditor 
              ref='$1' 
              value='${value}' 
              onchange='changePerspectiveOrigin' 
            />`
  }


  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  [EVENT('changePerspectiveOrigin')] (value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'perspective-origin': value 
      })

      this.emit('refreshCanvas')
    }
  }

}
