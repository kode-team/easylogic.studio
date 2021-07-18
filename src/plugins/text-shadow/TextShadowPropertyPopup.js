
import { Length } from "el/editor/unit/Length";
import { LOAD, POINTERSTART, MOVE, SUBSCRIBE } from "el/base/Event";
import BasePopup from "el/editor/ui/popup/BasePopup";

import './TextShadowPropertyPopup.scss';

export default class TextShadowPropertyPopup extends BasePopup {

  getTitle() {
    return 'Text Shadow Editor'
  }

  initState() {
    return {
      color: 'rgba(0, 0, 0, 1)',  
      offsetX: Length.z(),
      offsetY: Length.z(),
      blurRadius: Length.z()
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.emit(this.changeEvent, opt, this.params);
  }

  getBody() {
    return /*html*/`<div class='elf--text-shadow-property-popup' ref='$popup'></div>`;
  }

  [LOAD("$popup")]() {
    return /*html*/`
      <div class='box'>
        <div class="drag-board" ref="$dragBoard">
          <div
            class="pointer"
            ref="$pointer"
            style="left: ${this.state.offsetX};top: ${this.state.offsetY}"
          ></div>
        </div>
        <div class='popup-item'>
          <object refClass="RangeEditor"  ref='$offsetX' label='Offset X' key='offsetX' min="-100" max='100' value='${this.state.offsetX}' onchange='changeShadow' />
        </div>
        <div class='popup-item'>
          <object refClass="RangeEditor"  ref='$offsetY' label="Offset Y" key='offsetY' min="-100" max='100' value='${this.state.offsetY}' onchange='changeShadow' />
        </div>
        <div class='popup-item'>
          <object refClass="RangeEditor"  ref='$blurRadius' label="Blur Radius" key='blurRadius' value='${this.state.blurRadius}' onchange='changeShadow' />
        </div>
        <div class='popup-item'>
          <object refClass="ColorViewEditor" 
              ref='$foreColor' 
              label="color" 
              key='color' 
              value="${this.state.color}"
              onchange="changeShadow" />
        </div>        
      </div>
    `;
  }

  [SUBSCRIBE('changeShadow')] (key, value) {
    this.updateData({
      [key]: value
    });

    if (key === 'offsetX' || key === 'offsetY') {
      this.refreshPointer();
    }

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

    this.updateData({
      offsetX: Length.px(x),
      offsetY: Length.px(y)
    });

    this.children.$offsetX.setValue(this.state.offsetX);
    this.children.$offsetY.setValue(this.state.offsetY);

    this.refreshPointer();
  }

  [SUBSCRIBE("showTextShadowPropertyPopup")](data, params) {

    this.changeEvent = data.changeEvent || "changeTextShadowPropertyPopup"
    this.params = params;

    this.setState(data, false);
    this.refresh();

    this.show(432);
  }

  [SUBSCRIBE("hideTextShadowPropertyPopup")]() {
    this.hide()
  }
}