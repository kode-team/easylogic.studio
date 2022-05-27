import { CLICK, POINTERSTART, BIND, SUBSCRIBE, isUndefined } from "sapa";

import "./CubicBezierEditor.scss";

import {
  formatCubicBezier,
  createBezierForPattern,
  bezierList,
  getPredefinedCubicBezier,
} from "elf/core/bezier";
import { curveToPath, curveToPointLine } from "elf/core/func";
import { div } from "elf/core/math";
import icon from "elf/editor/icon/icon";
import { END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class CubicBezierEditor extends EditorElement {
  initState() {
    return {
      key: this.props.key,
      currentBezier: getPredefinedCubicBezier(this.props.value || "linear"),
      isAnimating: isUndefined(this.props.isAnimating)
        ? true
        : Boolean(this.props.isAnimating),
      currentBezierIndex: 0,
      selectedColor: "#609de2",
      animatedColor: "#609de266",
      curveColor: "#609de2",
      baseLineColor: "rgba(117, 117, 117, 0.46)",
    };
  }

  template() {
    const linearCurve = curveToPath(this.state.currentBezier, 150, 150);
    const linearCurvePoint = curveToPointLine(
      this.state.currentBezier,
      150,
      150
    );
    const easeCurve = curveToPath("ease", 30, 30);
    const easeCurvePoint = curveToPointLine("ease", 30, 30);
    const easeInCurve = curveToPath("ease-in", 30, 30);
    const easeInCurvePoint = curveToPointLine("ease-in", 30, 30);
    const easeOutCurve = curveToPath("ease-out", 30, 30);
    const easeOutCurvePoint = curveToPointLine("ease-out", 30, 30);

    return /*html*/ `
            <div class='elf--cubic-bezier-editor'>
                <div class='predefined'>
                    <div class='left' ref='$left'>${icon.chevron_left}</div>
                    <div class='predefined-text' ref='$text'></div>
                    <div class='right' ref='$right'>${icon.chevron_right}</div>
                </div>
                <div class='animation' ref='$animationArea'>
                    <canvas 
                        class='animation-canvas' 
                        ref='$animationCanvas' 
                        title='Click and Replay point animation' 
                        width='230px' 
                        height='20px'
                    ></canvas>
                </div>
                <div class='item-list' ref='$itemList' data-selected-value=''>
                    <div class='item' data-bezier='ease' title='ease'>
                        <svg class='item-canvas' width="30" height="30" viewBox="0 0 30 30">
                            <path d="${easeCurve}" stroke="white" stroke-width="1" fill='none' />
                            <path d="${easeCurvePoint}" stroke="gray" stroke-width="1" fill='none' />
                        </svg>
                    </div>
                    <div class='item' data-bezier='ease-in' title='ease-in'>
                        <svg class='item-canvas' width="30" height="30" viewBox="0 0 30 30">
                            <path d="${easeInCurve}" stroke="white" stroke-width="1" fill='none' />
                            <path d="${easeInCurvePoint}" stroke="gray" stroke-width="1" fill='none' /> 
                        </svg>
                    </div>
                    <div class='item' data-bezier='ease-out' title='ease-out'>
                        <svg class='item-canvas' width="30" height="30" viewBox="0 0 30 30">
                            <path d="${easeOutCurve}" stroke="white" stroke-width="1" fill='none' />
                            <path d="${easeOutCurvePoint}" stroke="gray" stroke-width="1" fill='none' />
                        </svg>
                    </div>
                </div>
                <div class='bezier'>
                    <svg class='bezier-canvas' width="150" height="150" viewBox="0 0 150 150" overflow="visible">
                        <path d="${linearCurve}" stroke="black" stroke-width="1" fill='none' ref='$bezierCanvas' />
                        <path d="${linearCurvePoint}" stroke="gray" stroke-width="1" fill='none' ref='$bezierCanvasPoint' />
                    </svg>                
                    <div class='control' ref='$control'>
                        <div class='pointer1' ref='$pointer1'></div>
                        <div class='pointer2' ref='$pointer2'></div>
                    </div>
                </div>
            </div>
        `;
  }

  [BIND("$animationArea")]() {
    return {
      style: {
        display: this.state.isAnimating ? "block" : "none",
      },
    };
  }

  [BIND("$bezierCanvas")]() {
    return {
      d: curveToPath(this.state.currentBezier, 150, 150),
    };
  }

  [BIND("$bezierCanvasPoint")]() {
    return {
      d: curveToPointLine(this.state.currentBezier, 150, 150),
    };
  }

  updateData(opt = {}) {
    this.setState(opt);
    this.modifyCubicBezier();
  }

  modifyCubicBezier() {
    this.parent.trigger(
      this.props.onchange,
      this.state.key,
      formatCubicBezier(this.state.currentBezier)
    );
  }

  [CLICK("$left")]() {
    var { currentBezier, currentBezierIndex } = this.state;

    if (currentBezierIndex == 0) {
      currentBezierIndex = bezierList.length - 1;
    } else {
      --currentBezierIndex;
    }

    var currentBezier = bezierList[currentBezierIndex];

    this.updateData({ currentBezierIndex, currentBezier });

    this.refresh();
  }

  [CLICK("$right")]() {
    var { currentBezier, currentBezierIndex } = this.state;

    currentBezierIndex = ++currentBezierIndex % bezierList.length;
    currentBezier = bezierList[currentBezierIndex];

    this.updateData({ currentBezierIndex, currentBezier });

    this.refresh();
  }

  [CLICK("$text")]() {
    var currentBezier = [...bezierList[this.state.currentBezierIndex]];

    this.updateData({ currentBezier });
    this.refresh();
  }

  [CLICK("$itemList .item")](e) {
    var bezierString = e.$dt.attr("data-bezier");
    this.refs.$itemList.attr("data-selected-value", bezierString);

    var currentBezier = getPredefinedCubicBezier(bezierString);
    this.updateData({
      currentBezier,
    });

    this.refresh();
  }

  refresh() {
    this.refreshEasingText();
    this.refreshBezierCanvas();
  }

  refreshBezierCanvas() {
    this.bindData("$bezierCanvas");
    this.bindData("$bezierCanvasPoint");
    this.refreshPointer();
    this.drawPoint();
  }

  refreshEasingText() {
    this.refs.$text.html(this.state.currentBezier[4] || "ease");
  }

  refreshPointer() {
    var currentBezier = getPredefinedCubicBezier(this.state.currentBezier);
    var width = 150;
    var height = 150;

    var left = currentBezier[0] * width;
    var top = (1 - currentBezier[1]) * height;

    this.refs.$pointer1.css({
      left: Length.px(left),
      top: Length.px(top),
    });

    left = currentBezier[2] * width;
    top = (1 - currentBezier[3]) * height;

    this.refs.$pointer2.css({
      left: Length.px(left),
      top: Length.px(top),
    });
  }

  drawPoint() {
    if (this.state.isAnimating === false) return;
    if (this.timer) window.clearTimeout(this.timer);
    if (this.animationTimer) window.clearTimeout(this.animationTimer);

    this.timer = window.setTimeout(() => {
      this.animationPoint();
    }, 100);
  }

  start(i) {
    var pos = this.animationCanvasData.func(i);
    var x = 10 + (this.animationCanvasData.width - 20) * pos.y;
    var y = 10;
    var context = this.animationCanvasData.context;

    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();

    if (i >= 1) {
      return;
    }

    this.animationTimer = window.setTimeout(() => {
      this.start(i + 0.05);
    }, 50);
  }

  animationPoint() {
    const currentBezier = getPredefinedCubicBezier(this.state.currentBezier);
    var func = createBezierForPattern(formatCubicBezier(currentBezier));

    this.refs.$animationCanvas.clear();
    var width = this.refs.$animationCanvas.width();
    var height = this.refs.$animationCanvas.height();

    var context = this.refs.$animationCanvas.context();
    context.fillStyle = this.state.animatedColor;
    context.strokeStyle = this.state.selectedColor;
    context.lineWidth = 1;

    this.animationCanvasData = {
      func,
      width,
      height,
      context,
    };

    this.start(0);
  }

  setPosition(e) {
    var width = this.refs.$control.width();
    var height = this.refs.$control.height();

    var minX = this.refs.$control.offset().left;
    var minY = this.refs.$control.offset().top;

    var p = e;

    var x = p.x;
    if (0 > x) {
      x = 0;
    } else if (p.x > document.body.clientWidth) {
      x = document.body.clientWidth;
    }

    x -= minX;

    if (x < 0) {
      x = 0;
    }

    if (width < x) {
      x = width;
    }

    var y = p.y;

    y -= minY;

    // $pointer.css({
    //     left: x + 'px',
    //     top : y + 'px'
    // });

    return {
      x: div(x, width),
      y: y == height ? 0 : div(height - y, height),
    };
  }

  [POINTERSTART("$pointer1") + MOVE("movePointer1") + END("drawPoint")](e) {
    this.clientX = e.clientX;
    this.clientY = e.clientY;
  }

  movePointer1(dx, dy) {
    var pos = this.setPosition({
      x: this.clientX + dx,
      y: this.clientY + dy,
    });

    this.state.currentBezier[0] = pos.x;
    this.state.currentBezier[1] = pos.y;

    this.refreshBezierCanvas();

    this.modifyCubicBezier();
  }

  [POINTERSTART("$pointer2") + MOVE("movePointer2") + END("drawPoint")](e) {
    this.clientX = e.clientX;
    this.clientY = e.clientY;
  }
  movePointer2(dx, dy) {
    var pos = this.setPosition({
      x: this.clientX + dx,
      y: this.clientY + dy,
    });

    this.state.currentBezier[2] = pos.x;
    this.state.currentBezier[3] = pos.y;

    this.refreshBezierCanvas();

    this.modifyCubicBezier();
  }

  [SUBSCRIBE("showCubicBezierEditor")](timingFunction) {
    var currentBezier = getPredefinedCubicBezier(
      timingFunction || this.state.currentBezier
    );
    this.setState({ currentBezier });
    this.refresh();
  }
}
