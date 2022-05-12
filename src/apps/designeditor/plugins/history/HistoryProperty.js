import { LOAD, DOMDIFF, SUBSCRIBE } from "sapa";

import "./HistoryProperty.scss";

import icon from "elf/editor/icon/icon";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class HistoryProperty extends BaseProperty {
  afterRender() {
    this.show();
  }

  getTitle() {
    return "History";
  }

  getBody() {
    return /*html*/ `
      <div class="elf--history-list-view" ref='$body'></div>
    `;
  }

  [LOAD("$body") + DOMDIFF]() {
    return this.$editor.context.history.map((it, index) => {
      if (it === "-") {
        return /*html*/ `<div class='divider'>-</div>`;
      }
      return /*html*/ `
        <div class='history-item'>
          <span>${
            index === this.$editor.context.history.currentIndex
              ? icon.arrowRight
              : ""
          }</span>
          <span>${it.message}</span>
        </div>
      `;
    });
  }

  [SUBSCRIBE("refreshHistoryList")]() {
    this.refresh();
  }
}
