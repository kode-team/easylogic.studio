import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, CLICK } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_EDITOR,
  CHANGE_LAYER,
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import icon from "../../../icon/icon";

export default class PerspectiveProperty extends BaseProperty {

  getTitle() {
    return "Perspective";
  }

  getTools() {
    return `
        <button type="button" class="remove" ref='$remove'>${icon.close}</button>
    `
  }

  [CLICK('$remove')] () {
    this.trigger('changePerspective', 'perspective', '');
  }    

  getBody() {
    return `<div ref='$perspective'></div>`;
  }  

  [LOAD("$perspective")]() {
    var current = editor.selection.current || {};

    var perspective = current['perspective'] || ''
    return `<RangeEditor ref='$1' key='perspective' value="${perspective}" onchange="changePerspective" />`;
  }

  [EVENT('changePerspective')] (key, value) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        [key]: value
      })

      this.emit('refreshCanvas')
    }
  }

  [EVENT(CHANGE_EDITOR, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }
}
