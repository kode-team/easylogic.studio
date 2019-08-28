import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK
} from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";


export default class BackgroundImageProperty extends BaseProperty {

  
  getTitle() {
    return 'Fill'
  }

  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'background-image';
  }

  getBody() {
    return `
      <div class='property-item full background-image' ref='$property'></div>
    `;
  }


  getTools() {
    return `<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$backgroundImageEditor.trigger('add');
  }  

  [LOAD('$property')] () {
    var current = editor.selection.current || {}; 
    var value = current['background-image']

    return `<BackgroundImageEditor 
              ref='$backgroundImageEditor' 
              value='${value}' 
              hide-label="true"
              onchange='changeBackgroundImage' 
            />`
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }

  [EVENT('changeBackgroundImage') + DEBOUNCE(10)] (value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'background-image': value 
      })

      this.emit("refreshElement", current);
    }
  }
}
