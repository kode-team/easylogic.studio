import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { CLICK, PREVENT, STOP, DEBOUNCE } from "../../../util/Event";

import icon from "../icon/icon";
import { round } from "../../../util/functions/math";
import NumberInputEditor from "../property-editor/NumberInputEditor";

export default class PageTools extends UIElement {

  components() {
    return {
      NumberInputEditor
    }
  }

  template() {
    return /*html*/`     
      <div class='page-tools'>
        <button type='button' ref='$minus'>${icon.remove2}</button>
        <div class='select'>
          <NumberInputEditor ref='$scale' min='10' max='240' step="1" key="scale" value="${editor.scale*100}" onchange="changeRangeEditor" />
        </div>
        <label>%</label>
        <button type='button' ref='$plus'>${icon.add}</button>        
      </div>

    `;
  }  

  [EVENT('changeScaleValue')] (scale) {

    scale = round(scale * 100, 100)

    this.children.$scale.setValue(scale);
    this.emit('update.scale', scale/100);
  }

  [EVENT('changeRangeEditor') + DEBOUNCE(1000)] (key, scale) {
    this.trigger('changeScaleValue', Math.floor(scale/100));
  }

  [CLICK('$plus') + PREVENT + STOP] () {

    this.trigger('changeScaleValue', editor.scale + 0.1);
  }

  [CLICK('$minus') + PREVENT + STOP] () {
    this.trigger('changeScaleValue', editor.scale - 0.1);    
  }

}
