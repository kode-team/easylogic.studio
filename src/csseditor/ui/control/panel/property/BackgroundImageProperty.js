import BaseProperty from "./BaseProperty";
import {
  LOAD
} from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_RECT,
  CHANGE_LAYER,
  CHANGE_ARTBOARD,
  CHANGE_SELECTION
} from "../../../../types/event";
import BackgroundImageEditor from "../../shape/property-editor/BackgroundImageEditor";

export default class BackgroundImageProperty extends BaseProperty {

  components () {
    return {
      BackgroundImageEditor
    }
  }

  getTitle() {
    return "Background Images";
  }
  getBody() {
    return `
      <div class='property-item full background-image' ref='$property'>
        ${this.loadTemplate('$property')}
      </div>
    `;
  }

  [LOAD('$property')] () {
    var current = editor.selection.current || {}; 
    var value = current['background-image']

    return `<BackgroundImageEditor 
              ref='$backgroundImageEditor' 
              value='${value}' 
              onchange='changeBackgroundImage' 
            />`
  }

  [EVENT(CHANGE_RECT, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    this.load();
  }

  [EVENT('changeBackgroundImage')] (value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'background-image': value 
      })

      this.emit('refreshCanvas')
    }
  }
}
