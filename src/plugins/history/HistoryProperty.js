import { LOAD, DOMDIFF, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './HistoryProperty.scss';

export default class HistoryProperty extends BaseProperty {

  afterRender() {
    this.show();
  }

  getTitle() {
    return 'History';
  }

  getBody() {
    return /*html*/`
      <div class="elf--history-list-view" ref='$body'></div>
    `;
  }

  [LOAD('$body') + DOMDIFF] () {
    return this.$editor.history.map((it, index) => {
      if (it === '-') {
        return /*html*/`<div class='divider'>-</div>`
      }  
      return /*html*/`
        <div class='history-item'>
          <span>${index === (this.$editor.history.currentIndex) ? icon.arrowRight : ''}</span>
          <span>${it.message}</span>
        </div>
      `
    })
  }

  [SUBSCRIBE('refreshHistory')] () {
    this.refresh();
  }
}