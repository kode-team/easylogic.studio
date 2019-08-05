import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { CLICK, PREVENT, STOP } from "../../../util/Event";

import icon from "../icon/icon";
import NumberRangeEditor from "../property-editor/NumberRangeEditor";

export default class PageTools extends UIElement {

  components() {
    return {
      NumberRangeEditor
    }
  }

  template() {
    return /*html*/`     
      <div class='page-tools'>
        <button type='button' ref='$plus'>${icon.add}</button>
        <button type='button' ref='$minus'>${icon.remove2}</button>
        <div class='select'>
          <NumberRangeEditor ref='$scale' min='10' max='240' step="1" key="scale" value="${editor.scale*100}" onchange="changeRangeEditor" />
        </div>
        <label>%</label>
      </div>

    `;
  }  

  [EVENT('changeScaleValue')] (scale) {

    this.children.$scale.setValue(editor.scale * 100);
    this.emit('update.scale', scale);
  }

  [EVENT('changeRangeEditor')] (key, scale) {
    this.trigger('changeScaleValue', scale/100);
  }

  [CLICK('$plus') + PREVENT + STOP] () {

    this.trigger('changeScaleValue', editor.scale * 1.1);
  }

  [CLICK('$minus') + PREVENT + STOP] () {
    this.trigger('changeScaleValue', editor.scale * 0.9);    
  }

}
