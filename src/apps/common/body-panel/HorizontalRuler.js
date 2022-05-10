import { vec3 } from "gl-matrix";

import {
  BIND,
  CONFIG,
  LOAD,
  SUBSCRIBE,
  THROTTLE,
  POINTERSTART,
  DOMDIFF,
  MOUSEOVER,
} from "sapa";

import "./HorizontalRuler.scss";

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

export default class HorizontalRuler extends EditorElement {
  template() {
    return /*html*/ `
            <div class="elf--horizontal-ruler">
                <div class='horizontal-ruler-container' ref='$layerRuler'>
                    <svg class="lines" width="100%" width="100%" overflow="hidden">
                        <path ref="$rulerLines" d="" />
                    </svg>
                </div>                            
                <div class='horizontal-ruler-container' ref='$ruler'></div>
                <div class='horizontal-ruler-container' ref='$lines'></div>
                <div class='horizontal-ruler-container'>
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

  makeLine(
    pathString,
    baseNumber,
    minX,
    maxX,
    realWidth,
    width,
    epsilon = 3,
    lineWidth = 30,
    expect = 10
  ) {
    let startX = minX - (minX % baseNumber);
    let endX = maxX + (maxX % baseNumber);

    // if (width / realWidth < 1) return;

    const firstX = ((startX - minX) / realWidth) * width;
    const secondX = ((startX + baseNumber - minX) / realWidth) * width;

    if (Math.abs(secondX - firstX) < epsilon) return;

    for (var i = startX; i < endX; i += baseNumber) {
      if (i != 0 && i % expect === 0) continue;

      const x = Math.floor(((i - minX) / realWidth) * width);

      pathString[pathString.length] = `M ${x} ${30 - lineWidth} L ${x} 30 `;
    }
  }

  makeLineText(baseNumber, minX, maxX, realWidth, width, epsilon = 3) {
    const text = [];
    let startX = minX - (minX % baseNumber);
    let endX = maxX + (maxX % baseNumber);

    // if (width / realWidth < 1) return;

    const firstX = ((startX - minX) / realWidth) * width;
    const secondX = ((startX + baseNumber - minX) / realWidth) * width;

    if (Math.abs(secondX - firstX) < epsilon) return;

    for (var i = startX; i < endX; i += baseNumber) {
      const x = Math.floor(((i - minX) / realWidth) * width);

      text[
        text.length
      ] = `<text x="${x}" y="${0}" dx="0" dy="6" text-anchor="middle" alignment-baseline="bottom" >${i}</text>`;
    }

    return text.join("");
  }

  makeRulerForCurrentArtboard() {
    const current = this.$context.selection.current;

    if (!current) return "";

    const currentArtboard = current.artboard;

    if (!currentArtboard) return "";

    const verties = currentArtboard.verties;

    const { minX, width: realWidth } = this.$viewport;
    const width = this.state.rect.width;

    const firstX = ((verties[0][0] - minX) / realWidth) * width;
    const secondX = ((verties[2][0] - minX) / realWidth) * width;

    return `
            M ${firstX} 20 
            L ${firstX} 30 
            L ${secondX} 30 
            L ${secondX} 20 
            Z
        `;
  }

  makeRulerForCurrent() {
    const current = this.$context.selection.current;

    if (!current) return "";

    // current
    const verties = this.$context.selection.verties;
    const xList = verties.map((it) => it[0]);
    const currentMinX = Math.min.apply(Math, xList);
    const currentMaxX = Math.max.apply(Math, xList);

    // viewport
    const { minX, width: realWidth } = this.$viewport;
    const width = this.state.rect.width;

    const firstX = ((currentMinX - minX) / realWidth) * width;
    const secondX = ((currentMaxX - minX) / realWidth) * width;

    return `
            M ${firstX} 0 
            L ${firstX} 20 
            L ${secondX} 20 
            L ${secondX} 0 
            Z
        `;
  }

  makeRuler() {
    const { minX, maxX, width: realWidth } = this.$viewport;
    const width = this.state.rect.width;

    pathString = [];

    this.makeLine(
      pathString,
      1000,
      minX,
      maxX,
      realWidth,
      width,
      10,
      24,
      10000
    );
    this.makeLine(pathString, 200, minX, maxX, realWidth, width, 10, 20, 5000);
    this.makeLine(pathString, 100, minX, maxX, realWidth, width, 10, 20, 200);
    this.makeLine(pathString, 50, minX, maxX, realWidth, width, 10, 20, 100);
    this.makeLine(pathString, 10, minX, maxX, realWidth, width, 10, 18, 50);
    this.makeLine(pathString, 5, minX, maxX, realWidth, width, 10, 15, 10);
    this.makeLine(pathString, 1, minX, maxX, realWidth, width, 10, 13, 5);

    return pathString.join("");
  }

  makeRulerText() {
    const { minX, maxX, width: realWidth } = this.$viewport;
    const width = this.state.rect.width;

    const dist = Math.abs(maxX - minX);

    return [
      dist > 3000
        ? this.makeLineText(3000, minX, maxX, realWidth, width, 24)
        : "",
      2000 < dist && dist < 3000
        ? this.makeLineText(500, minX, maxX, realWidth, width, 22)
        : "",
      1000 < dist && dist < 2000
        ? this.makeLineText(100, minX, maxX, realWidth, width, 20)
        : "",
      800 < dist && dist < 1000
        ? this.makeLineText(100, minX, maxX, realWidth, width, 20)
        : "",
      500 < dist && dist < 800
        ? this.makeLineText(100, minX, maxX, realWidth, width, 20)
        : "",
      500 < dist && dist < 800
        ? this.makeLineText(50, minX, maxX, realWidth, width, 20)
        : "",
      200 < dist && dist < 500
        ? this.makeLineText(50, minX, maxX, realWidth, width, 20)
        : "",
      50 < dist && dist < 200
        ? this.makeLineText(10, minX, maxX, realWidth, width, 20)
        : "",
      15 < dist && dist < 50
        ? this.makeLineText(5, minX, maxX, realWidth, width, 20)
        : "",
      0 < dist && dist < 15
        ? this.makeLineText(1, minX, maxX, realWidth, width, 20)
        : "",
    ].join("");
  }

  [LOAD("$ruler") + DOMDIFF]() {
    this.initializeRect();

    return /*html*/ `
            <svg width="100%" width="100%" overflow="hidden">
                <path d="${this.makeRuler()}" fill="transparent" stroke-width="0.5" stroke="white" transform="translate(0.5, 0)" />
                ${this.makeRulerText()}                
            </svg>
        `;
  }

  [LOAD("$lines") + DOMDIFF]() {
    this.initializeRect();

    const lines = this.$config
      .get("horizontal.line")
      .map((it) => {
        const pos = this.$viewport.applyVertex([it, 0, 0]);

        return `<path d="M ${pos[0]} 0 L ${pos[0]} 30"  transform="translate(0.5, 0)" />`;
      })
      .join("");

    return /*html*/ `
            <svg width="100%" height="100%" class="horizontal-line" overflow="hidden">${lines}</svg>
        `;
  }

  [BIND("$rulerLines")]() {
    return {
      d: this.makeRulerForCurrent(),
    };
  }

  makeRulerCursor() {
    const targetMousePoint = this.$viewport.getWorldPosition();
    const { minX, width: realWidth } = this.$viewport;

    this.initializeRect();

    const width = this.state.rect.width;

    const distX = targetMousePoint[0] - minX;

    const x = distX === 0 ? 0 : (distX / realWidth) * width;

    return `M ${x - 0.5} 0 L ${x - 0.5} 20`;
  }

  [BIND("$cursor")]() {
    const targetMousePoint = this.$viewport.getWorldPosition();
    const { minX, width: realWidth } = this.$viewport;

    this.initializeRect();

    const width = this.state.rect.width;

    const distX = targetMousePoint[0] - minX;

    const x = distX === 0 ? 0 : (distX / realWidth) * width;

    return {
      cssText: `
                --elf--horizontal-cursor-position: ${x}px;
            `,
    };
  }

  [MOUSEOVER()]() {
    this.$commands.emit("refreshCursor", "ns-resize");
  }

  [POINTERSTART() + MOVE() + END()]() {
    const pos = vec3.round([], this.$viewport.getWorldPosition());
    this.startIndex = this.$config.push("vertical.line", pos[1]);
    this.$config.init("vertical.line.selected.index", this.startIndex);

    this.$context.snapManager.clear();
  }

  move() {
    const newPos = this.$context.snapManager.getWorldPosition();

    if (this.$viewport.minY < newPos[1] && newPos[1] < this.$viewport.maxY) {
      this.$config.setIndexValue("vertical.line", this.startIndex, newPos[1]);
    }
  }

  end() {
    const pos = vec3.round([], this.$viewport.getWorldPosition());
    if (this.$viewport.minY < pos[1] && pos[1] < this.$viewport.maxY) {
      // NOOP
    } else {
      this.$config.removeIndex("vertical.line", this.startIndex);
    }

    this.startIndex = null;
    this.$commands.emit("recoverCursor");
  }

  refresh() {
    if (this.$config.get("show.ruler")) {
      this.load();
    }
  }

  [SUBSCRIBE(UPDATE_VIEWPORT, REFRESH_SELECTION)]() {
    this.refresh();
  }

  [SUBSCRIBE(UPDATE_CANVAS) + THROTTLE(10)]() {
    if (this.$context.selection.current) {
      const current = this.$context.selection.current;

      if (current.changedRect) {
        this.refresh();
      }
    }
  }

  [SUBSCRIBE(RESIZE_WINDOW, RESIZE_CANVAS)]() {
    this.refreshCanvasSize();
  }

  [CONFIG("onMouseMovepageContainer")]() {
    this.bindData("$cursor");
    this.bindData("$rulerLines");
  }

  [CONFIG("horizontal.line")]() {
    this.load("$lines");
  }
}
