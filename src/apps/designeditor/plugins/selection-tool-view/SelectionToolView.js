import { mat4, vec3 } from "gl-matrix";

import {
  POINTERSTART,
  POINTEROVER,
  POINTEROUT,
  IF,
  SUBSCRIBE,
  clone,
} from "sapa";

import {
  REFRESH_SELECTION_TOOL,
  REFRESH_SELECTION,
  UPDATE_VIEWPORT,
  END,
  MOVE,
} from "../../../../elf/editor/types/event";
import "./SelectionView.scss";

import { getRotatePointer } from "elf/core/collision";
import { objectFloor } from "elf/core/func";
import {
  calculateAngle360,
  calculateAngleForVec3,
  calculateMatrix,
  calculateMatrixInverse,
  round,
  vertiesMap,
} from "elf/core/math";
import GridLayoutEngine from "elf/editor/layout-engine/GridLayoutEngine";
import { TransformOrigin } from "elf/editor/property-parser/TransformOrigin";
import { ViewModeType } from "elf/editor/types/editor";
import { ResizingMode } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

var directionType = {
  1: "to top left",
  2: "to top right",
  3: "to bottom right",
  4: "to bottom left",
  11: "to top",
  12: "to right",
  13: "to bottom",
  14: "to left",
};

/**
 * 선택된 영역을 그리는 뷰
 *
 * key
 * shift: height/width 동일한 비율로 변경
 * alt: scale * 2 변경
 * meta: width, height 를 같은 크기로 변경
 */

const SelectionToolEvent = class extends EditorElement {
  checkViewMode() {
    return this.$modeView.isCurrentMode(ViewModeType.CanvasView);
  }

  /**
   * 업데이트 할 때마다 선택된 영역을 그린다.
   *
   * @param {*} isShow
   */
  [SUBSCRIBE(REFRESH_SELECTION, REFRESH_SELECTION_TOOL) +
    IF("checkViewMode")]() {
    this.initSelectionTool();
  }

  [SUBSCRIBE(UPDATE_VIEWPORT) + IF("checkViewMode")]() {
    if (this.$context.selection.isOne) {
      this.initSelectionTool();
    } else {
      this.hide();
    }
  }

  [SUBSCRIBE("updateModeView")]() {
    if (this.checkViewMode()) {
      this.initSelectionTool();
    } else {
      this.hide();
    }
  }
};

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉
 */
export default class SelectionToolView extends SelectionToolEvent {
  template() {
    return /*html*/ `
            <div class='elf--selection-view one-selection-view' ref='$selectionView' style='display:none' >
                <div class='pointer-rect' ref='$pointerRect'></div>
            </div>
        `;
  }

  toggleEditingPath(isEditingPath) {
    this.$el.toggleClass("editing-path", isEditingPath);
  }

  [POINTERSTART("$pointerRect .rotate-pointer") +
    MOVE("rotateVertex") +
    END("rotateEndVertex")](e) {
    this.state.moveType = "rotate";
    this.initMousePoint = this.$viewport.getWorldPosition(e);

    // this.$context.selection.doCache();

    this.$context.selection.reselect();
    this.verties = clone(this.$context.selection.verties);
    this.$context.snapManager.clear();
    this.rotateTargetNumber = +e.$dt.attr("data-number");
    this.refreshRotatePointerIcon();
    this.state.dragging = true;
    this.state.isRotate = true;
    this.initAngle = this.$context.selection.current.angle;

    // drag 시작 이벤트 설정
    // this.$config.set("set.move.control.point", true);
  }

  rotateVertex() {
    const targetMousePoint = this.$viewport.getWorldPosition();
    const distVector = vec3.subtract([], targetMousePoint, this.initMousePoint);

    const targetRotatePointer =
      this.rotateTargetNumber === 4
        ? getRotatePointer(this.verties, 34)
        : this.verties[this.rotateTargetNumber];

    var distAngle = Math.floor(
      calculateAngleForVec3(targetRotatePointer, this.verties[4], distVector)
    );

    const instance = this.$context.selection.current;
    let newAngle = this.initAngle + distAngle;

    if (instance) {
      if (this.$config.get("bodyEvent").shiftKey) {
        newAngle -= newAngle % this.$config.get("fixed.angle");
      }

      instance.angle = round(newAngle % 360, 100);
    }

    this.state.dragging = true;
    this.$commands.emit("setAttribute", this.$context.selection.pack("angle"));

    this.makeSelectionTool();
  }

  rotateEndVertex() {
    this.state.dragging = false;
    this.state.isRotate = false;
    this.$commands.emit("recoverCursor");
    // this.$config.set("set.move.control.point", false);
    // 마지막 변경 시점 업데이트
    this.verties = null;

    this.$commands.executeCommand(
      "setAttribute",
      "change rotate",
      this.$context.selection.pack("angle")
    );
  }

  refreshRotatePointerIcon() {
    this.$commands.emit("refreshCursor", "rotate");
  }

  refreshPointerIcon(e) {
    const dataPointer = e.$dt.data("pointer");

    if (dataPointer) {
      const pointer = dataPointer.split(",").map((it) => Number(it));

      const diff = vec3.subtract(
        [],
        pointer,
        this.state.renderPointerList[0][4]
      );
      const angle = calculateAngle360(diff[0], diff[1]);
      let iconAngle = Math.floor(angle);
      this.$commands.emit(
        "refreshCursor",
        "direction",
        `rotate(${iconAngle} 8 8)`
      );
    } else {
      this.$commands.emit("recoverCursor");
    }
  }

  checkPointerIsNotMoved() {
    return (
      Boolean(this.state.dragging) === false &&
      this.$config.false("set.move.control.point")
    );
  }

  [POINTEROVER("$pointerRect .rotate-pointer") + IF("checkPointerIsNotMoved")](
    e
  ) {
    this.refreshRotatePointerIcon(e);
  }

  [POINTEROVER("$pointerRect .pointer") + IF("checkPointerIsNotMoved")](e) {
    this.refreshPointerIcon(e);
  }

  [POINTEROUT("$pointerRect .pointer,.rotate-pointer") +
    IF("checkPointerIsNotMoved")]() {
    this.$commands.emit("recoverCursor");
  }

  [POINTERSTART("$pointerRect .pointer") +
    MOVE("moveVertex") +
    END("moveEndVertex")](e) {
    this.refreshPointerIcon(e);
    this.state.dragging = true;

    const num = +e.$dt.attr("data-number");
    const direction = directionType[`${num}`];

    this.initMousePoint = this.$viewport.getWorldPosition(e);
    this.state.moveType = direction;
    this.state.moveTarget = num;

    // this.$context.selection.reselect();
    this.$context.snapManager.clear();
    this.verties = this.$context.selection.verties;

    this.hasRotate = this.$context.selection.current.angle !== 0;
    this.cachedCurrentItemMatrix = this.$context.selection.current.matrix;

    // this.$config.set("set.move.control.point", true);

    this.$context.selection.startToCacheChildren();
  }

  calculateDistance(vertex, distVector, reverseMatrix) {
    // 1. 움직이는 vertex 를 구한다.
    const currentVertex = vec3.clone(vertex);
    const moveVertex = vec3.add([], currentVertex, distVector);

    // 2. dx, dy 만큼 옮긴 vertex 를 구한다.
    // - dx, dy 를 계산하기 전에 먼저 snap 을 실행한 다음 최종 dx, dy 를 구한다
    const snap = this.$context.snapManager.check(
      [moveVertex],
      3 / this.$viewport.scale
    );

    const nextVertex = vec3.add([], moveVertex, snap.dist);

    // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.
    // var currentResult = vec3.transformMat4([], currentVertex, reverseMatrix);62849
    // var nextResult = vec3.transformMat4([], nextVertex, reverseMatrix);
    const [currentResult, nextResult] = vertiesMap(
      [currentVertex, nextVertex],
      reverseMatrix
    );

    // 4. 복귀한 좌표에서 차이점을 구한다.
    const realDist = vec3.subtract([], nextResult, currentResult);

    return realDist;
  }

  calculateRealDist(item, vertexIndex, distVector) {
    return this.calculateDistance(
      item.verties[vertexIndex], // top center
      distVector,
      item.absoluteMatrixInverse
    );
  }

  moveItem(instance, lastStartVertex, newWidth, newHeight, options = {}) {
    if (instance) {
      let data = {
        x: lastStartVertex[0] + (newWidth < 0 ? newWidth : 0),
        y: lastStartVertex[1] + (newHeight < 0 ? newHeight : 0),
        width: Math.max(Math.abs(newWidth), 1),
        height: Math.max(Math.abs(newHeight), 1),
      };

      if (instance.isInFlex()) {
        delete data.x;
        delete data.y;
      } else if (instance.isInGrid()) {
        // NOOP
      }

      if (this.hasRotate) {
        // noop
      } else {
        data = objectFloor(data);
      }

      instance.reset({
        ...data,
        ...options,
      });
    }
  }

  moveDirectionVertex(
    item,
    newWidth,
    newHeight,
    direction,
    directionNewVector,
    options = {}
  ) {
    // 중심점 좌표를 구한다.
    const center = vec3.subtract(
      [],
      TransformOrigin.scale(item.originalTransformOrigin, newWidth, newHeight),
      directionNewVector
    );

    // 새로운 중심점 좌표를 구한다.
    const newOffsetInverse = calculateMatrixInverse(
      mat4.fromTranslation([], directionNewVector),
      mat4.fromTranslation([], center),
      item.itemMatrix,
      mat4.fromTranslation([], vec3.negate([], center))
    );

    // 마지막 offset x, y 를 구해보자.
    const view = calculateMatrix(
      // 반대방향 벡터 기준으로
      item.directionMatrix[direction],
      newOffsetInverse
    );

    const lastStartVertex = mat4.getTranslation([], view);

    this.moveItem(
      this.$model.get(item.id),
      lastStartVertex,
      newWidth,
      newHeight,
      options
    );
  }

  /**
   *
   * width, height 를 변경한다.
   *
   * shiftKey : width, height 를 동일한 비율로 변경한다.
   * metaKey: width, height 를 width 로 맞춰서 변경한다.
   * altKey: scale  을 2배로 변경한다.
   *
   * @param {vec3} distVector
   */
  moveBottomRightVertex(distVector) {
    const { shiftKey, altKey, metaKey } = this.$config.get("bodyEvent");
    const item = this.cachedCurrentItemMatrix;

    if (item) {
      // 부모를 기준으로 실제 얼만큼 움직였는지를 찾는다.
      let [realDx, realDy] = this.calculateRealDist(item, 2, distVector);

      let directionNewVector = vec3.fromValues(0, 0, 0);
      // alt key 는 확장이기 때문에 움직임도 2배로 늘어난다.
      if (altKey) {
        realDx = realDx * 2;
        realDy = realDy * 2;
      }

      if (shiftKey) {
        realDy = (realDx * item.height) / item.width;
      }

      // 변형되는 넓이 높이 구하기
      const newWidth = item.width + realDx;
      const newHeight = metaKey ? newWidth : item.height + realDy;

      if (altKey) {
        directionNewVector = vec3.fromValues(realDx / 2, realDy / 2, 0);
      }

      // item 의 크기를 업데이트 했으니 그때마다 갱신한다.
      this.moveDirectionVertex(
        item,
        newWidth,
        newHeight,
        "to top left",
        directionNewVector,
        {
          resizingVertical: ResizingMode.FIXED,
          resizingHorizontal: ResizingMode.FIXED,
        }
      );

      this.updateGridArea(item);
    }
  }

  moveTopRightVertex(distVector) {
    const { shiftKey, altKey, metaKey } = this.$config.get("bodyEvent");
    const item = this.cachedCurrentItemMatrix;
    if (item) {
      let [realDx, realDy] = this.calculateRealDist(item, 1, distVector);

      if (altKey) {
        realDx = realDx * 2;
        realDy = realDy * 2;
      }

      if (shiftKey) {
        realDy = -((realDx * item.height) / item.width);
      }

      // 변형되는 넓이 높이 구하기
      const newWidth = item.width + realDx;
      const newHeight = metaKey ? newWidth : item.height - realDy;

      let directionNewVector = vec3.fromValues(0, newHeight, 0);
      if (altKey) {
        directionNewVector = vec3.fromValues(
          realDx / 2,
          newHeight + realDy / 2,
          0
        );
      }

      this.moveDirectionVertex(
        item,
        newWidth,
        newHeight,
        "to bottom left",
        directionNewVector,
        {
          resizingVertical: ResizingMode.FIXED,
          resizingHorizontal: ResizingMode.FIXED,
        }
      );

      this.updateGridArea(item);
    }
  }

  moveTopLeftVertex(distVector) {
    const { shiftKey, altKey, metaKey } = this.$config.get("bodyEvent");
    const item = this.cachedCurrentItemMatrix;
    if (item) {
      let [realDx, realDy] = this.calculateRealDist(item, 0, distVector);

      if (altKey) {
        realDx = realDx * 2;
        realDy = realDy * 2;
      }

      if (shiftKey) {
        realDy = (realDx * item.height) / item.width;
      }

      // 변형되는 넓이 높이 구하기
      const newWidth = item.width - realDx;
      const newHeight = metaKey ? newWidth : item.height - realDy;

      let directionNewVector = vec3.fromValues(newWidth, newHeight, 0);

      if (altKey) {
        directionNewVector = vec3.fromValues(
          newWidth + realDx / 2,
          newHeight + realDy / 2,
          0
        );
      }

      this.moveDirectionVertex(
        item,
        newWidth,
        newHeight,
        "to bottom right",
        directionNewVector,
        {
          resizingHorizontal: ResizingMode.FIXED,
          resizingVertical: ResizingMode.FIXED,
        }
      );

      this.updateGridArea(item);
    }
  }

  moveTopVertex(distVector) {
    const { altKey } = this.$config.get("bodyEvent");
    const item = this.cachedCurrentItemMatrix;
    if (item) {
      let [, realDy] = this.calculateRealDist(item, 0, distVector);

      if (altKey) {
        realDy = realDy * 2;
      }

      // 변형되는 넓이 높이 구하기
      const newWidth = item.width;
      const newHeight = item.height - realDy;

      let directionNewVector = vec3.fromValues(newWidth / 2, newHeight, 0);

      if (altKey) {
        directionNewVector = vec3.fromValues(
          newWidth / 2,
          newHeight + realDy / 2,
          0
        );
      }

      this.moveDirectionVertex(
        item,
        newWidth,
        newHeight,
        "to bottom",
        directionNewVector,
        {
          resizingVertical: ResizingMode.FIXED,
        }
      );

      this.updateGridArea(item);
    }
  }

  moveBottomVertex(distVector) {
    const { altKey } = this.$config.get("bodyEvent");
    const item = this.cachedCurrentItemMatrix;
    if (item) {
      let [, realDy] = this.calculateRealDist(item, 3, distVector);

      if (altKey) {
        realDy = realDy * 2;
      }

      // 변형되는 넓이 높이 구하기
      const newWidth = item.width;
      const newHeight = item.height + realDy;

      let directionNewVector = vec3.fromValues(newWidth / 2, 0, 0);

      if (altKey) {
        directionNewVector = vec3.fromValues(newWidth / 2, realDy / 2, 0);
      }

      this.moveDirectionVertex(
        item,
        newWidth,
        newHeight,
        "to top",
        directionNewVector,
        {
          resizingVertical: ResizingMode.FIXED,
        }
      );

      this.updateGridArea(item);
    }
  }

  moveRightVertex(distVector) {
    const { shiftKey, altKey, metaKey } = this.$config.get("bodyEvent");
    const item = this.cachedCurrentItemMatrix;
    if (item) {
      let [realDx] = this.calculateRealDist(item, 1, distVector);

      if (altKey) {
        realDx = realDx * 2;
      }

      // 변형되는 넓이 높이 구하기
      const newWidth = item.width + realDx;
      let newHeight = item.height;

      if (metaKey) {
        newHeight = newWidth;
      } else if (shiftKey) {
        newHeight = item.height * (1 + realDx / item.width);
      }

      let directionNewVector = vec3.fromValues(0, newHeight / 2, 0);

      if (altKey) {
        directionNewVector = vec3.fromValues(realDx / 2, newHeight / 2, 0);
      }

      this.moveDirectionVertex(
        item,
        newWidth,
        newHeight,
        "to left",
        directionNewVector,
        {
          resizingHorizontal: ResizingMode.FIXED,
        }
      );

      this.updateGridArea(item);
    }
  }

  moveLeftVertex(distVector) {
    const { shiftKey, altKey, metaKey } = this.$config.get("bodyEvent");
    const item = this.cachedCurrentItemMatrix;
    if (item) {
      let [realDx] = this.calculateRealDist(item, 0, distVector);

      if (altKey) {
        realDx = realDx * 2;
      }

      // 변형되는 넓이 높이 구하기
      const newWidth = item.width - realDx;
      let newHeight = item.height;

      if (metaKey) {
        newHeight = newWidth;
      } else if (shiftKey) {
        newHeight = item.height * (1 - realDx / item.width);
      }

      let directionNewVector = vec3.fromValues(newWidth, newHeight / 2, 0);

      if (altKey) {
        directionNewVector = vec3.fromValues(
          newWidth + realDx / 2,
          newHeight / 2,
          0
        );
      }

      this.moveDirectionVertex(
        item,
        newWidth,
        newHeight,
        "to right",
        directionNewVector,
        {
          resizingHorizontal: ResizingMode.FIXED,
        }
      );

      this.updateGridArea(item);
    }
  }

  moveBottomLeftVertex(distVector) {
    const { shiftKey, altKey, metaKey } = this.$config.get("bodyEvent");
    const item = this.cachedCurrentItemMatrix;
    if (item) {
      let [realDx, realDy] = this.calculateRealDist(item, 3, distVector);

      if (altKey) {
        realDx = realDx * 2;
        realDy = realDy * 2;
      }

      if (shiftKey) {
        realDy = -((realDx * item.height) / item.width);
      }

      // 변형되는 넓이 높이 구하기
      const newWidth = item.width - realDx;
      const newHeight = metaKey ? newWidth : item.height + realDy;

      let directionNewVector = vec3.fromValues(newWidth, 0, 0);
      if (altKey) {
        directionNewVector = vec3.fromValues(
          newWidth + realDx / 2,
          realDy / 2,
          0
        );
      }

      this.moveDirectionVertex(
        item,
        newWidth,
        newHeight,
        "to top right",
        directionNewVector,
        {
          resizingVertical: ResizingMode.FIXED,
          resizingHorizontal: ResizingMode.FIXED,
        }
      );

      this.updateGridArea(item);
    }
  }

  moveVertex() {
    const targetMousePoint = this.$viewport.getWorldPosition();
    const distVector = vec3.floor(
      [],
      vec3.subtract([], targetMousePoint, this.initMousePoint)
    );

    if (this.state.moveType === "to top left") {
      // 1
      this.moveTopLeftVertex(distVector);
    } else if (this.state.moveType === "to top") {
      // 11
      this.moveTopVertex(distVector);
    } else if (this.state.moveType === "to right") {
      // 12
      this.moveRightVertex(distVector);
    } else if (this.state.moveType === "to bottom") {
      // 13
      this.moveBottomVertex(distVector);
    } else if (this.state.moveType === "to left") {
      // 14
      this.moveLeftVertex(distVector);
    } else if (this.state.moveType === "to top right") {
      // 2
      this.moveTopRightVertex(distVector);
    } else if (this.state.moveType === "to bottom right") {
      // 3
      this.moveBottomRightVertex(distVector);
    } else if (this.state.moveType === "to bottom left") {
      // 4
      this.moveBottomLeftVertex(distVector);
    }

    this.$context.selection.recoverChildren();

    const current = this.$context.selection.current;
    if (current.isInGrid()) {
      this.$commands.emit(
        "setAttribute",
        this.$context.selection.pack(
          "x",
          "y",
          "angle",
          "width",
          "height",
          "resizingHorizontal",
          "resizingVertical",
          "grid-column-start",
          "grid-column-end",
          "grid-row-start",
          "grid-row-end"
        )
      );
    } else {
      this.$commands.emit(
        "setAttribute",
        this.$context.selection.pack(
          "x",
          "y",
          "angle",
          "width",
          "height",
          "resizingHorizontal",
          "resizingVertical"
        )
      );
    }

    this.state.dragging = true;

    this.makeSelectionTool();
  }

  /**
   * px 로 된 위치를 기반으로 Grid Area 영역의 위치로 다시 맞춘다.
   *
   * @param {*} item
   */
  updateGridArea() {
    return GridLayoutEngine.updateGridArea(
      this.$context.selection.current,
      this.$context.selection.gridInformation,
      this.$context.viewport.scale
    );
  }

  moveEndVertex() {
    this.state.dragging = false;
    this.$commands.emit("recoverCursor");
    this.$context.selection.reselect();
    // this.$config.set("set.move.control.point", false);

    this.nextTick(() => {
      // recoverChildren 을 통해서 부모에서 변경된 크기에 따라 자식을 다시 재배치 한다.
      this.$context.selection.recoverChildren();

      if (this.$context.selection.current.isInGrid()) {
        this.$commands.executeCommand(
          "setAttribute",
          "move selection pointer",
          this.$context.selection.pack(
            "x",
            "y",
            "angle",
            "width",
            "height",
            "resizingHorizontal",
            "resizingVertical",
            "grid-column-start",
            "grid-column-end",
            "grid-row-start",
            "grid-row-end"
          )
        );
      } else {
        this.$commands.executeCommand(
          "setAttribute",
          "move selection pointer",
          this.$context.selection.pack(
            "x",
            "y",
            "angle",
            "width",
            "height",
            "resizingHorizontal",
            "resizingVertical"
          )
        );
      }

      this.$commands.emit("recoverBooleanPath");
    });
  }

  show() {
    this.$el.show();
    this.state.show = true;
  }

  hide() {
    this.$el.hide();
    this.state.show = false;
  }

  initSelectionTool() {
    if (this.$el.isShow() && this.$context.selection.isOne === false) {
      this.hide();
    } else if (this.$el.isHide() && this.$context.selection.isOne) {
      this.show();
    }

    this.makeSelectionTool();
  }

  makeSelectionTool() {
    this.renderPointers();
  }

  getRateDistance(startVetex, endVertex, dist = 0) {
    return vec3.lerp(
      [],
      startVetex,
      endVertex,
      (vec3.dist(startVetex, endVertex) + dist) /
        vec3.dist(startVetex, endVertex)
    );
  }

  /**
   * 선택영역 컴포넌트 그리기
   */
  renderPointers() {
    if (
      this.$context.selection.isEmpty ||
      this.$config.true("set.move.control.point")
    ) {
      this.refs.$pointerRect.empty();
      return;
    }

    const verties = this.$context.selection.verties;

    if (vec3.dist(verties[0], verties[1]) === 0) {
      return;
    }

    const screenVerties = this.$viewport.applyVerties(verties);

    this.state.renderPointerList = [
      screenVerties,
      [
        this.getRateDistance(screenVerties[4], screenVerties[0], 20),
        this.getRateDistance(screenVerties[4], screenVerties[1], 20),
        this.getRateDistance(screenVerties[4], screenVerties[2], 20),
        this.getRateDistance(screenVerties[4], screenVerties[3], 20),
      ],
    ];

    const pointers = this.createRenderPointers(...this.state.renderPointerList);

    if (pointers) {
      const { line, parentRect, point, size, visiblePath } = pointers;
      this.refs.$pointerRect.updateDiff(
        line + parentRect + point + size + visiblePath
      );
    }
  }

  createPointer(pointer, number, rotate) {
    return /*html*/ `
        <div class='pointer' data-number="${number}" data-pointer="${pointer}" style="transform: translate3d( calc(${
      pointer[0]
    }px - 50%), calc(${pointer[1]}px - 50%), 0px) rotateZ(${
      rotate || "0deg"
    })" ></div>
        `;
  }

  createPointerSide(pointer, number, rotate, width, height) {
    return /*html*/ `
        <div class='pointer' data-number="${number}" data-pointer="${pointer}" style="width: ${width}px; height: ${height}px;transform: translate3d( calc(${
      pointer[0]
    }px - 50%), calc(${pointer[1]}px - 50%), 0px) rotateZ(${
      rotate || "0deg"
    })" ></div>
        `;
  }

  createRotatePointer(pointer, number) {
    if (pointer.length === 0) return "";

    if (number < 4) {
      return /*html*/ `
            <div class='rotate-pointer no-fill' data-number="${number}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px) scale(1.8);" ></div>
            `;
    }

    return /*html*/ `
        <div class='rotate-pointer' data-number="${number}" style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${pointer[1]}px - 50%), 0px)" ></div>
        `;
  }

  createPointerRect(pointers, rotatePointer = undefined) {
    if (pointers.length === 0) return "";

    const current = this.$context.selection.current;
    const isArtBoard = current && current.is("artboard");
    let line = "";
    if (!isArtBoard && rotatePointer) {
      const centerPointer = vec3.lerp([], pointers[0], pointers[1], 0.5);
      line += `
                M ${centerPointer[0]},${centerPointer[1]} 
                L ${rotatePointer[0]},${rotatePointer[1]} 
            `;
    }

    return /*html*/ `
        <svg class='line' overflow="visible">
            <path 
                d="
                    M ${pointers[0][0]}, ${pointers[0][1]} 
                    L ${pointers[1][0]}, ${pointers[1][1]} 
                    L ${pointers[2][0]}, ${pointers[2][1]} 
                    L ${pointers[3][0]}, ${pointers[3][1]} 
                    L ${pointers[0][0]}, ${pointers[0][1]}
                    ${line}
                    Z
                " />
        </svg>`;
  }

  createParentRect(pointers = []) {
    if (pointers.length === 0) return "";

    return /*html*/ `
        <svg class='line' overflow="visible">
            <path 
                d="
                    M ${pointers[0][0]}, ${pointers[0][1]} 
                    L ${pointers[1][0]}, ${pointers[1][1]} 
                    L ${pointers[2][0]}, ${pointers[2][1]} 
                    L ${pointers[3][0]}, ${pointers[3][1]} 
                    L ${pointers[0][0]}, ${pointers[0][1]}
                    Z
                " 
                stroke="red"
                />
        </svg>`;
  }

  createSize(pointers) {
    const top = vec3.lerp([], pointers[0], pointers[1], 0.5);
    const right = vec3.lerp([], pointers[1], pointers[2], 0.5);
    const bottom = vec3.lerp([], pointers[2], pointers[3], 0.5);
    const left = vec3.lerp([], pointers[3], pointers[0], 0.5);

    const list = [
      { start: top, end: bottom },
      { start: right, end: left },
      { start: bottom, end: top },
      { start: left, end: right },
    ].map((it, index) => {
      return { index, data: it };
    });

    list.sort((a, b) => {
      return a.data.start[1] > b.data.start[1] ? -1 : 1;
    });

    const item = list[0];

    const newPointer = vec3.lerp(
      [],
      item.data.end,
      item.data.start,
      1 + 16 / vec3.dist(item.data.start, item.data.end)
    );
    const width = this.$context.selection.current.width;
    const height = this.$context.selection.current.height;
    const diff = vec3.subtract([], item.data.start, item.data.end);
    const angle = calculateAngle360(diff[0], diff[1]) + 90;

    const widthPx = round(width, 100);
    const heightPx = round(height, 100);

    let text =
      widthPx === heightPx
        ? `WH: ${widthPx}`
        : `${round(width, 100)} x ${round(height, 100)}`;

    if (this.state.isRotate) {
      text = `${round(this.$context.selection.current.angle, 100)}°`;
    }

    return /*html*/ `
            <div 
                data-layout="${this.$context.selection.current.layout}"
                class='size-pointer' 
                style="transform: translate3d( calc(${newPointer[0]}px - 50%), calc(${newPointer[1]}px - 50%), 0px) rotateZ(${angle}deg)" >
               ${text}
            </div>
        `;
  }

  createVisiblePath() {
    const current = this.$context.selection.current;
    if (!current) return "";

    if (!current.isBooleanItem) {
      return "";
    }

    const newPath = current.absolutePath();
    newPath.transformMat4(this.$viewport.matrix);

    return /*html*/ `
        <svg class='line' overflow="visible">
            <path
                d="${newPath.d}"
                stroke="red"
                stroke-width="2"
                fill="none"
                />
        </svg>
        `;
  }

  removeNaN(value) {
    return value.replace(/NaN/g, "0");
  }

  createRenderPointers(pointers, selectionPointers) {
    const current = this.$context.selection.current;

    if (current && current.is("text")) {
      if (current.width === 0 && current.height === 0) {
        return;
      }
    }

    //TODO: 여기서는 법선벡터를 구하게 되면 식이 훨씬 간단해진다.
    const rotate = Length.deg(current.nestedAngle).round(1000);

    // const rotatePointer = getRotatePointer(pointers, 34);
    const dist = vec3.dist(pointers[0], pointers[2]);
    const width = vec3.dist(pointers[0], pointers[1]);
    const height = vec3.dist(pointers[0], pointers[3]);

    return {
      line: this.createPointerRect(pointers),
      size: this.createSize(pointers),
      parentRect: "", //this.createParentRect(parentPointers),
      visiblePath: this.createVisiblePath(),
      point: [
        // 4 모서리에서도 rotate 가 가능하도록 맞춤
        this.createRotatePointer(selectionPointers[0], 0),
        this.createRotatePointer(selectionPointers[1], 1),
        this.createRotatePointer(selectionPointers[2], 2),
        this.createRotatePointer(selectionPointers[3], 3),
        // isArtBoard ? undefined : this.createRotatePointer(rotatePointer, 4, 'center center'),

        dist < 20
          ? undefined
          : this.createPointerSide(
              vec3.lerp([], pointers[0], pointers[1], 0.5),
              11,
              rotate,
              width,
              5
            ),
        dist < 20
          ? undefined
          : this.createPointerSide(
              vec3.lerp([], pointers[1], pointers[2], 0.5),
              12,
              rotate,
              5,
              height
            ),
        dist < 20
          ? undefined
          : this.createPointerSide(
              vec3.lerp([], pointers[2], pointers[3], 0.5),
              13,
              rotate,
              width,
              5
            ),
        dist < 20
          ? undefined
          : this.createPointerSide(
              vec3.lerp([], pointers[3], pointers[0], 0.5),
              14,
              rotate,
              5,
              height
            ),
        this.createPointer(pointers[0], 1, rotate),
        this.createPointer(pointers[1], 2, rotate),
        this.createPointer(pointers[2], 3, rotate),
        this.createPointer(pointers[3], 4, rotate),

        // center position
        this.createPointer(pointers[4], 5, rotate),
      ].join(""),
    };
  }

  checkShow() {
    if (this.$modeView.isCurrentMode(ViewModeType.CanvasView) === false) {
      return false;
    }

    if (this.state.show && this.$context.selection.isOne) {
      return true;
    }

    return false;
  }

  [SUBSCRIBE("hideSelectionToolView")]() {
    this.hide();
  }
}
