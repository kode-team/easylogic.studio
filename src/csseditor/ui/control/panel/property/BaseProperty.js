import { CLICK } from "../../../../../util/Event";
import UIElement from "../../../../../util/UIElement";

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
                ? ''
                : `
            <div class='property-title' ref="$title">
                <label>${this.getTitle()}</label>
                <span class="tools">${this.getTools()}</span>
            </div>`
            }
            <div class='property-body'>${this.getBody()}</div>
            ${ this.getFooter() ? `<div class='property-footer'>${this.getFooter()}</div>` : ''}
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

  getFooter() {
    return ''; 
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
