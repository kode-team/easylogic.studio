import { vec3 } from "gl-matrix";

import {
  POINTERSTART,
  BIND,
  KEYUP,
  IF,
  ESCAPE,
  ENTER,
  PREVENT,
  STOP,
  POINTERMOVE,
  CHANGE,
  SUBSCRIBE,
  KEYDOWN,
  Dom,
} from "sapa";

import "./LayerAppendView.scss";

import { rectToVerties, vertiesToRectangle } from "elf/core/collision";
import { CSS_TO_STRING } from "elf/core/func";
import { PathParser } from "elf/core/parser/PathParser";
import { PathStringManager } from "elf/core/parser/PathStringManager";
import { EditingMode } from "elf/editor/types/editor";
import { UPDATE_VIEWPORT, END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class LayerAppendView extends EditorElement {
  template() {
    return /*html*/ `
        <div class='elf--layer-append-view'>
            <div class='area' ref='$area'></div>
            <div class='area-rect' ref='$areaRect'></div>
            <div class='area-pointer' ref='$mousePointer'></div>
            <div class='area-pointer-view' ref='$mousePointerView'></div>            
            <input type='file' accept='image/*' multiple="true" ref='$file' class='embed-file-input'/>
            <input type='file' accept='video/*' multiple="true" ref='$video' class='embed-video-input'/>            
        </div>
        `;
  }

  initState() {
    return {
      dragStart: false,
      width: 0,
      height: 0,
      color: "black",
      fontSize: 30,
      showRectInfo: false,
      areaVerties: rectToVerties(0, 0, 0, 0),
      content: "Insert a text",
      pathManager: new PathStringManager(),
      rect: {},
      options: {},
      containerItem: undefined,
      patternInfo: {},
    };
  }

  get scale() {
    return this.$viewport.scale;
  }

  checkNotDragStart() {
    return Boolean(this.state.dragStart) === false;
  }

  [POINTERMOVE("$el") + IF("checkNotDragStart")](e) {
    const vertex = this.$viewport.getWorldPosition(e);

    // 영역 드래그 하면서 snap 하기
    const newVertex = this.$context.snapManager.checkPoint(vertex);

    if (vec3.equals(newVertex, vertex) === false) {
      this.state.target = newVertex;
      this.state.targetVertex = this.$viewport.applyVertex(this.state.target);
      this.state.targetPositionVertex = vec3.clone(this.state.target);
      this.state.targetGuides = this.$context.snapManager.findGuideOne([
        this.state.target,
      ]);
    } else {
      this.state.target = vec3.floor([], vertex);
      this.state.targetVertex = vec3.floor(
        [],
        this.$viewport.applyVertex(this.state.target)
      );
      this.state.targetGuides = [];
      this.state.targetPositionVertex = null;
    }

    this.bindData("$mousePointer");
    this.bindData("$mousePointerView");
  }

  [POINTERSTART("$el") + MOVE() + END() + PREVENT + STOP](e) {
    this.initMousePoint = this.state.targetPositionVertex
      ? this.state.targetPositionVertex
      : this.$viewport.getWorldPosition(e);

    this.state.dragStart = true;
    this.state.color = "#C4C4C4"; //Color.random()
    this.state.text = "";

    const minX = this.initMousePoint[0];
    const minY = this.initMousePoint[1];

    const verties = rectToVerties(minX, minY, 0, 0);
    this.state.areaVerties = this.$viewport.applyVerties(verties);

    this.bindData("$area");
    this.bindData("$areaRect");
  }

  createLayerTemplate(width, height) {
    const { type, text, color, inlineStyle } = this.state;

    switch (type) {
      case "artboard":
        return /*html*/ `<div class='draw-item' style='background-color: white; ${inlineStyle}'></div>`;
      case "rect":
        return /*html*/ `<div class='draw-item' style='background-color: ${color}; ${inlineStyle}'></div>`;
      case "circle":
        return /*html*/ `<div class='draw-item' style='background-color: ${color}; border-radius: 100%; ${inlineStyle}'></div>`;
      case "text":
      case "svg-text":
        return /*html*/ `
                <div 
                    class='draw-item' 
                    
                    style='font-size: 30px;outline: 1px solid blue;white-space:nowrap'
                >
                    <p contenteditable="true" style="margin:0px;display: inline-block;outline:none;" ></p>
                </div>`;
      case "svg-rect":
        return /*html*/ `
            <div class='draw-item'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                    <path d="${
                      PathParser.makeRect(0, 0, width, height).d
                    }" stroke-width="1" stroke="black" fill="transparent" />
                </svg>
            </div>
            `;
      case "svg-circle":
        return /*html*/ `
            <div class='draw-item'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                    <path d="${
                      PathParser.makeCircle(0, 0, width, height).d
                    }" stroke-width="1" stroke="black" fill="transparent" />
                </svg>
            </div>
            `;
      case "svg-path":
        // eslint-disable-next-line no-case-declarations
        const newD = this.state.d
          .clone()
          .scale(
            width / this.state.bboxRect.width,
            height / this.state.bboxRect.height
          ).d;
        // eslint-disable-next-line no-case-declarations
        const options = this.state.options;
        return /*html*/ `
            <div class='draw-item'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                    <path   d="${newD}" 
                            stroke-width="${options["stroke-width"] || 1}" 
                            stroke="${options["stroke"] || "black"}" 
                            fill="${options["fill"] || "transparent"}" 
                    />
                </svg>
            </div>
            `;
      case "polygon":
        // eslint-disable-next-line no-case-declarations
        const options2 = this.state.options;
        return /*html*/ `
                <div class='draw-item'>
                    <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                        <path   d="${
                          PathParser.makePolygon(width, height, options2.count)
                            .d
                        }" 
                                stroke-width="${options2["stroke-width"] || 1}" 
                                stroke="${options2["stroke"] || "black"}" 
                                fill="${options2["fill"] || "transparent"}" 
                        />
                    </svg>
                </div>
                `;
      case "star":
        // eslint-disable-next-line no-case-declarations
        const options3 = this.state.options;
        return /*html*/ `
                    <div class='draw-item'>
                        <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                            <path   d="${
                              PathParser.makeStar(
                                width,
                                height,
                                options3.count,
                                options3.radius,
                                options3.tension
                              ).d
                            }" 
                                    stroke-width="${
                                      options3["stroke-width"] || 1
                                    }" 
                                    stroke="${options3["stroke"] || "black"}" 
                                    fill="${options3["fill"] || "transparent"}" 
                            />
                        </svg>
                    </div>
                    `;
      case "svg-textpath":
        return /*html*/ `
            <div class='draw-item' style='outline: 1px solid blue;'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;font-size: ${height}px;" overflow="visible">
                    <defs>
                        <path id='layer-add-path' d="${PathStringManager.makeLine(
                          0,
                          height,
                          width,
                          height
                        )}" />
                    </defs>
                    <text>
                        <textPath 
                          xlink:href="#layer-add-path"
                          textLength="100%"
                          lengthAdjust="spacingAndGlyphs"
                          startOffset="0em"
                        >${text}</textPath>
                    </text>
                </svg>
            </div>
            `;
      default:
        return /*html*/ `<div class='draw-item' style='outline: 1px solid blue; ${inlineStyle}'></div>`;
    }
  }

  [BIND("$area")]() {
    const { areaVerties } = this.state;

    const { left, top, width, height } = vertiesToRectangle(areaVerties);

    return {
      style: {
        left,
        top,
        width,
        height,
      },
      innerHTML: this.createLayerTemplate(width, height),
    };
  }

  [BIND("$areaRect")]() {
    const { areaVerties, showRectInfo } = this.state;

    const newVerties = this.$viewport.applyVertiesInverse(areaVerties);

    const { width, height } = vertiesToRectangle(newVerties);

    return {
      style: {
        display: showRectInfo ? "inline-block" : "none",
        left: areaVerties[2][0],
        top: areaVerties[2][1],
      },
      innerHTML: `x: ${Math.round(newVerties[0][0])}, y: ${Math.round(
        newVerties[0][1]
      )}, ${Math.round(width)} x ${Math.round(height)}`,
    };
  }

  [BIND("$mousePointerView")]() {
    const { showRectInfo } = this.state;
    const { target = vec3.create(), targetVertex = vec3.create() } = this.state;

    return {
      style: {
        display: !showRectInfo ? "inline-block" : "none",
        left: targetVertex[0] || -10000,
        top: targetVertex[1] || -10000,
      },
      innerHTML: `x: ${Math.round(target[0])}, y: ${Math.round(target[1])}`,
    };
  }

  makeMousePointer() {
    if (this.state.dragStart) return "";

    const { target } = this.state;

    if (!target) return "";

    const guides = (this.state.targetGuides || []).filter(Boolean);

    // if (guides.length === 0) return;

    return /*html*/ `
        <svg width="100%" height="100%">
            ${guides
              .map((guide) => {
                this.state.pathManager.reset();

                guide = this.$viewport.applyVerties([guide[0], guide[1]]);

                return this.state.pathManager
                  .M({ x: guide[0][0], y: guide[0][1] })
                  .L({ x: guide[1][0], y: guide[1][1] })
                  .X({ x: guide[0][0], y: guide[0][1] })
                  .X({ x: guide[1][0], y: guide[1][1] })
                  .toString("layer-add-snap-pointer");
              })
              .join("\n")}
        </svg>
    `;
  }

  [BIND("$mousePointer")]() {
    const html = this.makeMousePointer();

    // if (html === '') return;

    return {
      innerHTML: html,
    };
  }

  move() {
    const e = this.$config.get("bodyEvent");
    const targetMousePoint = this.$viewport.getWorldPosition();
    const newMousePoint =
      this.$context.snapManager.checkPoint(targetMousePoint);

    if (vec3.equals(newMousePoint, targetMousePoint) === false) {
      this.state.target = newMousePoint;
      this.state.targetVertex = this.$viewport.applyVertex(newMousePoint);
      this.state.targetGuides = this.$context.snapManager
        .findGuideOne([newMousePoint])
        .filter(Boolean);
    } else {
      this.state.target = undefined;
      this.state.targetGuides = [];
    }

    const isShiftKey = e.shiftKey;

    const minX = Math.min(newMousePoint[0], this.initMousePoint[0]);
    const minY = Math.min(newMousePoint[1], this.initMousePoint[1]);

    const maxX = Math.max(newMousePoint[0], this.initMousePoint[0]);
    const maxY = Math.max(newMousePoint[1], this.initMousePoint[1]);

    let dx = maxX - minX;
    let dy = maxY - minY;

    if (isShiftKey) {
      dy = dx;
    }

    // 영역 드래그 하면서 snap 하기
    const verties = rectToVerties(minX, minY, dx, dy);
    this.state.areaVerties = this.$viewport.applyVerties(verties);

    this.state.showRectInfo = true;

    this.bindData("$area");
    this.bindData("$areaRect");
    this.bindData("$mousePointer");
    this.bindData("$mousePointerView");
  }

  end() {
    const isAltKey = this.$config.get("bodyEvent").altKey;
    let { color, content, fontSize, areaVerties, patternInfo } = this.state;

    // viewport 좌표를 world 좌표로 변환
    const rectVerties = this.$viewport.applyVertiesInverse(areaVerties);

    // artboard 가 아닐 때만 parentArtBoard 가 존재
    const parentArtBoard = this.$context.selection.getArtboardByPoint(
      rectVerties[0]
    );

    let { x, y, width, height } = vertiesToRectangle(rectVerties);
    let hasArea = true;
    if (width === 0 && height === 0) {
      switch (this.state.type) {
        case "text":
          content = "";
          height.set(this.state.fontSize);
          hasArea = false;
          break;
        default:
          width = 100;
          height = 100;
          break;
      }
    }

    var rect = {
      x: Math.floor(x),
      y: Math.floor(y),
      width: Math.floor(width),
      height: Math.floor(height),
      backgroundColor: color,
      content: content,
      fontSize: fontSize,
      ...patternInfo.attrs,
      ...this.state.options,
    };

    switch (this.state.type) {
      case "text":
      case "svg-text":
      case "svg-textpath":
        delete rect.backgroundColor;
        break;
      case "svg-path":
        rect["d"] = this.state.d
          .clone()
          .scale(
            width / this.state.bboxRect.width,
            height / this.state.bboxRect.height
          ).d;
        break;
      default:
        delete rect["content"];
        break;
    }

    switch (this.state.type) {
      case "image":
        this.trigger("openImage", rect, parentArtBoard);
        break;
      case "video":
        this.trigger("openVideo", rect, parentArtBoard);
        break;
      case "audio":
        this.trigger("openAudio", rect, parentArtBoard);
        break;
      case "text":
        if (hasArea) {
          // NOOP
          // newComponent 를 그대로 실행한다.
          rect.fontSize = Length.px(this.state.fontSize).floor();
        } else {
          const scaledFontSize = this.state.fontSize / this.$viewport.scale;
          const $drawItem = this.refs.$area.$(".draw-item > p");
          $drawItem.parent().css("height", `${scaledFontSize}px`);
          $drawItem.parent().css("font-size", `${scaledFontSize}px`);
          $drawItem.select();
          $drawItem.focus();
          return;
        }
        break;
      default:
        this.$commands.emit(
          "newComponent",
          this.state.type,
          rect,
          /* isSelected */ true,
          parentArtBoard || this.$context.selection.currentProject
        );
        this.$config.set("editing.mode.itemType", "select");
        break;
    }

    if (!isAltKey) {
      this.trigger("hideLayerAppendView");
    }

    this.state.dragStart = false;
    this.state.showRectInfo = false;
    this.state.target = undefined;
    this.bindData("$areaRect");
  }

  /**
   * 그려지는 layer type 을 지정합시다.
   *
   * @param {string} type
   * @param {object} options
   */
  [SUBSCRIBE("showLayerAppendView")](type, options = {}) {
    this.state.type = type;
    this.state.options = options;
    this.state.isShow = true;
    this.refs.$area.empty();
    this.$el.show();
    this.$el.focus();
    this.$context.snapManager.clear();

    const model = this.$model.createModel(
      {
        itemType: type,
        ...options,
      },
      false
    );

    this.state.inlineStyle = CSS_TO_STRING(
      this.$editor.html.toCSS(model, {
        top: true,
        left: true,
        width: true,
        height: true,
        transform: true,
        transformOrigin: true,
      })
    );

    if (options.d) {
      this.state.d = new PathParser(options.d);
      this.state.bboxRect = this.state.d.rect();
    }

    this.$context.commands.emit("push.mode.view", "LayerAppendView");
  }

  [SUBSCRIBE("hideLayerAppendView")]() {
    if (this.$el.isShow()) {
      this.state.isShow = false;
      // this.refs.$area.empty()
      this.$el.hide();
      this.$commands.emit("pop.mode.view", "LayerAppendView");
      this.$config.set("editing.mode", EditingMode.SELECT);
    }
  }

  [SUBSCRIBE("hideAddViewLayer")]() {
    this.state.isShow = false;
    this.$el.hide();
  }

  isShow() {
    return this.state.isShow;
  }

  [KEYDOWN("document") + IF("isShow") + ESCAPE + ENTER]() {
    // NOOP
  }
  [KEYUP("document") + IF("isShow") + ESCAPE + ENTER](e) {
    switch (this.state.type) {
      case "text":
        // eslint-disable-next-line no-case-declarations
        const $t = Dom.create(e.target);

        // eslint-disable-next-line no-case-declarations
        let { fontSize, areaVerties } = this.state;

        // viewport 좌표를 world 좌표로 변환
        // eslint-disable-next-line no-case-declarations
        const rectVerties = this.$viewport.applyVertiesInverse(areaVerties);
        // eslint-disable-next-line no-case-declarations
        const { x, y } = vertiesToRectangle(rectVerties);
        // eslint-disable-next-line no-case-declarations
        const { width, height } = $t.rect();
        // eslint-disable-next-line no-case-declarations
        const text = $t.text();

        if (text.length === 0) {
          break;
        }

        // eslint-disable-next-line no-case-declarations
        const [[newWidth, newHeight, newFontSize]] =
          this.$viewport.applyScaleVertiesInverse([[width, height, fontSize]]);

        // eslint-disable-next-line no-case-declarations
        const rect = {
          x,
          y,
          width: newWidth,
          height: newHeight,
          content: text.trim(),
          "font-size": newFontSize,
        };

        // artboard 가 아닐 때만 parentArtBoard 가 존재
        // eslint-disable-next-line no-case-declarations
        const parentArtBoard = this.$context.selection.getArtboardByPoint(
          rectVerties[0]
        );

        this.$commands.emit(
          "newComponent",
          this.state.type,
          rect,
          /* isSelected */ true,
          parentArtBoard || this.$context.selection.currentProject
        );
        break;
    }

    this.state.dragStart = false;
    this.state.showRectInfo = false;
    this.state.target = null;
    this.bindData("$areaRect");
    this.trigger("hideLayerAppendView");
  }

  [CHANGE("$file")]() {
    this.refs.$file.files.forEach((item) => {
      this.$commands.emit(
        "updateImage",
        item,
        this.state.rect,
        this.state.containerItem
      );
    });
  }
  [CHANGE("$video")]() {
    this.refs.$video.files.forEach((item) => {
      this.$commands.emit(
        "updateVideo",
        item,
        this.state.rect,
        this.state.containerItem
      );
    });
  }

  [SUBSCRIBE("openImage")](rect, containerItem) {
    this.state.rect = rect;
    this.state.containerItem = containerItem;
    this.refs.$file.click();
  }

  [SUBSCRIBE("openVideo")](rect, containerItem) {
    this.state.rect = rect;
    this.state.containerItem = containerItem;
    this.refs.$video.click();
  }

  [SUBSCRIBE("setPatternInfo")](patternInfo) {
    this.state.patternInfo = patternInfo;
  }

  [SUBSCRIBE(UPDATE_VIEWPORT)]() {
    this.$context.snapManager.clear();
    this.bindData("$mousePointer");
    this.bindData("$mousePointerView");
  }
}
