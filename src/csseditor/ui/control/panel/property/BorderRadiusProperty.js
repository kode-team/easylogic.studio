import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";


export default class BorderRadiusProperty extends BaseProperty {

  getTitle() {
    return "Border Radius";  
  }

  getBody() {
    return `<div class="property-item full border-radius-item" ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = editor.selection.current || {}; 
    var value = current['border-radius']

    return `
      <BorderRadiusEditor 
              ref='$1' 
              value='${value}' 
              onchange='changeBorderRadius' 
            />
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

  [EVENT('changeBorderRadius')] (value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'border-radius': value 
      })

      this.emit("refreshElement", current);
    }
  }

}
