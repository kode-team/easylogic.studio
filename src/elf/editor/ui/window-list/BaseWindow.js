import { CLICK } from "sapa";

import { EditorElement } from "../common/EditorElement";
import "./BaseWindow.scss";

import { iconUse } from "elf/editor/icon/icon";

export default class BaseWindow extends EditorElement {
  template() {
    return /*html*/ `
      <div class='elf--window-background'>
        <div class='window ${this.getClassName()}'>
            <div class='window-title' ref="$title">
                <label>${this.getTitle()}</label>
                <span class="tools">
                  ${this.getTools()}
                  <button type='button' class='close' ref='$close'>${iconUse(
                    "close"
                  )}</button>
                </span>
            </div>
            <div class='window-body'>${this.getBody()}</div>
        </div>
      </div>
        `;
  }

  getClassName() {
    return "";
  }
  getTitle() {
    return "";
  }
  getTools() {
    return "";
  }
  getBody() {
    return "";
  }

  [CLICK("$close")]() {
    this.$el.hide();
  }

  show() {
    this.$el.show("block");
  }

  hide() {
    this.$el.hide();
  }
}
