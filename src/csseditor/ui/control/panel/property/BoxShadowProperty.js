import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";


export default class BoxShadowProperty extends BaseProperty {
  
  isHideHeader() {
    return true;
  }

  getBody() {
    return `
      <div class="property-item full box-shadow-item" ref="$shadowList"></div>
    `;
  }

  [LOAD("$shadowList")]() {
    var current = editor.selection.current || {};
    return `
      <BoxShadowEditor ref='$boxshadow' value="${current['box-shadow'] || ''}" title='Box Shadows' onChange="changeBoxShadow" />
    `
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    var current = editor.selection.current;
    if (current) {
      if (current.is('artboard')) {
        this.hide();
      } else {
        this.show();
        this.refresh();
      }
    } else {
      this.hide();
    }

  }  

  [EVENT("changeBoxShadow")](boxshadow) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'box-shadow': boxshadow
      })

      this.emit("refreshElement", current);
    }
  }
}
