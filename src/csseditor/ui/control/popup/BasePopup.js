
import { POINTERSTART, MOVE, END, CLICK } from "../../../../util/Event";
import { Length } from "../../../../editor/unit/Length";
import UIElement, { EVENT } from "../../../../util/UIElement";
import { EMPTY_STRING } from "../../../../util/css/types";
import icon from "../../icon/icon";
import { CHANGE_SELECTION } from "../../../types/event";
import { editor } from "../../../../editor/editor";


export default class BasePopup extends UIElement {

  template() {
    return `
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
        'z-index': editor.zIndex
      })
      .show("inline-block");

    // 이걸 삭제 하는 이유는 각각의 컴포넌트가 나 이외의 상태를 제어하게 되면 
    // 예상치 못한 상황에 대처 할 수가 없다. 
    // 컴포넌트는 최대한 간략하게 만들자. 
    // this.emit("hidePropertyPopup");
  }

  hide () {
    this.$el.hide();
  }

  [EVENT( "hidePropertyPopup", CHANGE_SELECTION)]() {
    this.hide();
  }

}
