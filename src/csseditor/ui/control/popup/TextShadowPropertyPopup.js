import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_EDITOR, CHANGE_SELECTION } from "../../../types/event";
import { LOAD, POINTERSTART, MOVE, INPUT } from "../../../../util/Event";
import { html } from "../../../../util/functions/func";
import RangeEditor from "../shape/property-editor/RangeEditor";



export default class TextShadowPropertyPopup extends UIElement {

  components() {
    return {
      RangeEditor
    }
  }
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
      <div class="drag-board" ref="$dragBoard">
        <div
          class="pointer"
          ref="$pointer"
          style="left: ${this.state.offsetX.toString()};top: ${this.state.offsetY.toString()}"
        ></div>
      </div>
      <div>
        <label>Offset X</label>
        <RangeEditor ref='$offsetX' calc='false' key='offsetX' min="-100" max='100' value='${this.state.offsetX.toString()}' onchange='changeShadow' />
      </div>
      <div>
        <label>Offset Y</label>      
        <RangeEditor ref='$offsetY' calc='false' key='offsetY' min="-100" max='100' value='${this.state.offsetY.toString()}' onchange='changeShadow' />
      </div>
      <div>
        <label>Blur Radius</label>
        <RangeEditor ref='$blurRadius' calc='false' key='blurRadius' value='${this.state.blurRadius.toString()}' onchange='changeShadow' />
      </div>
    `;
  }

  [EVENT('changeShadow')] (key, value) {
    this.updateData({
      [key]: value
    });
    this.refreshPointer();
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

    // 다른 곳의 숫자르 바로 업데이트 할 수 있어야 한다.
    this.updateData({
      offsetX: Length.px(x),
      offsetY: Length.px(y)
    });

    this.children.$offsetX.setValue(this.state.offsetX);
    this.children.$offsetY.setValue(this.state.offsetY);

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

    this.emit("hidePropertyPopup");
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
