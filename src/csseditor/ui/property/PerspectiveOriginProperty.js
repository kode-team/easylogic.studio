import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";

import icon from "../icon/icon";


export default class PerspectiveOriginProperty extends BaseProperty {

  getTitle() {
    return "Perspective Origin";  
  }


  getTools() {
    return `
        <button type="button" class="remove" ref='$remove'>${icon.remove}</button>
    `
  }

  [CLICK('$remove')] () {
    this.trigger('changePerspectiveOrigin', '');
  }  

  getBody() {
    return `
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


  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }

  [EVENT('changePerspectiveOrigin')] (value) {

    editor.selection.reset({ 
      'perspective-origin': value 
    })

    this.emit("refreshSelectionStyleView");
  }

}
