import BaseProperty from "./BaseProperty";
import { LOAD, CLICK } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION } from "../../../../types/event";
import icon from "../../../icon/icon";


export default class TransformOriginProperty extends BaseProperty {

  getTitle() {
    return "Transform Origin";  
  }

  getTools() {
    return `
        <button type="button" class="remove" ref='$remove'>${icon.close}</button>
    `
  }

  [CLICK('$remove')] () {
    this.trigger('changeTransformOrigin', '');
  }

  getBody() {
    return html`
      <div class="property-item full transform-origin-item" ref='$body'></div>
    `;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {}; 
    var value = current['transform-origin'] || ''

    return `<TransformOriginEditor 
              ref='$1' 
              value='${value}' 
              onchange='changeTransformOrigin' 
            />`
  }


  [EVENT(CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  [EVENT('changeTransformOrigin')] (value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'transform-origin': value 
      })

      this.emit('refreshCanvas')
    }
  }

}
