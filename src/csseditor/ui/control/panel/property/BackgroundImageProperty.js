import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE
} from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION
} from "../../../../types/event";

export default class BackgroundImageProperty extends BaseProperty {

  isHideHeader() {
    return true; 
  }
  getBody() {
    return `
      <div class='property-item full background-image' ref='$property'></div>
    `;
  }

  [LOAD('$property')] () {
    var current = editor.selection.current || {}; 
    var value = current['background-image']

    return `<BackgroundImageEditor 
              ref='$backgroundImageEditor' 
              value='${value}' 
              title='Background Images'
              onchange='changeBackgroundImage' 
            />`
  }

  [EVENT(CHANGE_SELECTION)]() {
    this.refresh();
  }

  [EVENT('changeBackgroundImage') + DEBOUNCE(10)] (value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'background-image': value 
      })

      this.emit('refreshCanvas')
    }
  }
}
