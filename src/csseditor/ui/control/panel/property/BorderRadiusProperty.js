import BaseProperty from "./BaseProperty";
import { LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION } from "../../../../types/event";

export default class BorderRadiusProperty extends BaseProperty {

  getTitle() {
    return "Border Radius";  
  }

  getBody() {
    return html`
      <div class="property-item full border-radius-item" ref='$body'></div>
    `;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {}; 
    var value = current['border-radius']

    return `<BorderRadiusEditor 
              ref='$1' 
              value='${value}' 
              onchange='changeBorderRadius' 
            />`
  }


  [EVENT(CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  [EVENT('changeBorderRadius')] (value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'border-radius': value 
      })

      this.emit('refreshCanvas')
    }
  }

}
