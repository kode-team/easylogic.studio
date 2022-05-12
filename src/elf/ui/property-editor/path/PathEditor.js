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
  SUBSCRIBE_SELF,
  DELETE,
  Dom,
  isFunction,
} from "sapa";

import "./PathEditor.scss";
import PurePathGenerator from "./PurePathGenerator";

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
import { PathParser } from "elf/core/parser/PathParser";
import { END, MOVE } from "elf/editor/types/event";
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

function scaleLinear(source, target) {
  function targetScale(t) {
    if (target[0] < target[1]) {
      return target[0] + t * (target[1] - target[0]);
    } else if (target[0] > target[1]) {
      return target[0] - t * (target[0] - target[1]);
    }
  }

  function rate(v1, v2, current) {
    const minValue = Math.min(v1, v2);
    const maxValue = Math.max(v1, v2);
    return (current - minValue) / (maxValue - minValue);
  }

  return (x) => {
    if (source[0] < source[1]) {
      return targetScale(rate(source[0], source[1], x));
    } else if (source[0] > source[1]) {
      return targetScale(1 - rate(source[0], source[1], x));
    }
  };
}

const SegmentConvertor = class extends EditorElement {
  convertToCurve(index) {
    this.pathGenerator.convertToCurve(index);

    this.renderPath();

    this.updatePathLayer();
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
        this.updatePathLayer();
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

      this.updatePathLayer();

      // segment 모드로 변경
      this.changeMode("segment-move");

      // segment 캐쉬
      this.pathGenerator.setCachePoint(selectedSegmentIndex, "startPoint");

      // segment 선택 하기
      this.pathGenerator.selectKeyIndex("startPoint", selectedSegmentIndex);
    }
  }
};

/**
 * @property {PathGenerator} pathGenerator
 * @property {PathParser} pathParser
 */
export default class PathEditor extends PathCutter {
  initialize() {
    super.initialize();

    this.pathParser = new PathParser();
    this.pathGenerator = new PurePathGenerator(this);
  }

  initState() {
    return {
      domain: this.props.domain || [0, 1],
      range: this.props.range || [1, 0],
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

  template() {
    return /*html*/ `
        <div class='elf--path-editor' tabIndex="-1">
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

  [BIND("$el")]() {
    return {
      style: {
        height: Length.px(this.props.height) || 200,
      },
    };
  }

  initRect(isForce = false) {
    if (
      !this.state.rect ||
      isForce ||
      this.state.rect.width == 0 ||
      this.state.rect.height == 0
    ) {
      this.state.rect = this.refs.$view.rect();
    }
  }

  [SUBSCRIBE("PathEditorDone")]() {
    this.updatePathLayer();
  }

  [KEYUP() + ENTER]() {
    this.trigger("PathEditorDone");
  }

  [KEYUP() + ESCAPE]() {
    if (this.state.current) {
      this.updatePathLayer();
    }
  }

  [KEYUP() + DELETE]() {
    console.log("delete");
  }

  [KEYUP("$el .segment")](e) {
    const index = +e.$dt.data("index");

    console.log(index);
    switch (e.code) {
      case "Delete":
      case "Backspace":
        this.trigger("deleteSegment");
        break;
    }
  }

  [SUBSCRIBE_SELF("deleteSegment")]() {
    this.pathGenerator.reselect();

    this.pathGenerator.removeSelectedSegment();

    this.renderPath();

    this.updatePathLayer();
  }

  [SUBSCRIBE_SELF("moveSegment")](dx, dy) {
    // path 를 클릭했을 때 설정
    this.pathGenerator.reselect();

    this.pathGenerator.moveSelectedSegment(dx, dy);

    this.renderPath();
    this.updatePathLayer();
  }

  recoverAreaToPath(d) {
    this.initRect(true);

    var parser = new PathParser(d);

    parser.scaleFunc(this.state.domainScaleInvert, this.state.rangeScaleInvert);

    return parser.d;
  }

  updatePathLayer() {
    var { d } = this.pathGenerator.toPath();

    const value = this.recoverAreaToPath(d);

    this.parent.trigger(this.props.onchange, this.state.key, value);
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
  }

  isMode(mode) {
    return this.state.mode === mode;
  }

  convertPathToArea(obj) {
    this.initRect(true);

    const width = this.state.rect.width;
    const height = this.state.rect.height;

    // domain 함수 생성
    // range 함수 생성

    this.state.domainScale = scaleLinear([0, 1], [0, width]);
    this.state.rangeScale = scaleLinear([1, 0], [0, height]);
    this.state.domainScaleInvert = scaleLinear([0, width], [0, 1]);
    this.state.rangeScaleInvert = scaleLinear([0, height], [1, 0]);

    this.pathParser
      .reset(obj.d)
      .scaleFunc(this.state.domainScale, this.state.rangeScale);
  }

  /**
   * Path 에디터 다시 그리기
   *
   * @param {{d: string}} obj
   */
  refreshEditorView(obj) {
    // let selectedPointList = [];

    this.convertPathToArea(obj);

    // selectedPointList = removeCache ? [] : this.pathGenerator.selectedPointList;

    this.pathGenerator.setPoints(this.pathParser.convertGenerator());

    this.renderPath();
  }

  afterRender() {
    const { mode, value } = this.props;
    const obj = { d: value };
    if (mode === "move") {
      obj.current = null;
      obj.points = [];
    }

    this.changeMode(mode, obj);

    window.setTimeout(() => {
      this.refreshEditorView(obj, true);
    }, 10);
  }

  [BIND("$view")]() {
    const path = this.pathGenerator.makeSVGPath();

    const strokeWidth =
      Length.parse(this.state.current?.["stroke-width"]).value || 0;
    return {
      class: {
        path: this.state.mode === "path",
        modify: this.state.mode === "modify",
        transform: this.state.mode === "transform",
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

  renderPath() {
    this.bindData("$view");
  }

  get checkDistance() {
    return false;
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
    // this.$config.set('set.drag.path.area', false);

    var $target = Dom.create(e.target);
    this.$segmentTarget = $target;

    if ($target.hasClass("svg-editor-canvas") && !isPathMode) {
      // canvas 를 클릭했을 때 설정 , drag 를 할준비를 한다.
      // this.$config.set('set.drag.path.area', true);
      // this.state.isGroupSegment = false;
      // this.state.selectedGroupIndex = -1;
      // this.state.selectedPointIndex = -1;
      // NOOP
    } else {
      // path 를 클릭했을 때 설정
      this.pathGenerator.reselect();

      // segment 인지 체크
      this.state.isSegment = $target.attr("data-segment") === "true";

      // first segment 인지 체크
      this.state.isFirstSegment =
        this.state.isSegment && $target.attr("data-is-first") === "true";

      this.state.selectedGroupIndex = -1;
      this.state.selectedPointIndex = -1;

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

        // if (e.shiftKey) {
        //     // 선택된 segment 를 토글한다.
        //     this.pathGenerator.toggleSelect(segmentKey, localIndex)
        // } else {
        // 포인트에 대한 캐쉬를 설정한다.
        this.pathGenerator.setCachePoint(localIndex, segmentKey);

        // segment key 를 선택한다.
        this.pathGenerator.selectKeyIndex(segmentKey, localIndex);
        // }

        this.state.segmentKey = segmentKey;

        this.renderPath();
      }
    }
  }

  move(dx, dy) {
    const e = this.$config.get("bodyEvent");
    // 시작 지점이고 group 설정이 아닐 경우만 움직이는 영역을 제한한다.
    if (this.state.segmentKey === "startPoint") {
      const newXY = {
        x: Math.max(
          0,
          Math.min(this.state.rect.width, e.xy.x - this.state.rect.x)
        ),
        y: Math.max(
          0,
          Math.min(this.state.rect.height, e.xy.y - this.state.rect.y)
        ),
      };

      dx = newXY.x - this.state.dragXY.x;
      dy = newXY.y - this.state.dragXY.y;
    }

    if (this.isMode("segment-move")) {
      this.pathGenerator.move(
        dx,
        dy,
        e,
        this.state.rect.width,
        this.state.rect.height
      );

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
    // var e = this.$config.get("bodyEvent");
    this.$config.set("set.move.control.point", false);

    if (this.isMode("modify")) {
      // NOOP
      this.pathGenerator.reselect();
    } else if (this.isMode("segment-move")) {
      this.changeMode("modify");

      this.pathGenerator.reselect();

      this.renderPath();
      this.updatePathLayer();
    } else if (this.isMode("path")) {
      if (this.state.isFirstSegment) {
        this.changeMode("modify");
        this.pathGenerator.setConnectedPoint(dx, dy);

        this.renderPath();

        if (this.state.current) {
          this.updatePathLayer();
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
}
