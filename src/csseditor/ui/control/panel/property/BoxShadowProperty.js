import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, CLICK } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";


export default class BoxShadowProperty extends BaseProperty {

  getTitle () {
    return 'Box Shadows';
  }

  getBody() {
    return `
      <div class="property-item full box-shadow-item" ref="$shadowList"></div>
    `;
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

    editor.selection.reset({ 
      'box-shadow': boxshadow
    })

    this.emit("refreshSelectionStyleView");

  }
}
