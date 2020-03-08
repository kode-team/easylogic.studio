import { CLICK, PREVENT, STOP } from "../../../util/Event";
import UIElement from "../../../util/UIElement";

import propertyEditor from "../property-editor";
import Dom from "../../../util/Dom";
import { isFunction } from "../../../util/functions/func";
import icon from "../icon/icon";


export default class BaseProperty extends UIElement {

  components() {
    return propertyEditor
  }

  onToggleShow() {}

  template() {
    return /*html*/`
        <div class='property ${this.isHideHeader() ? 'no-title' : ''} ${this.getClassName()} ${this.isFirstShow() ?  'show' : '' }'>
            ${this.isHideHeader() ? ''
            : /*html*/`
            <div class='property-title ${this.getTitleClassName()}' ref="$title">
                <label> 
                  ${
                    this.hasKeyframe() ? 
                    /*html*/`<span class='add-timeline-property' data-property='${this.getKeyframeProperty()}'></span>` 
                    : ''
                  } 
                  <span ref='$propertyTitle'>${this.getTitle()}</span>
                  <span class='icon'>${icon.chevron_right}</span>
                </label>
                <span class="tools">${this.getTools()}</span>
            </div>`
            }
            <div class='property-body'>${this.getBody()}</div>
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
    var $dom = e.$dt.parent();

    var isAddProperty = Dom.create(e.target).hasClass('add-timeline-property')

    if ($dom.hasClass("property-title") && isAddProperty === false) {
      this.$el.toggleClass("show");
      this.onToggleShow();
    }
  }

  [CLICK("$title .icon")](e) {
    var $dom = e.$dt.parent();

    if ($dom.hasClass("property-title")) {
      this.$el.toggleClass("show");
      this.onToggleShow();
    }
  }

  [CLICK('$el .property-body .add-timeline-property') + PREVENT + STOP] (e) {
    var property = e.$dt.attr('data-property')
    var editor = e.$dt.attr('data-editor')

    this.emit('add.timeline.current.property', { property, editor })
  }

  [CLICK('$el .property-title .add-timeline-property') + PREVENT + STOP] (e) {
    var property = e.$dt.attr('data-property')
    var editor = e.$dt.attr('data-editor')

    this.emit('add.timeline.current.property', { property, editor })
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
