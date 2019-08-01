import BaseProperty from "./BaseProperty";
import { INPUT, BIND, DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";

import { EVENT } from "../../../util/UIElement";



export default class ContentProperty extends BaseProperty {
  getTitle() {
    return "Content";
  }


  [EVENT('refreshSelection', 'refreshContent') + DEBOUNCE(100)]() {

    this.refreshShowIsNot('artboard');

  }  

  getBody() {
    return `
      <div class="property-item content-item">
        <textarea ref="$contentItem"></textarea>
      </div>
    `;
  }

  [BIND("$contentItem")]() {
    var current = editor.selection.current;

    if (!current) return '';

    return {
      value: current.content || ""
    };
  }

  [INPUT("$contentItem")](e) {
    this.setContent();
  }

  setContent() {
    var current = editor.selection.current;
    if (current) {
      var data = {
        content: this.refs.$contentItem.value
      }
      current.reset(data);
      this.emit('refreshCanvas', {id: current.id, content: data.content, itemType: current.itemType });
    }
  }
}
