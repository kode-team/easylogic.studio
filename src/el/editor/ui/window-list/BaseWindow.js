
import { CLICK } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "../common/EditorElement";

export default class BaseWindow extends EditorElement {

  template() {
    return `
      <div class='window-background'>
        <div class='window ${this.getClassName()}'>
            <div class='window-title' ref="$title">
                <label>${this.getTitle()}</label>
                <span class="tools">
                  ${this.getTools()}
                  <button type='button' class='close' ref='$close'>${icon.close}</button>
                </span>
            </div>
            <div class='window-body'>${this.getBody()}</div>
        </div>
      </div>
        `;
  }

  getClassName() {
    return '';
  }
  getTitle() {
    return '';
  }
  getTools() {
    return '';
  }
  getBody() {
    return '';
  }

  [CLICK('$close')] () {
    this.$el.hide();
  }


  show (width = 200) {
    this.$el.show("block");
  }

  hide () {
    this.$el.hide();
  }
}
