import { vec3 } from "gl-matrix";

import {
  LOAD,
  SUBSCRIBE,
  THROTTLE,
  CONFIG,
  BIND,
  POINTERSTART,
  DOMDIFF,
  MOUSEOVER,
} from "sapa";

import "./VerticalRuler.scss";

import {
  UPDATE_VIEWPORT,
  REFRESH_SELECTION,
  RESIZE_WINDOW,
  RESIZE_CANVAS,
  UPDATE_CANVAS,
  END,
  MOVE,
} from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

let pathString = [];

export default class VerticalRuler extends EditorElement {
  template() {
    return /*html*/ `
          <div class="elf--vertical-ruler">
            <div class='vertical-ruler-container' ref='$layerRuler'>
                <svg class="lines" width="100%" height="100%" overflow="hidden">
                    <path ref="$rulerLines" d=""/>
                </svg>
            </div>                                        
            <div class='vertical-ruler-container' ref='$body'></div>
            <div class='vertical-ruler-container' ref='$lines'></div>            
            <div class='vertical-ruler-container'>
                <div class="cursor" ref="$cursor"></div>
            </div>                
          </div>
        `;
  }

  afterRender() {
    this.refreshCanvasSize();
  }

  refreshCanvasSize() {
    this.state.rect = this.$el.rect();
  }

  initializeRect() {
    if (!this.state.rect || this.state.rect.width == 0) {
      this.state.rect = this.$el.rect();
    }
  }

  [MOUSEOVER()]() {
    this.$commands.emit("refreshCursor", "ew-resize");
  }

  [POINTERSTART() + MOVE() + END()]() {
    const pos = vec3.round([], this.$viewport.getWorldPosition());
    this.startIndex = this.$config.push("horizontal.line", pos[0]);
    this.$config.init("horizontal.line.selected.index", this.startIndex);

    this.$context.snapManager.clear();
  }

  move() {
    const newPos = this.$context.snapManager.getWorldPosition();

    if (this.$viewport.minX < newPos[0] && newPos[0] < this.$viewport.maxX) {
      this.$config.setIndexValue("horizontal.line", this.startIndex, newPos[0]);
    }
  }

  end() {
    const pos = vec3.round([], this.$viewport.getWorldPosition());
    if (this.$viewport.minX < pos[0] && pos[0] < this.$viewport.maxX) {
      // NOOP
    } else {
      this.$config.removeIndex("horizontal.line", this.startIndex);
    }

    this.startIndex = null;
    this.$commands.emit("recoverCursor");
  }

  makeLine(
    pathString,
    baseNumber,
    minY,
    maxY,
    realHeight,
    height,
    epsilon = 3,
    lineWidth = 30,
    expect = 10
  ) {
    let startY = minY - (minY % baseNumber);
    let endY = maxY + (maxY % baseNumber);

    // if (height / realHeight < 1) return;

    const firstY = ((startY - minY) / realHeight) * height;
    const secondY = ((startY + baseNumber - minY) / realHeight) * height;

    if (Math.abs(secondY - firstY) < epsilon) return;

    for (var i = startY; i < endY; i += baseNumber) {
      if (i != 0 && i % expect === 0) continue;

      const y = Math.floor(((i - minY) / realHeight) * height);

      pathString[pathString.length] = `M ${30 - lineWidth} ${y} L 30 ${y}`;
    }
  }

  makeLineText(baseNumber, minY, maxY, realHeight, height, epsilon = 3) {
    const text = [];
    let startY = minY - (minY % baseNumber);
    let endY = maxY + (maxY % baseNumber);

    // if (height / realHeight < 1) return;

    const firstY = ((startY - minY) / realHeight) * height;
    const secondY = ((startY + baseNumber - minY) / realHeight) * height;

    if (Math.abs(secondY - firstY) < epsilon) return;

    for (var i = startY; i < endY; i += baseNumber) {
      const y = Math.floor(((i - minY) / realHeight) * height);

      text[
        text.length
      ] = `<text x="${0}" y="${y}" dy="4" dominant-baseline="central" transform="rotate(-90, 1, ${y})">${i}</text>`;
    }

    return text.join("");
  }

  makeRulerForCurrentArtboard() {
    const current = this.$context.selection.current;

    if (!current) return "";

    const currentArtboard = current.artboard;

    if (!currentArtboard) return "";

    const verties = currentArtboard.verties;

    const { minY, height: realHeight } = this.$viewport;
    const height = this.state.rect.height;

    const firstY = ((verties[0][1] - minY) / realHeight) * height;
    const secondY = ((verties[2][1] - minY) / realHeight) * height;

    return `
            M 20 ${firstY}
            L 30 ${firstY}
            L 30 ${secondY}
            L 20 ${secondY}
            Z
        `;
  }

  makeRulerForCurrent() {
    const current = this.$context.selection.current;

    if (!current) return "";

    // viewport
    const { minY, height: realHeight } = this.$viewport;
    const height = this.state.rect.height;

    // current
    const verties = this.$context.selection.verties;
    const yList = verties.map((it) => it[1]);
    const currentMinY = Math.min.apply(Math, yList);
    const currentMaxY = Math.max.apply(Math, yList);

    const firstY = ((currentMinY - minY) / realHeight) * height;
    const secondY = ((currentMaxY - minY) / realHeight) * height;

    return `
            M 0 ${firstY}
            L 20 ${firstY}
            L 20 ${secondY}
            L 0 ${secondY}
            Z
        `;
  }

  makeRuler() {
    const { minY, maxY, height: realHeight } = this.$viewport;
    const height = this.state.rect.height;

    pathString = [];

    this.makeLine(
      pathString,
      1000,
      minY,
      maxY,
      realHeight,
      height,
      10,
      20,
      10000
    );
    this.makeLine(
      pathString,
      200,
      minY,
      maxY,
      realHeight,
      height,
      10,
      16,
      5000
    );
    this.makeLine(pathString, 100, minY, maxY, realHeight, height, 10, 18, 200);
    this.makeLine(pathString, 50, minY, maxY, realHeight, height, 10, 18, 100);
    this.makeLine(pathString, 10, minY, maxY, realHeight, height, 10, 18, 50);
    this.makeLine(pathString, 5, minY, maxY, realHeight, height, 10, 15, 10);
    this.makeLine(pathString, 1, minY, maxY, realHeight, height, 10, 14, 5);

    return pathString.join("");
  }

  makeRulerText() {
    const { minY, maxY, height: realHeight } = this.$viewport;
    const height = this.state.rect.height;

    const dist = Math.abs(maxY - minY);

    return [
      dist > 3000
        ? this.makeLineText(3000, minY, maxY, realHeight, height, 24)
        : "",
      2000 < dist && dist < 3000
        ? this.makeLineText(500, minY, maxY, realHeight, height, 22)
        : "",
      1000 < dist && dist < 2000
        ? this.makeLineText(100, minY, maxY, realHeight, height, 20)
        : "",
      800 < dist && dist < 1000
        ? this.makeLineText(100, minY, maxY, realHeight, height, 20)
        : "",
      500 < dist && dist < 800
        ? this.makeLineText(100, minY, maxY, realHeight, height, 20)
        : "",
      500 < dist && dist < 800
        ? this.makeLineText(50, minY, maxY, realHeight, height, 20)
        : "",
      200 < dist && dist < 500
        ? this.makeLineText(50, minY, maxY, realHeight, height, 20)
        : "",
      50 < dist && dist < 200
        ? this.makeLineText(10, minY, maxY, realHeight, height, 20)
        : "",
      15 < dist && dist < 50
        ? this.makeLineText(5, minY, maxY, realHeight, height, 20)
        : "",
      0 < dist && dist < 15
        ? this.makeLineText(1, minY, maxY, realHeight, height, 20)
        : "",
    ].join("");
  }

  [LOAD("$body") + DOMDIFF]() {
    if (!this.state.rect || this.state.rect.width == 0) {
      this.state.rect = this.$el.rect();
    }

    return /*html*/ `
            <svg width="100%" height="100%" overflow="hidden">
                <path d="${this.makeRuler()}" fill="transparent" stroke-width="0.5" stroke="white" transform="translate(0, 0.5)" />
                ${this.makeRulerText()}
            </svg>
        `;
  }

  [LOAD("$lines") + DOMDIFF]() {
    this.initializeRect();

    const lines = this.$config
      .get("vertical.line")
      .map((it) => {
        const pos = this.$viewport.applyVertex([0, it, 0]);

        return `<path d="M 0 ${pos[1]} L 30 ${pos[1]}"  transform="translate(0, 0.5)" />`;
      })
      .join("");

    return /*html*/ `
            <svg width="100%" height="100%" class="vertical-line" overflow="hidden">${lines}</svg>
        `;
  }

  [BIND("$rulerLines")]() {
    return {
      d: this.makeRulerForCurrent(),
    };
  }

  [BIND("$cursor")]() {
    const targetMousePoint = this.$viewport.getWorldPosition();
    const { minY, height: realHeight } = this.$viewport;

    this.initializeRect();

    const height = this.state.rect.height;

    const distY = targetMousePoint[1] - minY;

    const y = distY === 0 ? 0 : (distY / realHeight) * height;

    return {
      cssText: `
                --elf--vertical-cursor-position: ${y}px;
            `,
    };
  }

  refresh() {
    if (this.$config.get("show.ruler")) {
      this.load();
    }
  }

  [SUBSCRIBE(UPDATE_CANVAS) + THROTTLE(10)]() {
    const current = this.$context.selection.current;

    if (current && current.changedRect) {
      this.refresh();
    }
  }

  [SUBSCRIBE(UPDATE_VIEWPORT, REFRESH_SELECTION)]() {
    this.refresh();
  }

  [SUBSCRIBE(RESIZE_WINDOW, RESIZE_CANVAS)]() {
    this.refreshCanvasSize();
  }

  [CONFIG("onMouseMovepageContainer")]() {
    this.bindData("$cursor");
    this.bindData("$rulerLines");
  }

  [CONFIG("vertical.line")]() {
    this.load("$lines");
  }
}
