import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, CLICK } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";

import icon from "../../../icon/icon";

export default class PerspectiveProperty extends BaseProperty {

  getTitle() {
    return "Perspective";
  }

  getBody() {
    return `<div ref='$perspective'></div>`;
  }  

  [LOAD("$perspective")]() {
    var current = editor.selection.current || {};

    var perspective = current['perspective'] || ''
    return `<RangeEditor ref='$1' key='perspective' removable="true" value="${perspective}" onchange="changePerspective" />`;
  }

  [EVENT('changePerspective')] (key, value) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        [key]: value
      })

      this.emit('refreshElement', current);
    }
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
  }
}
