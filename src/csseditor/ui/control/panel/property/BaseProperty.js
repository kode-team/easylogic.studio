import { CLICK } from "../../../../../util/Event";
import UIElement from "../../../../../util/UIElement";
// import items from "../items/index";
import Dom from "../../../../../util/Dom";
import { EMPTY_STRING } from "../../../../../util/css/types";

export default class BaseProperty extends UIElement {
  onToggleShow() {}

  template() {
    return `
        <div class='property ${this.getClassName()} show'>
            ${
              this.isHideHeader()
                ? EMPTY_STRING
                : `
            <div class='property-title' ref="$title">
                <label>${this.getTitle()}</label>
                <span class="tools">${this.getTools()}</span>
            </div>`
            }
            <div class='property-body'>${this.getBody()}</div>
        </div>
        `;
  }

  isHideHeader() {
    return false;
  }
  getClassName() {
    return EMPTY_STRING;
  }
  getTitle() {
    return EMPTY_STRING;
  }
  getTools() {
    return EMPTY_STRING;
  }
  getBody() {
    return EMPTY_STRING;
  }

  // [CLICK("$title")](e) {
  //   var $dom = new Dom(e.target);

  //   if ($dom.hasClass("property-title")) {
  //     this.$el.toggleClass("show");
  //     this.onToggleShow();
  //   }
  // }

  isPropertyShow() {
    return this.$el.hasClass("show");
  }

  toggle(isShow) {
    this.$el.toggle(isShow);
  }

  hide() {
    this.$el.hide();
  }

  show() {
    this.$el.show();
  }

  // components () {
  //     return items
  // }
}
