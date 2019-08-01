import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { LOAD, POINTERSTART, MOVE } from "../../../util/Event";
import RangeEditor from "../property-editor/RangeEditor";
import BasePopup from "./BasePopup";
import EmbedColorPicker from "../property-editor/EmbedColorPicker";

export default class TextShadowPropertyPopup extends BasePopup {

  getTitle() {
    return 'Text Shadow Editor'
  }

  components() {
    return {
      EmbedColorPicker,
      RangeEditor
    }
  }
  initState() {
    return {
      color: 'rgba(0, 0, 0, 1)',  
      offsetX: Length.px(0),
      offsetY: Length.px(0),
      blurRadius: Length.px(0)
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit(this.changeEvent, opt);
  }

  getBody() {
    return `<div class='text-shadow-property-popup' ref='$popup'></div>`;
  }

  [LOAD("$popup")]() {
    return `
      <div class='box'>
        <EmbedColorPicker ref='$colorpicker' value='${this.state.color}' onchange='changeColor' />
      </div>
      <div class='box'>
        <div class="drag-board" ref="$dragBoard">
          <div
            class="pointer"
            ref="$pointer"
            style="left: ${this.state.offsetX};top: ${this.state.offsetY}"
          ></div>
        </div>
        <div>
          <label>Offset X</label>
          <RangeEditor ref='$offsetX' calc='false' key='offsetX' min="-100" max='100' value='${this.state.offsetX}' onchange='changeShadow' />
        </div>
        <div>
          <label>Offset Y</label>      
          <RangeEditor ref='$offsetY' calc='false' key='offsetY' min="-100" max='100' value='${this.state.offsetY}' onchange='changeShadow' />
        </div>
        <div>
          <label>Blur Radius</label>
          <RangeEditor ref='$blurRadius' calc='false' key='blurRadius' value='${this.state.blurRadius}' onchange='changeShadow' />
        </div>
      </div>
    `;
  }

  [EVENT('changeShadow')] (key, value) {
    this.updateData({
      [key]: value
    });

    if (key === 'offsetX' || key === 'offsetY') {
      this.refreshPointer();
    }

  }

  [EVENT('changeColor')] (value) {
    this.trigger('changeShadow', 'color', value);
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

    this.show(432);
  }

  [EVENT("hideTextShadowPropertyPopup")]() {
    this.hide()
  }
}
