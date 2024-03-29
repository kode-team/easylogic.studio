import { Dom, TRANSITIONEND, CLICK, SUBSCRIBE } from "sapa";

import { SHOW_NOTIFY } from "../../types/event";
import { EditorElement } from "../common/EditorElement";
import "./NotificationView.scss";

import { iconUse } from "elf/editor/icon/icon";

export default class NotificationView extends EditorElement {
  template() {
    return /*html*/ `
            <div class='elf--notification-view'>
            </div>
        `;
  }

  [TRANSITIONEND("$el")](e) {
    Dom.create(e.target).remove();
  }

  [CLICK("$el .item > .icon")](e) {
    e.$dt.parent().remove();
  }

  getMessageTemplate(type, title, description, duration = 1000) {
    return /*html*/ `
        <div class='item ${type}' style='transition-duration: ${duration}ms;'>
            <div class='title'>${title}</div> 
            <div class='description'>${description}</div>
            <span class='icon'>${iconUse("close")}</span>
        </div>
    `;
  }

  [SUBSCRIBE(SHOW_NOTIFY)](type, title, description, duration = 1000) {
    const $dom = Dom.createByHTML(
      this.getMessageTemplate(type, title, description, 1000)
    );

    this.$el.prepend($dom);

    window.setTimeout(
      ($dom) => {
        $dom.css("opacity", 0);
      },
      duration,
      $dom
    );
  }
}
