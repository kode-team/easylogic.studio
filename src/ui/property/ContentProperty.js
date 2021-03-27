import BaseProperty from "./BaseProperty";
import { INPUT, BIND, DEBOUNCE } from "@sapa/Event";

import { EVENT } from "@sapa/UIElement";
import { registElement } from "@sapa/registerElement";

export default class ContentProperty extends BaseProperty {
  getTitle() {
    return "Content";
  }


  [EVENT('refreshSelection', 'refreshContent') + DEBOUNCE(100)]() {

    this.refreshShow(['text'])

  }  

  getBody() {
    return /*html*/`
      <div class="property-item content-item">
        <textarea ref="$contentItem"></textarea>
      </div>
    `;
  }

  [BIND("$contentItem")]() {
    var current = this.$selection.current;

    if (!current) return '';

    return {
      value: current.content || ""
    };
  }

  [INPUT("$contentItem")](e) {
    this.setContent();
  }

  setContent() {
    var current = this.$selection.current;
    if (current) {
      var data = {
        content: this.refs.$contentItem.value
      }
      current.reset(data);
      this.emit('refreshSelectionStyleView', current);
    }
  }
}


registElement({ ContentProperty })