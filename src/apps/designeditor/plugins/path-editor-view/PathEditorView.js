import { vec3 } from "gl-matrix";

import {
  POINTERSTART,
  BIND,
  POINTERMOVE,
  PREVENT,
  KEYUP,
  IF,
  STOP,
  DOUBLECLICK,
  ENTER,
  ESCAPE,
  DOUBLETAB,
  DELAY,
  SUBSCRIBE,
  Dom,
  isFunction,
} from "sapa";

import "./PathEditorView.scss";

import {
  getBezierPoints,
  recoverBezier,
  recoverBezierQuard,
  getBezierPointsQuard,
  recoverBezierLine,
  getBezierPointsLine,
} from "elf/core/bezier";
import { vertiesToRectangle } from "elf/core/collision";
import { getDist } from "elf/core/math";
import PathGenerator from "elf/editor/parser/PathGenerator";
import { PathParser } from "elf/editor/parser/PathParser";
import {
  REFRESH_SELECTION_TOOL,
  UPDATE_VIEWPORT,
  END,
  MOVE,
} from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

/**
 * convert array[x, y] to object{x, y}
 *
 * @param {array} param0
 */
function xy([x, y]) {
  return { x, y };
}

const SegmentConvertor = class extends EditorElement {
  convertToCurve(index) {
    this.pathGenerator.convertToCurve(index);

    this.renderPath();

    this.refreshPathLayer();
  }

  isEditableSegment() {
    return this.state.disableCurve === false;
  }

  [DOUBLECLICK("$view [data-segment]") + IF("isEditableSegment") + PREVENT](e) {
    var index = +e.$dt.attr("data-index");

    this.convertToCurve(index);
  }

  /**
   * Touch 용 에디팅을 위한 이벤트
   *
   * @param {TouchEvent} e
   */
  [DOUBLETAB("$view [data-segment]") + PREVENT + DELAY(300)](e) {
    var index = +e.$dt.attr("data-index");
    this.convertToCurve(index);
  }
};

const PathCutter = class extends SegmentConvertor {
  /**
   *
   * stroke 위의 점을 선택 할 수 있는지 체크
   *
   * @param {string} d
   * @param {Object} clickPosition
   * @returns {Object}
   */
  calculatePointOnLine(d, clickPosition) {
    var parser = new PathParser(d);

    return parser.getClosedPoint(clickPosition);
  }

  [POINTERSTART("$view .split-path") + MOVE() + END()](e) {
    this.initRect();
    var parser = new PathParser(e.$dt.attr("d"));
    var clickPosition = {
      x: e.xy.x - this.state.rect.x,
      y: e.xy.y - this.state.rect.y,
    };
    var selectedSegmentIndex = -1;

    if (this.isMode("path")) {
      // this.changeMode('modify');
      this.state.dragXY = clickPosition;
      this.state.startPoint = this.state.dragXY;
      this.pathGenerator.setLastPoint(this.state.startPoint);
      this.state.isSplitPath = true;

      this.renderPath();

      if (this.state.current) {
        this.refreshPathLayer();
      } else {
        this.addPathLayer();
        this.trigger("initPathEditorView");
      }

      return;
    } else {
      // 이벤트 체크만 하고 실제로는 pathParser 에서 분리 처리를 한다.
      // 그런 다음 segmentIndex 를 전달해준다.

      // split-path 를 클릭 하면 바로 패스를 분리시킨다.
      if (parser.segments[1].command === "C") {
        var points = [
          xy(parser.segments[0].values),
          xy(parser.segments[1].values.slice(0, 2)),
          xy(parser.segments[1].values.slice(2, 4)),
          xy(parser.segments[1].values.slice(4, 6)),
        ];

        var curve = recoverBezier(...points, 20);
        var t = curve(clickPosition.x, clickPosition.y);

        selectedSegmentIndex = this.pathGenerator.setPoint(
          getBezierPoints(points, t)
        );
      } else if (parser.segments[1].command === "Q") {
        var points = [
          xy(parser.segments[0].values),
          xy(parser.segments[1].values.slice(0, 2)),
          xy(parser.segments[1].values.slice(2, 4)),
        ];

        var curve = recoverBezierQuard(...points, 20);
        var t = curve(clickPosition.x, clickPosition.y);

        selectedSegmentIndex = this.pathGenerator.setPointQuard(
          getBezierPointsQuard(points, t)
        );
      } else if (parser.segments[1].command === "L") {
        var points = [
          xy(parser.segments[0].values),
          xy(parser.segments[1].values.slice(0, 2)),
        ];

        var curve = recoverBezierLine(...points, 20);
        var t = curve(clickPosition.x, clickPosition.y);

        selectedSegmentIndex = this.pathGenerator.setPointLine(
          getBezierPointsLine(points, t)
        );

        // 직선을 분할 할 때 altKey 여부를 체크해서 곡선을 만든다.
        if (e.altKey) {
          this.pathGenerator.convertToCurve(selectedSegmentIndex);
        }
      }

      this.renderPath();

      this.refreshPathLayer();

      // segment 모드로 변경
      this.changeMode("segment-move");

      // segment 캐쉬
      this.pathGenerator.setCachePoint(selectedSegmentIndex, "startPoint");

      // segment 선택 하기
      this.pathGenerator.selectKeyIndex("startPoint", selectedSegmentIndex);
    }
  }
};

const PathTransformEditor = class extends PathCutter {
  [SUBSCRIBE("changePathTransform")](transformMoveType) {
    this.resetTransformZone();

    var { width, height } = this.state.transformZoneRect;
    this.pathGenerator.initTransform(this.state.transformZoneRect);

    switch (transformMoveType) {
      case "flipX":
        this.pathGenerator.transform("flipX", width, 0); // rect 가운데를 기준으로 뒤집기
        break;
      case "flipY":
        this.pathGenerator.transform("flipY", 0, height);
        break;
      case "flip":
        this.pathGenerator.transform("flip", width, height);
    }

    this.renderPath();

    this.refreshPathLayer();
  }

  [SUBSCRIBE("changePathUtil")](utilType) {
    if (utilType === "reverse") {
      // 이전 scale 로 복구 한 다음 새로운 path 를 설정한다.
      const { d } = this.pathGenerator.toPath();

      const pathParser = new PathParser(d);

      pathParser.reverse(...this.pathGenerator.selectedGroupIndexList);
      pathParser.transformMat4(this.state.cachedMatrixInverse);

      this.refreshEditorView({ d: pathParser.d });
      this.updatePathLayer();
    }
  }

  [SUBSCRIBE("divideSegmentsByCount")](count) {
    const { d } = this.pathGenerator.toPath();

    const pathParser = new PathParser(d);
    const newPath = pathParser.divideSegmentByCount(count);
    newPath.transformMat4(this.state.cachedMatrixInverse);

    this.refreshEditorView({ d: newPath.d });
  }
};

const FIELDS = ["fill", "fill-opacity", "stroke", "stroke-width"];

/**
 * @property {PathGenerator} pathGenerator
 * @property {PathParser} pathParser
 */
export default class PathEditorView extends PathTransformEditor {
  initialize() {
    super.initialize();

    this.pathParser = new PathParser();
    this.pathGenerator = new PathGenerator(this);
  }

  initState() {
    return {
      changeEvent: "updatePathItem",
      isShow: false,
      isControl: false,
      disableCurve: false,
      points: [],
      mode: "path",
      clickCount: 0,
      isSegment: false,
      isFirstSegment: false,
      current: null,
    };
  }

  get scale() {
    return this.$viewport.scale;
  }

  template() {
    return /*html*/ `
        <div class='elf--path-editor-view' tabIndex="-1">
            <style type="text/css" ref="$styleView"></style>
            <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                    <pattern id='stripe' patternUnits='userSpaceOnUse' width='20' height='33' patternTransform='scale(1) rotate(135)'>
                        <path d='M0 8h20z'   stroke-width='1' stroke='#07A3FB' fill='none'/>
                        <path d='M0 16h20z'   stroke-width='1' stroke='#07A3FB' fill='none'/>
                        <path d='M0 24h20z'   stroke-width='1' stroke='#07A3FB' fill='none'/>
                        <path d='M0 32h20z'   stroke-width='1' stroke='#07A3FB' fill='none'/>
                    </pattern>
                </defs>    
            </svg>
            <div class='path-container' ref='$view'></div>
            <div class='path-container split-panel'>
                <svg width="100%" height="100%">
                    <circle ref='$splitCircle' class='split-circle' />
                </svg>
            </div>
            <div class='segment-box' ref='$segmentBox'></div>
        </div>`;
  }
  isShow() {
    return this.state.isShow;
  }

  initRect(isForce = false) {
    if (!this.state.rect || isForce) {
      this.state.rect = this.$el.rect();
    }
  }

  [SUBSCRIBE("PathEditorDone")]() {
    if (this.state.current) {
      this.refreshPathLayer();
      this.trigger("hidePathEditor");
    } else {
      this.addPathLayer();
    }

    if (!this.state.current && this.pathGenerator.length) {
      this.trigger("initPathEditorView");
    } else {
      this.trigger("hidePathEditor");
    }
  }

  [KEYUP("document") + IF("isShow") + ENTER]() {
    this.trigger("PathEditorDone");
  }

  [KEYUP("document") + IF("isShow") + ESCAPE]() {
    if (this.state.current) {
      this.refreshPathLayer();
    } else {
      this.addPathLayer();
    }

    this.trigger("hidePathEditor");
  }

  // get totalPathLength() {
  //     if (!this.refs.$view) return 0
  //     var $obj = this.refs.$view.$('path.object');
  //     if (!$obj) return 0;

  //     return $obj.totalLength
  // }

  makePathLayer() {
    var layer;
    const newPath = new PathParser(this.pathGenerator.toPath().d);
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
      // totalLength: this.totalPathLength,
      fill: newPath.closed ? `#C4C4C4` : "transparent",
    };

    FIELDS.forEach((key) => {
      if (this.state[key]) {
        pathItem[key] = this.state[key];
      }
    });

    const containerItem = this.$context.selection.currentProject;

    // project 를 설정하다.
    // 이걸 여기다 하는게 맞는건가?
    // 이게 추가 되면  히스토리에 들어가야하기 때문에
    // history.moveLayerToTarget 으로 넘겨야 할지도 모른다.
    layer = containerItem.appendChild(this.$editor.createModel(pathItem));

    this.command(
      "moveLayerToTarget",
      "add path",
      layer,
      this.$context.selection.currentProject
    );

    return layer;
  }

  updatePathLayer() {
    var { d } = this.pathGenerator.toPath();

    var parser = new PathParser(d);
    parser.transformMat4(this.$viewport.matrixInverse);

    this.emit(this.state.changeEvent, {
      d: parser.d,
      matrix: this.state.matrix,
      box: this.state.box,
      // totalLength: this.totalPathLength,
    });
  }

  /**
   * ArtBoard 에 path layer 추가하기
   *
   * @param {number} dx
   * @param {number} dy
   */
  addPathLayer() {
    this.changeMode("modify");

    var layer = this.makePathLayer();
    if (layer) {
      this.$config.set("editing.mode.itemType", "select");
      this.$context.selection.select(layer);
      this.trigger("hidePathEditor");
      this.emit("refreshAll");
    }
  }

  changeMode(mode, obj) {
    this.setState(
      {
        mode,
        clickCount: 0,
        moveXY: null,
        ...obj,
      },
      false
    );

    if (obj?.points) {
      this.pathGenerator.setPoints(obj.points || []);
    }

    this.emit("changePathManager", this.state.mode);
  }

  [SUBSCRIBE("changePathManager")](obj) {
    this.setState({ ...obj, clickCount: 0 }, false);

    this.renderPath();
  }

  isMode(mode) {
    return this.state.mode === mode;
  }

  afterRender() {
    this.$el.hide();
  }

  [SUBSCRIBE(UPDATE_VIEWPORT)]() {
    if (this.$el.isShow()) {
      const { d } = this.pathGenerator.toPath();

      const pathParser = new PathParser(d);
      pathParser.transformMat4(this.state.cachedMatrixInverse);

      this.refreshEditorView({ d: pathParser.d });
    }
  }

  /**
   * Path 에디터 다시 그리기
   *
   * viewport 의 matrixInverse 를 적용하고 다시 정리한다.
   *
   * @param {{d: string}} obj
   */
  refreshEditorView(obj) {
    // let selectedPointList = [];
    if (obj && obj.d) {
      this.pathParser.reset(obj.d);
      this.pathParser.transformMat4(this.$viewport.matrix);
      this.state.cachedMatrixInverse = this.$viewport.matrixInverse;

      //   selectedPointList = removeCache
      //     ? []
      //     : this.pathGenerator.selectedPointList;

      this.pathGenerator.setPoints(this.pathParser.convertGenerator());
    }

    // this.pathGenerator.initializeSelect(selectedPointList);
    this.renderPath();
  }

  [SUBSCRIBE("showPathEditor")](mode = "path", obj = {}) {
    this.state.isShow = true;
    this.transformMode = mode;

    if (mode === "move") {
      obj.current = null;
      obj.points = [];
    }

    obj.box = obj.box || "canvas";

    this.changeMode(mode, obj);

    this.refreshEditorView(obj, true);

    this.$el.show();
    this.$el.focus();

    this.emit("showPathManager", { mode: this.state.mode });
    this.emit("hidePathDrawEditor");
    this.emit("push.mode.view", "PathEditorView");
  }

  [SUBSCRIBE("hidePathEditor")]() {
    if (this.$el.isShow()) {
      this.pathParser.reset("");
      this.pathGenerator.setPoints([]);
      this.setState(this.initState(), false);
      this.refs.$view.empty();
      this.$el.hide();
      // this.emit('finishPathEdit')
      this.emit("hidePathManager");
      this.emit("pop.mode.view", "PathEditorView");
      this.emit(REFRESH_SELECTION_TOOL);
    }
  }

  [SUBSCRIBE("hideAddViewLayer")]() {
    this.state.isShow = false;
    this.state.isControl = false;
    this.pathParser.reset("");
    this.setState(this.initState(), false);
    this.refs.$view.empty();
    this.$el.hide();
    this.emit("hidePathManager");
  }

  [BIND("$view")]() {
    const path = this.state.isShow ? this.pathGenerator.makeSVGPath() : "";

    const strokeWidth =
      Length.parse(this.state.current?.["stroke-width"]).value || 0;
    return {
      class: {
        path: this.state.mode === "path",
        modify: this.state.mode === "modify",
        transform: this.state.mode === "transform",
        box: this.state.box === "box",
        canvas: this.state.box === "canvas",
        "segment-move": this.state.mode === "segment-move",
        "is-control": this.state.isControl,
        "has-one-stroke-width": strokeWidth === 1,
      },

      // 성능을 위해서 diff 알고리즘 사용
      // diff 를 하지 않으면 이벤트가 종료 되기 때문에 diff 로 부분만 변경해줘야 함
      htmlDiff: path,
    };
  }

  [BIND("$splitCircle")]() {
    if (this.state.splitXY) {
      return {
        cx: this.state.splitXY.x,
        cy: this.state.splitXY.y,
        r: 5,
      };
    } else {
      return {
        r: 0,
      };
    }
  }

  refreshPathLayer() {
    this.updatePathLayer();
  }

  renderPath() {
    this.bindData("$view");
  }

  getPathRect() {
    this.initRect(true);

    const { d } = this.pathGenerator.toPath();

    return vertiesToRectangle(PathParser.fromSVGString(d).getBBox(), false);
  }

  resetTransformZone() {
    var rect = this.getPathRect();

    this.state.transformZoneRect = rect;
  }

  [POINTERMOVE("$view") + PREVENT](e) {
    this.initRect();
    if (this.isMode("path") && this.state.rect) {
      this.state.moveXY = {
        x: e.xy.x - this.state.rect.x,
        y: e.xy.y - this.state.rect.y,
      };

      this.state.altKey = e.altKey;
      this.renderPath();
    } else {
      var $target = Dom.create(e.target);
      var isSplitPath = $target.hasClass("split-path");
      if (isSplitPath) {
        this.state.splitXY = this.calculatePointOnLine($target.attr("d"), {
          x: e.xy.x - this.state.rect.x,
          y: e.xy.y - this.state.rect.y,
        });
      } else {
        this.state.splitXY = null;
      }

      this.bindData("$splitCircle");

      this.state.altKey = false;
    }
  }

  [POINTERSTART("$view :not(.split-path)") + PREVENT + STOP + MOVE() + END()](
    e
  ) {
    this.initRect();

    this.state.altKey = false;
    var isPathMode = this.isMode("path");
    this.$config.set("set.move.control.point", true);

    this.state.dragXY = {
      x: e.xy.x - this.state.rect.x,
      y: e.xy.y - this.state.rect.y,
    };

    // canvas 클릭 여부
    this.$config.set("set.drag.path.area", false);

    var $target = Dom.create(e.target);
    if ($target.hasClass("svg-editor-canvas") && !isPathMode) {
      // canvas 를 클릭했을 때 설정 , drag 를 할준비를 한다.
      this.$config.set("set.drag.path.area", true);
      this.state.isGroupSegment = false;
      this.state.selectedGroupIndex = -1;
      this.state.selectedPointIndex = -1;
    } else {
      // path 를 클릭했을 때 설정
      this.pathGenerator.reselect();

      // segment 인지 체크
      this.state.isSegment = $target.attr("data-segment") === "true";

      // first segment 인지 체크
      this.state.isFirstSegment =
        this.state.isSegment && $target.attr("data-is-first") === "true";

      this.state.isGroupSegment = $target.hasClass("path-area");

      if (this.state.isGroupSegment) {
        this.state.selectedGroupIndex = +$target.data("group-index");
        this.state.selectedPointIndex = +$target.data("point-index");
      } else {
        this.state.selectedGroupIndex = -1;
        this.state.selectedPointIndex = -1;
      }

      // segment 를 클릭 했을 때 같은 위치에 있는 점을 같이 움직여야 한다.
      // 이건 기본적으로 합쳐지면 같이 움직이고 특수한 키를 누르면 다르게 움직인다.
      // 모드가 좀 다양해야 하는구나.
      // mode : samepointer, default
    }

    if (isPathMode) {
      if (this.state.isFirstSegment) {
        // 마지막 지점을 연결할 예정이기 때문에
        // startPoint 는  M 이었던 startPoint 로 정리된다.
        var index = +$target.attr("data-index");
        this.state.startPoint = this.pathGenerator.points[index].startPoint;
      } else {
        this.state.startPoint = this.state.dragXY;
      }
      this.state.dragPoints = false;
      this.state.endPoint = null;
    } else {
      if (this.state.isSegment) {
        this.changeMode("segment-move");
        var [index, segmentKey] = $target.attrs(
          "data-index",
          "data-segment-point"
        );
        const localIndex = +index;

        if (e.shiftKey) {
          // 선택된 segment 를 토글한다.
          this.pathGenerator.toggleSelect(segmentKey, localIndex);
        } else {
          // 포인트에 대한 캐쉬를 설정한다.
          this.pathGenerator.setCachePoint(localIndex, segmentKey);

          // segment key 를 선택한다.
          this.pathGenerator.selectKeyIndex(segmentKey, localIndex);
        }

        this.renderPath();
      } else if (this.state.isGroupSegment) {
        this.changeMode("segment-move");
        this.pathGenerator.selectGroup(this.state.selectedGroupIndex);

        this.renderPath();
      }
    }
  }

  move(dx, dy) {
    var e = this.$config.get("bodyEvent");

    if (this.$config.true("set.drag.path.area")) {
      // 드래그 상자 만들기
      this.renderSelectBox(this.state.dragXY, dx, dy);
    } else if (this.isMode("segment-move")) {
      this.pathGenerator.move(dx, dy, e);

      this.renderPath();

      this.updatePathLayer();
    } else if (this.isMode("path")) {
      const dist = getDist(dx, dy, 0, 0);

      if (dist >= 2) {
        this.state.dragPoints = e.altKey ? false : true;
      }
    }
  }

  renderSegment(callback) {
    if (this.pathGenerator.selectedLength) {
      // reselect 로 이전 점들의 위치를 초기화 해줘야 한다. 꼭
      this.pathGenerator.reselect();
      // reselect 로 이전 점들의 위치를 초기화 해줘야 한다. 꼭

      if (isFunction(callback)) callback();

      this.renderPath();

      this.updatePathLayer();
    }
  }

  end(dx, dy) {
    var e = this.$config.get("bodyEvent");
    this.$config.set("set.move.control.point", false);

    // group 일 때는 드래그가 끝난 이후에 selection 을 초기화한다. 그래야 segment 를 선택할 수 있다.
    if (this.state.isGroupSegment) {
      this.pathGenerator.select();
    }

    if (this.$config.true("set.drag.path.area")) {
      if (dx === 0 && dy === 0) {
        // 아무것도 움직인게 없으면 편집 종료
        this.changeMode("modify");
        this.trigger("hidePathEditor");
      } else {
        // select box 에 있는 선택된 점들을 저장해둔다.
        // mode -> segment-move
        this.changeMode("segment-move");
        this.pathGenerator.selectInBox(this.getSelectBox(), e.shiftKey);
        this.renderPath();
        this.hideSelectBox();
      }
    } else if (this.isMode("modify")) {
      // NOOP
      this.pathGenerator.reselect();
      // 마지막 선택 지점을 다시 select 한다.
    } else if (this.isMode("segment-move")) {
      this.changeMode("modify");

      this.pathGenerator.reselect();

      this.renderPath();
      this.updatePathLayer();
    } else if (this.isMode("path")) {
      // isFirstSegment 말고
      // segment 에 지정되면 종료하는걸로 해야할 듯 하다.
      // connectedPointList 를 자 구성해서 해보자.
      // connected 속성은 어떻게 적용되어야 할지  생각을 해보자.
      if (this.state.isFirstSegment) {
        this.changeMode("modify");
        this.pathGenerator.setConnectedPoint(dx, dy);

        this.renderPath();

        if (this.state.current) {
          this.refreshPathLayer();
        } else {
          this.addPathLayer();
          this.trigger("initPathEditorView");
        }
      } else {
        if (this.state.isSplitPath) {
          // NOOP
        } else {
          this.pathGenerator.moveEnd(dx, dy);
          this.state.clickCount++;

          this.renderPath();
          this.pathGenerator.reselect();
        }
      }
      this.state.isSplitPath = false;
    }
  }

  hideSelectBox() {
    this.refs.$segmentBox.css({
      left: -100000,
    });
  }

  renderSelectBox(startXY = null, dx = 0, dy = 0) {
    var obj = {
      left: startXY.x + (dx < 0 ? dx : 0),
      top: startXY.y + (dy < 0 ? dy : 0),
      width: Math.abs(dx),
      height: Math.abs(dy),
    };

    this.refs.$segmentBox.css(obj);
  }

  getSelectBox() {
    var [x, y, width, height] = this.refs.$segmentBox
      .styles("left", "top", "width", "height")
      .map((it) => Length.parse(it));

    var rect = {
      x,
      y,
      width,
      height,
    };

    rect.x2 = rect.x.value + rect.width;
    rect.y2 = rect.y.value + rect.height;

    return rect;
  }

  [SUBSCRIBE("deleteSegment")]() {
    this.pathGenerator.reselect();

    this.pathGenerator.removeSelectedSegment();

    this.renderPath();
    this.updatePathLayer();
  }

  [SUBSCRIBE("moveSegment")](dx, dy) {
    // path 를 클릭했을 때 설정
    this.pathGenerator.reselect();

    this.pathGenerator.moveSelectedSegment(dx, dy);

    this.renderPath();
    this.updatePathLayer();
  }

  [SUBSCRIBE("initPathEditorView")]() {
    this.pathParser.reset("");
    this.setState(this.initState(), false);
    this.state.isShow = true;
    this.refs.$view.empty();
    this.$el.focus();
  }
}
