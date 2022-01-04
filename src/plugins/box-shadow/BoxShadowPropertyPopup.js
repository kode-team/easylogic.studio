
import { Length } from "el/editor/unit/Length";
import { LOAD, CLICK, POINTERSTART, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BasePopup from "el/editor/ui/popup/BasePopup";
import { END, MOVE } from "el/editor/types/event";
import './BoxShadowPropertyPopup.scss';

export default class BoxShadowPropertyPopup extends BasePopup {

  getTitle() {
    return 'Box Shadow Editor'
  }

  initState() {
    return {
      color: 'rgba(0, 0, 0, 1)',
      inset: false,
      offsetX: 0,
      offsetY: 0,
      blurRadius: 0,
      spreadRadius: 0
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.emit(this.changeEvent, opt, this.state.params);
  }

  getBody() {
    return /*html*/`<div class='elf--box-shadow-property-popup' ref='$popup'></div>`;
  }

  [LOAD("$popup")]() {
    return /*html*/`
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
            style="left: ${this.state.offsetX};top: ${this.state.offsetY}"
          ></div>
        </div>        
        <div class="popup-item offset-x">
          <object refClass="RangeEditor" ref='$offsetX' label='X' key='offsetX' value="${this.state.offsetX}" onchange='changeRangeEditor' />
        </div>
        <div class="popup-item offset-y">
          <object refClass="RangeEditor" ref='$offsetY' label='Y' key='offsetY' value="${this.state.offsetY}" onchange='changeRangeEditor' />        
        </div>
        <div class="popup-item blur-radius">
          <object refClass="RangeEditor" ref='$blurRadius' label='Blur' key='blurRadius' value="${this.state.blurRadius}" onchange='changeRangeEditor' />        
        </div>
        <div class="popup-item spread-radius">
          <object refClass="RangeEditor" 
              ref='$spreadRadius' 
              label='Spread' 
              key='spreadRadius' 
              value="${this.state.spreadRadius}" 
              onchange='changeRangeEditor' 
            />        
        </div>
        <div class='popup-item'>
          <object refClass="ColorViewEditor" 
              ref='$foreColor' 
              label="color" 
              key='color' 
              value="${this.state.color}"
              onchange="changeRangeEditor" />
        </div>        
      </div>
    `;
  }


  [CLICK("$popup .select button")](e) {
    var type = e.$dt.attr("data-value");

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

    this.updateData({
      offsetX: x,
      offsetY: y
    });

    this.refreshPointer();

    this.children.$offsetX.setValue(this.state.offsetX)
    this.children.$offsetY.setValue(this.state.offsetY)    
  }

  [SUBSCRIBE_SELF('changeRangeEditor')] (key, value) {
    this.updateData({
      [key]: value
    })

    if (key === 'offsetX' || key === 'offsetY') {
      this.refreshPointer()
    }
  }

  [SUBSCRIBE("showBoxShadowPropertyPopup")](data, params) {

    this.changeEvent = data.changeEvent || "changeBoxShadowPropertyPopup"

    this.setState({...data, params});
    this.refresh();

    this.show(432);

  }

  [SUBSCRIBE( "hideBoxShadowPropertyPopup" )]() {
    this.hide();
  }
}