import { CLICK, PREVENT, STOP } from "el/base/Event";

import { isFunction } from "el/base/functions/func";
import { EditorElement } from "../common/EditorElement";

import './BaseProperty.scss';

export default class BaseProperty extends EditorElement {

  onToggleShow() {}

  template() {
    return /*html*/`
        <div class='elf--property ${this.isHideHeader() ? 'no-title' : ''} ${this.getClassName()} ${this.isFirstShow() ?  'show' : '' }'>
            ${this.isHideHeader() ? ''
            : /*html*/`
            <div class='property-title ${this.getTitleClassName()}' ref="$title">
                <label class="${this.hasKeyframe() ? 'has-keyframe': ''}"> 
                  ${
                    this.hasKeyframe() ? 
                    /*html*/`
                      <span class='add-timeline-property' data-property='${this.getKeyframeProperty()}'></span>
                    `

                    : ''
                  } 
                  <span ref='$propertyTitle'>${this.getTitle()}</span>
                </label>
                <span class="tools">${this.getTools()}</span>
            </div>`
            }
            <div class='property-body ${this.getBodyClassName()}'>${this.getBody()}</div>
            ${ this.getFooter() ? `<div class='property-footer'>${this.getFooter()}</div>` : ''}
        </div>
        `;
  }

  setTitle (title) {
    this.refs.$propertyTitle.text(title);
  }

  hasKeyframe () {
    return false;
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

  getTitleClassName() {
    return '';
  }

  getBodyClassName() {
    return '';
  }

  getKeyframeProperty() {
    return "";
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

  // [CLICK("$title label")](e) {
  //   var $dom = e.$dt.parent();

  //   var isAddProperty = Dom.create(e.target).hasClass('add-timeline-property')

  //   if ($dom.hasClass("property-title") && isAddProperty === false) {
  //     this.$el.toggleClass("show");
  //     this.onToggleShow();
  //   }
  // }

  // [CLICK("$title .icon")](e) {
  //   var $dom = e.$dt.parent();

  //   if ($dom.hasClass("property-title")) {
  //     this.$el.toggleClass("show");
  //     this.onToggleShow();
  //   }
  // }

  [CLICK('$el .property-body .add-timeline-property') + PREVENT + STOP] (e) {
    var property = e.$dt.attr('data-property')
    var editor = e.$dt.attr('data-editor')

    this.emit('addTimelineCurrentProperty', { property, editor })
  }

  [CLICK('$el .property-title .add-timeline-property') + PREVENT + STOP] (e) {
    var property = e.$dt.attr('data-property')
    var editor = e.$dt.attr('data-editor')

    this.emit('addTimelineCurrentProperty', { property, editor })
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

  onShowTitle(isShow) {

  }

  refreshShowIsNot (type = '', isRefresh = true ) {

    var current = this.$selection.current;
    if (current) {
      if (type.includes(current.itemType)) {
        this.hide();
      } else {
        this.show();

        if (isRefresh) this.refresh();
      }
    } else {
      // this.show();
    }
  }

  refreshShow (type, isRefresh = true) {

    var current = this.$selection.current;
    if (current) {

      if  (isFunction(type) && type()) {
        this.show();
        if (isRefresh) this.refresh();
      } else {
        if (!isFunction(type) && type.includes(current.itemType)) {
          this.show();
          if (isRefresh) this.refresh();
        } else {
          this.hide();
        }
      } 
    }  else {
      this.hide();
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
