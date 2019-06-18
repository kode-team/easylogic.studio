import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_EDITOR, CHANGE_SELECTION } from "../../../types/event";
import { LOAD, CLICK, POINTERSTART, MOVE, INPUT } from "../../../../util/Event";
import { html } from "../../../../util/functions/func";
import RangeEditor from "../panel/property-editor/RangeEditor";



export default class BoxShadowPropertyPopup extends UIElement {
  components() {
    return {
      RangeEditor
    }
  }
  initState() {
    return {
      inset: false,
      offsetX: Length.px(0),
      offsetY: Length.px(0),
      blurRadius: Length.px(0),
      spreadRadius: Length.px(0)
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit(this.changeEvent, opt);
  }

  template() {
    return `<div class='popup box-shadow-property-popup' ref='$popup'></div>`;
  }

  [LOAD("$popup")]() {
    return html`
      <div class="box">
        <div class="type">
          <label>Type</label>
          <div
            class="select"
            data-selected-value="${this.state.inset ? "inset" : "outset"}"
            ref="$type"
          >
            <button type="button" data-value="outset">Outset</button>
            <button type="button" data-value="inset">Inset</button>
          </div>
        </div>
        <div class="drag-board" ref="$dragBoard">
          <div
            class="pointer"
            ref="$pointer"
            style="left: ${this.state.offsetX.toString()};top: ${this.state.offsetY.toString()}"
          ></div>
        </div>        
        <div class="offset-x">
          <RangeEditor ref='$offsetX' label='X' key='offsetX' value="${this.state.offsetX.toString()}" onchange='changeRangeEditor' />
        </div>
        <div class="offset-y">
          <RangeEditor ref='$offsetY' label='Y' key='offsetY' value="${this.state.offsetY.toString()}" onchange='changeRangeEditor' />        
        </div>
        <div class="blur-radius">
          <RangeEditor ref='$blurRadius' label='Blur' key='blurRadius' value="${this.state.blurRadius.toString()}" onchange='changeRangeEditor' />        
        </div>
        <div class="spread-radius">
          <RangeEditor ref='$spreadRadius' label='Spread' key='spreadRadius' value="${this.state.spreadRadius.toString()}" onchange='changeRangeEditor' />        
        </div>

      </div>
    `;
  }


  [CLICK("$popup .select button")](e) {
    var type = e.$delegateTarget.attr("data-value");

    this.getRef("$type").attr("data-selected-value", type);

    this.updateData({
      inset: type === "inset"
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

    this.children.$offsetX.setValue(this.state.offsetX)
    this.children.$offsetY.setValue(this.state.offsetY)

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

  [EVENT('changeRangeEditor')] (key, value) {
    this.updateData({
      [key]: value
    })

    if (key === 'offsetX' || key === 'offsetY') {
      this.refreshPointer()
    }
  }

  [EVENT("showBoxShadowPropertyPopup")](data) {

    this.changeEvent = data.changeEvent || "changeBoxShadowPropertyPopup"

    this.setState(data);
    this.refresh();

    this.$el
      .css({
        top: Length.px(440),
        right: Length.px(320),
        bottom: Length.auto
      })
      .show("inline-block");

    this.emit("hidePropertyPopup");
  }

  [EVENT(
    "hideBoxShadowPropertyPopup",
    "hidePropertyPopup",
    CHANGE_EDITOR,
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}
