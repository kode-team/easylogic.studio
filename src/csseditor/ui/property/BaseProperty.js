import { CLICK } from "../../../util/Event";
import UIElement from "../../../util/UIElement";

import propertyEditor from "../property-editor";
import { editor } from "../../../editor/editor";


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

  [CLICK('$el .property-body .add-timeline-property')] (e) {
    var property = e.$delegateTarget.attr('data-property')

    this.emit('add.timeline.property', Object.keys(editor.selection.itemKeys), property, this.getPropertyValue(property))

  }

  getPropertyValue (property) {

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

  refreshShowIsNot (type, isRefresh = true ) {

    var current = editor.selection.current;
    if (current) {
      if (current.is(type)) {
        this.hide();
      } else {
        this.show();

        if (isRefresh) this.refresh();
      }
    } else {
      // this.hide();
    }
  }

  refreshShow (type, isRefresh = true) {

    var current = editor.selection.current;
    if (current) {
      if (current.is(type)) {
        this.show();
        if (isRefresh) this.refresh();
      } else {
        this.hide();
      }
    } else {
      // this.hide();
    } 
  }


  startInputEditing (input) {
    if (!input) return; 
    input.attr('contenteditable', true);

    input.css({
      'background-color': 'white',
      'outline': '1px auto black',
      'color': 'black',
    })

    input.focus();
  }

  endInputEditing (input, callback) {
    if (!input) return;     
    input.attr('contenteditable', false);
    input.css({
      'background-color': null,
      'outline': null,
      'color': null,
    })

    var index = input.attr('data-index');

    callback && callback (index, input.text().trim())

    input.blur();
  }
}
