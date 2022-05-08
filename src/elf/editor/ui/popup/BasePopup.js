import { POINTERSTART, CLICK, SUBSCRIBE } from "sapa";

import "./BasePopup.scss";

import { iconUse } from "elf/editor/icon/icon";
import { END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class BasePopup extends EditorElement {
  template() {
    return /*html*/ `
        <div class='elf--popup ${this.getClassName()}'>
            <div class='popup-title' ref="$title">
                <label>${this.getTitle()}</label>
                <span class="tools">
                  ${this.getTools()}
                  <button type='button' class='close' ref='$close'>${iconUse(
                    "close"
                  )}</button>
                </span>
            </div>
            <div class='popup-body'>${this.getBody()}</div>
            <!--<div class='popup-resizer' ref='$resizer'></div> -->
        </div>
        `;
  }

  getClassName() {
    return "";
  }
  getTitle() {
    return "";
  }
  getTools() {
    return "";
  }
  getBody() {
    return "";
  }

  onClose() {}

  [CLICK("$close")]() {
    this.$el.hide();

    this.onClose();
  }

  setTitle(title) {
    this.refs.$title.$("label").text(title);
  }

  [POINTERSTART("$title") + MOVE("movePopupTitle") + END("endPopupTitle")]() {
    this.x = Length.parse(this.$el.css("left"));
    this.y = Length.parse(this.$el.css("top"));
  }

  movePopupTitle(dx, dy) {
    var left = Length.px(this.x.value + dx);
    var top = Length.px(this.y.value + dy);

    this.$el.css({ left, top, right: "auto", bottom: "auto" });
  }

  show(width = 200) {
    var popupPadding = 28;
    var rightPosition = 320;

    var top = this.$el.css("top");
    var left = this.$el.css("left");

    var realTop = top !== "auto" ? Length.parse(top) : 110;
    var realLeft =
      left !== "auto"
        ? Length.parse(left)
        : document.body.clientWidth - rightPosition - popupPadding - width;

    this.$el
      .css({
        top: Length.px(realTop),
        left: Length.px(realLeft),
        "z-index": this.$editor.zIndex,
      })
      .show("inline-block");
  }

  makeRect(width, height, rect) {
    const elements = this.$config.get("editor.layout.elements");
    const bodyRect = elements.$bodyPanel.rect();

    let left = bodyRect.left + bodyRect.width - width - 10;
    let top =
      rect.top + height > bodyRect.top + bodyRect.height
        ? bodyRect.top + bodyRect.height - height - 10
        : rect.top;

    if (top < 10) {
      top = 10;
    }

    return {
      top: top,
      left:
        left < rect.left && rect.left <= left + width
          ? left - (left + width - rect.left) - 10
          : left,
      width: width,
      height: height,
    };
  }

  showByRect(rect) {
    this.$el
      .css({
        top: Length.px(rect.top),
        left: Length.px(rect.left),
        width: Length.px(rect.width),
        height: Length.px(rect.height),
        "z-index": this.$editor.zIndex,
      })
      .show("inline-block");
  }

  hide() {
    this.$el.hide();
  }

  [SUBSCRIBE("hidePropertyPopup")]() {
    this.hide();
  }

  [POINTERSTART("$resizer") + MOVE("moveResizer")]() {
    this.width = Length.parse(this.$el.css("width"));
    this.height = Length.parse(this.$el.css("height"));
  }

  moveResizer(dx, dy) {
    this.$el.css({
      width: Math.min(this.width + dx, 1000),
      height: Math.min(this.height + dy, 700),
    });
  }
}
