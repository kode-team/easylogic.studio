
import { POINTERSTART, MOVE, END, CLICK } from "@sapa/Event";
import { Length } from "@unit/Length";
import UIElement, { EVENT } from "@sapa/UIElement";
import icon from "@icon/icon";
import "../property-editor";



export default class BasePopup extends UIElement {

  template() {
    return /*html*/`
        <div class='popup ${this.getClassName()}'>
            <div class='popup-title' ref="$title">
                <label>${this.getTitle()}</label>
                <span class="tools">
                  ${this.getTools()}
                  <button type='button' class='close' ref='$close'>${icon.close}</button>
                </span>
            </div>
            <div class='popup-body'>${this.getBody()}</div>
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

  hide () {
    this.$el.hide();
  }

  [EVENT( "hidePropertyPopup")]() {
    this.hide();
  }

}
