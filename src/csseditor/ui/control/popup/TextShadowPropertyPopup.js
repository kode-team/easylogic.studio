import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_EDITOR, CHANGE_SELECTION } from "../../../types/event";
import { LOAD, POINTERSTART, MOVE, INPUT } from "../../../../util/Event";
import { html } from "../../../../util/functions/func";

export default class TextShadowPropertyPopup extends UIElement {
  initState() {
    return {
      offsetX: Length.px(0),
      offsetY: Length.px(0),
      blurRadius: Length.px(0)
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit(this.changeEvent, opt);
  }

  template() {
    return `<div class='popup text-shadow-property-popup' ref='$popup'></div>`;
  }

  [LOAD("$popup")]() {
    return html`
      <div class="box">
        <div class="offset-x">
          <label>Offset X</label>
          <div class="input">
            <input
              type="number"
              ref="$offsetX"
              data-type="offsetX"
              value="${this.state.offsetX.value.toString()}"
            />
            <select ref="$offsetXUnit">
              <option value="px">px</option>
              <option value="em">em</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>
        <div class="offset-y">
          <label>Offset Y</label>
          <div class="input">
            <input
              type="number"
              ref="$offsetY"
              data-type="offsetY"
              value="${this.state.offsetY.value.toString()}"
            />
            <select ref="$offsetYUnit">
              <option value="px">px</option>
              <option value="em">em</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>
        <div class="blur-radius">
          <label>Blur</label>
          <div class="input">
            <input
              type="range"
              ref="$blurRadiusRange"
              data-type="blurRadius"
              value="${this.state.blurRadius.value.toString()}"
            />
            <input
              type="number"
              ref="$blurRadiusNumber"
              data-type="blurRadius"
              value="${this.state.blurRadius.value.toString()}"
            />
            <select ref="$blurRadiusUnit">
              <option value="px">px</option>
              <option value="em">em</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>
        <div class="drag-board" ref="$dragBoard">
          <div
            class="pointer"
            ref="$pointer"
            style="left: ${this.state.offsetX.toString()};top: ${this.state.offsetY.toString()}"
          ></div>
        </div>
      </div>
    `;
  }

  [INPUT('$popup input[data-type="offsetX"]')](e) {
    this.updateData({
      offsetX: new Length(
        +e.$delegateTarget.value,
        this.getRef("$offsetXUnit").value
      )
    });
    this.refreshPointer();
  }

  [INPUT('$popup input[data-type="offsetY"]')](e) {
    this.updateData({
      offsetY: new Length(
        +e.$delegateTarget.value,
        this.getRef("$offsetYUnit").value
      )
    });

    this.refreshPointer();
  }

  [INPUT('$popup input[data-type="blurRadius"]')](e) {
    var type = e.$delegateTarget.attr("type");
    if (type === "range") {
      this.getRef("$blurRadiusNumber").val(e.$delegateTarget.value);
    } else {
      this.getRef("$blurRadiusRange").val(e.$delegateTarget.value);
    }
    this.updateData({
      blurRadius: new Length(
        +e.$delegateTarget.value,
        this.getRef("$blurRadiusUnit").value
      )
    });
  }

  [POINTERSTART("$popup .drag-board") + MOVE("movePointer")](e) {
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;

    var rect = this.getRef("$dragBoard").rect();
    this.boardWidth = rect.width;
    this.boardHeight = rect.height;
  }

  refreshPointer() {
    this.getRef("$pointer").css({
      left: this.state.offsetX,
      top: this.state.offsetY
    });
  }

  movePointer(dx, dy) {
    var realX = this.offsetX + dx;
    var realY = this.offsetY + dy;

    var halfWidth = this.boardWidth / 2;
    var halfHeight = this.boardHeight / 2;

    var x = realX - halfWidth;
    var y = realY - halfHeight;

    if (x < -halfWidth) {
      x = -halfWidth;
    } else if (x > halfWidth) {
      x = halfWidth;
    }

    if (y < -halfHeight) {
      y = -halfHeight;
    } else if (y > halfHeight) {
      y = halfHeight;
    }

    x = Math.floor(x);
    y = Math.floor(y);

    this.getRef("$offsetX").val(x);
    this.getRef("$offsetY").val(y);

    // 다른 곳의 숫자르 바로 업데이트 할 수 있어야 한다.
    this.updateData({
      offsetX: Length.px(x),
      offsetY: Length.px(y)
    });

    this.refreshPointer();
  }

  [EVENT("showTextShadowPropertyPopup")](data) {

    this.changeEvent = data.changeEvent || "changeTextShadowPropertyPopup"

    this.setState(data);
    this.refresh();

    this.$el
      .css({
        top: Length.px(460),
        right: Length.px(10),
        bottom: Length.auto
      })
      .show("inline-block");

    // this.emit("hidePropertyPopup");
  }

  [EVENT(
    "hideTextShadowPropertyPopup",
    "hidePropertyPopup",
    CHANGE_EDITOR,
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}
