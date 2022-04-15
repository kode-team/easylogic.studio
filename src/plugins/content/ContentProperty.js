
import { INPUT, BIND, DEBOUNCE, SUBSCRIBE } from "el/sapa/Event";

import {BaseProperty} from "el/editor/ui/property/BaseProperty";
import './ContentProperty.scss';
export default class ContentProperty extends BaseProperty {
  getTitle() {
    return "Content";
  }


  [SUBSCRIBE('refreshSelection', 'refreshContent') + DEBOUNCE(100)]() {

    this.refreshShow(['text'])

  }  

  getBody() {
    return /*html*/`
      <div class="property-item elf--content-item">
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