import { vec3 } from "gl-matrix";

import { POINTERSTART, BIND, KEYUP, IF, ESCAPE, ENTER, SUBSCRIBE } from "sapa";

import "./PathDrawView.scss";

import { PathParser } from "elf/core/parser/PathParser";
import { SVGFill } from "elf/editor/property-parser/SVGFill";
import { END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

const FIELDS = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
];

export default class PathDrawView extends EditorElement {
  initialize() {
    super.initialize();

    this.pathParser = new PathParser();
  }

  initState() {
    return {
      points: [],
      $target: null,
      fill: "transparent",
      stroke: "black",
      "fill-opacity": null,
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      tolerance: 1,
    };
  }

  [SUBSCRIBE("changeDrawManager")](obj) {
    this.setState({ ...obj }, false);
  }

  get scale() {
    return this.$viewport.scale;
  }

  template() {
    return /*html*/ `
        <div class='elf--path-draw-view' tabIndex="-1">
            <div class='path-draw-container' ref='$view'></div>
        </div>`;
  }

  initRect(isForce = false) {
    if (!this.state.rect || isForce) {
      this.state.rect = this.$el.rect();
    }
  }

  [KEYUP("document") + IF("isShow") + ESCAPE + ENTER]() {
    this.trigger("hidePathDrawEditor");
  }

  [SUBSCRIBE("DrawEditorDone")]() {
    this.trigger("hidePathDrawEditor");
  }

  get totalPathLength() {
    if (!this.refs.$view) return 0;
    var $obj = this.refs.$view.$("path.object");
    if (!$obj) return 0;

    return $obj.totalLength;
  }

  makePathLayer() {
    var layer;
    // 점 개수 줄이기
    const newPath = PathParser.makePathByPoints(this.state.points)
      .simplify(this.state.tolerance)
      .smooth(30);

    newPath.transformMat4(this.$viewport.matrixInverse);
    const bbox = newPath.getBBox();

    const newWidth = vec3.distance(bbox[1], bbox[0]);
    const newHeight = vec3.distance(bbox[3], bbox[0]);

    newPath.translate(-bbox[0][0], -bbox[0][1]);

    const pathItem = {
      itemType: "svg-path",
      x: bbox[0][0],
      y: bbox[0][1],
      width: newWidth,
      height: newHeight,
      d: newPath.d,
      totalLength: this.totalPathLength,
    };

    FIELDS.forEach((key) => {
      if (this.state[key]) Object.assign(pathItem, { [key]: this.state[key] });
    });

    const containerItem = this.$context.selection.currentProject;

    layer = containerItem.appendChild(this.$editor.createModel(pathItem));

    return layer;
  }

  addPathLayer() {
    var pathRect = this.getPathRect();

    if (pathRect.width !== 0 && pathRect.height !== 0) {
      var layer = this.makePathLayer(pathRect);
      if (layer) {
        // this.$context.selection.select(layer);
        // this.trigger('hidePathDrawEditor')
        this.emit("refreshAll");
      }
    }
  }

  changeMode(obj) {
    this.setState(
      {
        ...this.initState(),
        ...obj,
      },
      false
    );
  }

  getCurrentObject() {
    var current = this.state.current;

    if (!current) {
      return null;
    }

    return {
      current,
      d: current.d,
    };
  }

  [SUBSCRIBE("showPathDrawEditor")](obj = {}) {
    this.changeMode(obj);

    this.$el.show();
    this.$el.focus();

    this.emit("showDrawManager", {
      instance: this,
      fill: this.state.fill,
      stroke: this.state.stroke,
      "fill-opacity": this.state["fill-opacity"],
      "stroke-width": this.state["stroke-width"],
      "stroke-linecap": this.state["stroke-linecap"],
      "stroke-linejoin": this.state["stroke-linejoin"],
    });

    this.emit("hidePathEditor");
    this.$context.commands.emit("push.mode.view", "PathDrawView");
  }

  [SUBSCRIBE("initPathDrawEditor")]() {
    this.pathParser.reset("");
    this.refs.$view.empty();
  }

  [SUBSCRIBE("hidePathDrawEditor")]() {
    if (this.$el.isShow()) {
      this.trigger("initPathDrawEditor");
      this.$el.hide();
      // this.emit('finishPathEdit')
      this.emit("hideDrawManager");
      this.emit("pop.mode.view", "PathDrawView");
    }
  }

  [SUBSCRIBE("hideAddViewLayer")]() {
    this.$el.hide();
    this.emit("hideDrawManager");
  }

  getInnerId(postfix = "") {
    return "draw-manager-" + postfix;
  }

  get toFillSVG() {
    return SVGFill.parseImage(this.state.fill || "transparent").toSVGString(
      this.fillId
    );
  }

  get toStrokeSVG() {
    return SVGFill.parseImage(this.state.stroke || "black").toSVGString(
      this.strokeId
    );
  }

  get toDefInnerString() {
    return /*html*/ `
            ${this.toFillSVG}
            ${this.toStrokeSVG}
        `;
  }

  get toDefString() {
    var str = this.toDefInnerString.trim();

    // if (!str) return '';

    return /*html*/ `
            <defs>
            ${str}
            </defs>
        `;
  }

  get fillId() {
    return this.getInnerId("fill");
  }

  get strokeId() {
    return this.getInnerId("stroke");
  }

  get toFillValue() {
    return SVGFill.parseImage(this.state.fill || "transparent").toFillValue(
      this.fillId
    );
  }

  get toStrokeValue() {
    return SVGFill.parseImage(this.state.stroke || "black").toFillValue(
      this.strokeId
    );
  }

  [BIND("$view")]() {
    // 부드럽게 만들기
    const newPath = PathParser.makePathByPoints(this.state.points).simplify(
      this.state.tolerance
    );
    // .smooth(30);

    return {
      innerHTML: /*html*/ `
            <svg width="100%" height="100%" class='svg-editor-canvas'>
                ${this.toDefString}
                <path 
                    class='object' 
                    fill="${this.toFillValue}"
                    stroke="${this.toStrokeValue}"
                    fill-opacity="${this.state["fill-opacity"]}"
                    stroke-width="${this.state["stroke-width"]}"
                    stroke-linecap="${this.state["stroke-linecap"]}"
                    stroke-linejoin="${this.state["stroke-linejoin"]}"
                    d="${newPath.d}" 
                />
            </svg>
            `,
    };
  }

  renderPath() {
    this.bindData("$view");
  }

  [SUBSCRIBE("resizeEditor")]() {
    this.initRect(true);
  }

  getPathRect() {
    this.initRect(true);

    var $obj = this.refs.$view.$("path.object");

    var pathRect = { x: 0, y: 0, width: 0, height: 0 };
    if ($obj) {
      pathRect = $obj.rect();
      pathRect.x -= this.state.rect.x;
      pathRect.y -= this.state.rect.y;
    }

    return pathRect;
  }

  [POINTERSTART("$view") + MOVE() + END()](e) {
    this.initRect();

    this.state.altKey = false;

    this.state.startXY = {
      x: e.xy.x - this.state.rect.x,
      y: e.xy.y - this.state.rect.y,
    };

    this.state.points = [this.state.startXY];
  }

  move(dx, dy, eventType, pressure) {
    this.state.points.push({
      x: this.state.startXY.x + dx,
      y: this.state.startXY.y + dy,
      pressure,
    });

    this.renderPath();
  }

  end() {
    this.addPathLayer();
    this.trigger("initPathDrawEditor");
  }
}
