
import { POINTERSTART, CLICK, SUBSCRIBE } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import icon, { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "../common/EditorElement";
import { END, MOVE } from "el/editor/types/event";

import './BasePopup.scss';

export default class BasePopup extends EditorElement {

  template() {
    return /*html*/`
        <div class='elf--popup ${this.getClassName()}'>
            <div class='popup-title' ref="$title">
                <label>${this.getTitle()}</label>
                <span class="tools">
                  ${this.getTools()}
                  <button type='button' class='close' ref='$close'>${iconUse("close")}</button>
                </span>
            </div>
            <div class='popup-body'>${this.getBody()}</div>
            <!--<div class='popup-resizer' ref='$resizer'></div> -->
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

  [POINTERSTART('$title') + MOVE('movePopupTitle') + END('endPopupTitle')] () {
    this.x = Length.parse(this.$el.css('left'))
    this.y = Length.parse(this.$el.css('top'))

  }

  movePopupTitle (dx, dy) {
    var left = Length.px(this.x.value + dx)
    var top = Length.px(this.y.value + dy)

    this.$el.css({ left, top, right: 'auto', bottom: 'auto' })
  }

  show (width = 200) {

    var popupPadding = 28;
    var rightPosition = 320; 

    var top = this.$el.css('top')
    var left = this.$el.css('left')

    var realTop = top !== 'auto' ? Length.parse(top) : Length.px(110)
    var realLeft = left !== 'auto' ? Length.parse(left) : Length.px(document.body.clientWidth - rightPosition - popupPadding - width)

    this.$el
      .css({
        top: realTop,
        left: realLeft,
        'z-index': this.$editor.zIndex
      })
      .show("inline-block");
  }

  showByRect (rect) {
    this.$el
      .css({
        top: Length.px(rect.top),
        left: Length.px(rect.left),
        width: Length.px(rect.width),
        height: Length.px(rect.height),
        'z-index': this.$editor.zIndex
      })
      .show("inline-block");
  }

  hide () {
    this.$el.hide();
  }

  [SUBSCRIBE( "hidePropertyPopup")]() {
    this.hide();
  }

  [POINTERSTART('$resizer') + MOVE('moveResizer')] (e) {
    this.width = Length.parse(this.$el.css('width'));
    this.height = Length.parse(this.$el.css('height'));
  }

  moveResizer (dx, dy) {
    this.$el.css({
      width: Length.px(Math.min(this.width.value + dx, 1000)),
      height: Length.px(Math.min(this.height.value + dy, 700)),
    })
  }


}
