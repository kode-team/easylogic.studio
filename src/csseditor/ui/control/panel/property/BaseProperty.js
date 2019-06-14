import { CLICK } from "../../../../../util/Event";
import UIElement from "../../../../../util/UIElement";
import { EMPTY_STRING } from "../../../../../util/css/types";
import propertyEditor from "../property-editor";


export default class BaseProperty extends UIElement {

  components() {
    return propertyEditor
  }

  onToggleShow() {}

  template() {
    return `
        <div class='property ${this.getClassName()} ${this.isFirstShow() ?  'show' : '' }'>
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

  isFirstShow () {
    return true
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

  [CLICK("$title label")](e) {
    var $dom = e.$delegateTarget.parent();

    if ($dom.hasClass("property-title")) {
      this.$el.toggleClass("show");
      this.onToggleShow();
    }
  }

  [CLICK("$title .icon")](e) {
    var $dom = e.$delegateTarget.parent();

    if ($dom.hasClass("property-title")) {
      this.$el.toggleClass("show");
      this.onToggleShow();
    }
  }

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
