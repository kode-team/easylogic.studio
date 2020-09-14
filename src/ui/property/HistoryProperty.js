import BaseProperty from "./BaseProperty";
import { EVENT } from "@core/UIElement";
import { LOAD, VDOM } from "@core/Event";

export default class HistoryProperty extends BaseProperty {

  afterRender() {
    this.show();
  }

  getTitle() {
    return 'History';
  }

  getBody() {
    return /*html*/`
      <div class="history-list-view" ref='$body'></div>
    `;
  }

  [LOAD('$body') + VDOM] () {
    return this.$editor.history.map((it, index) => {
      if (it === '-') {
        return /*html*/`<div class='divider'>-</div>`
      }  
      return /*html*/`
        <div class='history-item'>
          <span>${index === (this.$editor.history.currentIndex) ? '->' : ''}</span>
          <span>${it.message}</span>
        </div>
      `
    })
  }

  [EVENT('refreshHistory')] () {
    this.refresh();
  }
}
