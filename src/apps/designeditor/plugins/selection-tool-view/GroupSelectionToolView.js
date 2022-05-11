import { mat4, vec3 } from "gl-matrix";

import {
  POINTERSTART,
  POINTEROUT,
  POINTEROVER,
  IF,
  PREVENT,
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

import { getRotatePointer, rectToVerties } from "elf/core/collision";
import {
  calculateAngle,
  calculateAngle360,
  calculateAngleForVec3,
  calculateMatrix,
  calculateMatrixInverse,
  calculateRotationOriginMat4,
  round,
  vertiesMap,
} from "elf/core/math";
import { TransformOrigin } from "elf/editor/property-parser/TransformOrigin";
import { ViewModeType } from "elf/editor/types/editor";
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

const SelectionToolEvent = class extends EditorElement {
  checkViewMode() {
    return this.$modeView.isCurrentMode(ViewModeType.CanvasView);
  }

  [SUBSCRIBE(REFRESH_SELECTION, REFRESH_SELECTION_TOOL) +
    IF("checkViewMode")]() {
    if (this.$context.selection.isMany) {
      this.initSelectionTool();
    } else {
      this.hide();
    }
  }

  [SUBSCRIBE(UPDATE_VIEWPORT) + IF("checkViewMode")]() {
    if (this.$context.selection.isMany) {
      this.initSelectionTool();
    }
  }
};

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉
 */
export default class GroupSelectionToolView extends SelectionToolEvent {
  template() {
    return /*html*/ `
            <div class='elf--selection-view group-selection-view' ref='$selectionView'  style='display:none' >
                <div class='pointer-rect' ref='$pointerRect'></div>        
            </div>
        `;
  }

  toggleEditingPath(isEditingPath) {
    this.refs.$selectionView.toggleClass("editing-path", isEditingPath);
  }

  [POINTERSTART("$pointerRect .rotate-pointer") +
    MOVE("rotateVertex") +
    END("rotateEndVertex")](e) {
    this.state.moveType = "rotate";
    this.initMousePoint = this.$viewport.getWorldPosition(e);

    // cache matrix
    // this.$context.selection.reselect();
    this.verties = this.groupItem.verties;
    this.rotateTargetNumber = +e.$dt.attr("data-number");

    this.refreshRotatePointerIcon();
    this.state.dragging = false;
    this.state.isRotate = true;
    this.$config.set("set.move.control.point", true);
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

    if (this.$config.get("bodyEvent").shiftKey) {
      distAngle = distAngle - (distAngle % this.$config.get("fixed.angle"));
    }

    // 실제 움직인 angle
    this.localAngle = this.angle + distAngle;

    this.groupItem.reset({
      angle: this.localAngle,
    });

    const selectionMatrix = calculateRotationOriginMat4(
      distAngle,
      this.verties[4]
    );

    // angle 을 움직였으니 어떻게 움직이지 ?
    let cachedItemMatrices = this.$context.selection.cachedItemMatrices;

    // 그룹이긴 하나 실제로 하나의 선택만 있을 때는 회전할 때 자식을 같이 회전하지 않도록 한다.
    if (this.$context.selection.length === 1) {
      cachedItemMatrices = cachedItemMatrices.filter(
        (it) => it.id === this.$context.selection.current.id
      );
    }

    cachedItemMatrices.forEach((item) => {
      const newVerties = vertiesMap(
        item.verties,
        mat4.multiply([], item.parentMatrixInverse, selectionMatrix)
      ); // 아이템을 먼저 그룹으로 회전을 하고

      const rotatePointer = getRotatePointer(newVerties, 34);

      var lastAngle =
        calculateAngle(
          rotatePointer[0] - newVerties[4][0],
          rotatePointer[1] - newVerties[4][1]
        ) - 270;

      const newTranslate = vec3.transformMat4(
        [],
        newVerties[0],
        calculateRotationOriginMat4(-lastAngle, newVerties[4])
      );

      const instance = this.$model.get(item.id);

      if (instance) {
        instance.reset({
          x: newTranslate[0],
          y: newTranslate[1],
          angle: lastAngle,
        });
      }
    });

    this.state.dragging = true;

    this.$commands.emit(
      "setAttribute",
      this.$context.selection.pack("x", "y", "width", "height", "angle")
    );

    this.renderPointers();
  }

  rotateEndVertex() {
    this.state.dragging = false;
    this.state.isRotate = false;
    this.$commands.emit("recoverCursor");
    this.$config.set("set.move.control.point", false);

    // 개별 verties 의 캐쉬를 다시 한다.
    this.$context.selection.reselect();
    this.initMatrix(true);
    this.nextTick(() => {
      this.$commands.executeCommand(
        "setAttribute",
        "rotate selection pointer",
        this.$context.selection.pack("x", "y", "width", "height", "angle")
      );
    });
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

  [POINTEROVER("$pointerRect .rotate-pointer") +
    IF("checkPointerIsNotMoved") +
    PREVENT](e) {
    this.refreshRotatePointerIcon(e);
  }

  [POINTEROVER("$pointerRect .pointer") +
    IF("checkPointerIsNotMoved") +
    PREVENT](e) {
    this.refreshPointerIcon(e);
  }

  [POINTEROUT("$pointerRect .pointer,.rotate-pointer") +
    IF("checkPointerIsNotMoved") +
    PREVENT]() {
    this.$commands.emit("recoverCursor");
  }

  [POINTERSTART("$pointerRect .pointer") +
    PREVENT +
    MOVE("moveVertex") +
    END("moveEndVertex")](e) {
    this.refreshPointerIcon(e);
    this.state.dragging = true;
    const num = +e.$dt.attr("data-number");
    this.state.moveType = directionType[`${num}`];
    this.initMousePoint = this.$viewport.getWorldPosition(e);

    // cache matrix
    // this.$context.selection.doCache();
    this.$context.selection.reselect();
    this.state.dragging = false;
    this.initMatrix(true);
    this.cachedGroupItem = this.groupItem.matrix;
    this.$config.set("set.move.control.point", true);

    // 자식 아이템을 캐슁한다.
    // 시작할때 한번만 캐슁해야한다.
    this.$context.selection.startToCacheChildren();
  }

  calculateNewOffsetMatrixInverse(
    vertextOffset,
    width,
    height,
    origin,
    itemMatrix
  ) {
    const center = vec3.add(
      [],
      TransformOrigin.scale(origin, width, height),
      vec3.negate([], vertextOffset)
    );

    return calculateMatrixInverse(
      mat4.fromTranslation([], vertextOffset),
      mat4.fromTranslation([], center),
      itemMatrix,
      mat4.fromTranslation([], vec3.negate([], center))
    );
  }

  calculateDistance(vertext, distVector, reverseMatrix) {
    // 1. 움직이는 vertext 를 구한다.
    const currentVertex = vec3.clone(vertext);

    // 2. dx, dy 만큼 옮긴 vertext 를 구한다.
    // - dx, dy 를 계산하기 전에 먼저 snap 을 실행한 다음 최종 dx, dy 를 구한다
    const snap = this.$context.snapManager.check(
      [vec3.add([], currentVertex, distVector)],
      3 / this.$viewport.scale
    );

    const nextVertex = vec3.add(
      [],
      currentVertex,
      vec3.add([], distVector, snap.dist)
    );

    // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.
    var currentResult = vec3.transformMat4([], currentVertex, reverseMatrix);
    var nextResult = vec3.transformMat4([], nextVertex, reverseMatrix);

    // 4. 복귀한 좌표에서 차이점을 구한다.
    const realDist = vec3.round(
      [],
      vec3.subtract([], nextResult, currentResult)
    );

    return realDist;
  }

  calculateRealDist(item, vertextIndex, distVector) {
    return this.calculateDistance(
      item.verties[vertextIndex], // top center
      distVector,
      item.absoluteMatrixInverse
    );
  }

  moveGroupItem(lastStartVertex, newWidth, newHeight) {
    this.groupItem.reset({
      x: lastStartVertex[0] + (newWidth < 0 ? newWidth : 0),
      y: lastStartVertex[1] + (newHeight < 0 ? newHeight : 0),
      width: Math.abs(newWidth),
      height: Math.abs(newHeight),
    });
  }

  moveItemForGroup(it, newVerties, realDx = 0, realDy = 0) {
    const transformViewInverse = calculateMatrixInverse(
      mat4.fromTranslation([], newVerties[4]),
      it.itemMatrix,
      mat4.fromTranslation([], vec3.negate([], newVerties[4]))
    );

    const [newX, newY] = vec3.transformMat4(
      [],
      newVerties[0],
      transformViewInverse
    );
    const newWidth = vec3.distance(newVerties[0], newVerties[1]);
    const newHeight = vec3.distance(newVerties[0], newVerties[3]);

    const instance = this.$model.get(it.id);

    if (instance) {
      instance.reset({
        x: newX + realDx,
        y: newY + realDy,
        width: Math.max(Math.abs(newWidth), 1),
        height: Math.max(Math.abs(newHeight), 1),
      });
    }
  }

  recoverItemForGroup(groupItem, scaleX, scaleY, realDx = 0, realDy = 0) {
    const absoluteMatrix = groupItem.absoluteMatrix;
    const absoluteMatrixInverse = groupItem.absoluteMatrixInverse;

    this.$context.selection.cachedItemMatrices.forEach((it) => {
      const localView = calculateMatrix(
        it.parentMatrixInverse, // 5. 해당 객체의 parent 를 기준으로 좌표를 만들면 된다.
        absoluteMatrix, // 4. 원래의 좌표로 다시 만들고
        mat4.fromTranslation([], [realDx, realDy, 0]), // 3. dx, dy 가 - 일 경우 실제로 움직이고
        mat4.fromScaling([], [scaleX, scaleY, 1]), // 2. scale 을 먼저 실행한다음
        absoluteMatrixInverse // 1. 기본 좌표로 돌리고
      );

      const newVerties = vertiesMap(it.verties, localView);

      this.moveItemForGroup(it, newVerties);
    });
  }

  moveBottomRightVertex(distVector) {
    const groupItem = this.cachedGroupItem;

    let [realDx, realDy] = this.calculateRealDist(groupItem, 2, distVector);

    if (this.$config.get("bodyEvent").shiftKey) {
      realDy = (realDx * groupItem.height) / groupItem.width;
    }

    // 변형되는 넓이 높이 구하기
    const newWidth = groupItem.width + realDx;
    const newHeight = groupItem.height + realDy;

    this.moveDirectionVertex(
      groupItem,
      0,
      0,
      newWidth,
      newHeight,
      "to top left",
      [0, 0, 0]
    );
  }

  moveTopRightVertex(distVector) {
    const groupItem = this.cachedGroupItem;

    let [realDx, realDy] = this.calculateRealDist(groupItem, 1, distVector);

    if (this.$config.get("bodyEvent").shiftKey) {
      realDy = -((realDx * groupItem.height) / groupItem.width);
    }

    // 변형되는 넓이 높이 구하기
    const newWidth = groupItem.width + realDx;
    const newHeight = groupItem.height - realDy;

    this.moveDirectionVertex(
      groupItem,
      0,
      realDy,
      newWidth,
      newHeight,
      "to bottom left",
      [0, newHeight, 0]
    );
  }

  moveDirectionVertex(
    groupItem,
    realDx,
    realDy,
    newWidth,
    newHeight,
    direction,
    directionNewVector
  ) {
    const scaleX = newWidth / groupItem.width;
    const scaleY = newHeight / groupItem.height;

    if (scaleX >= 0 && scaleY >= 0) {
      // 마지막 offset x, y 를 구해보자.
      const view = calculateMatrix(
        groupItem.directionMatrix[direction],
        this.calculateNewOffsetMatrixInverse(
          directionNewVector,
          newWidth,
          newHeight,
          groupItem.originalTransformOrigin,
          groupItem.itemMatrix
        )
      );

      const lastStartVertex = mat4.getTranslation([], view);

      this.moveGroupItem(lastStartVertex, newWidth, newHeight);

      this.recoverItemForGroup(groupItem, scaleX, scaleY, realDx, realDy);
    }
  }

  moveTopVertex(distVector) {
    const groupItem = this.cachedGroupItem;

    const [, realDy] = this.calculateRealDist(groupItem, 0, distVector);

    // 변형되는 넓이 높이 구하기
    const newWidth = groupItem.width;
    const newHeight = groupItem.height - realDy;

    this.moveDirectionVertex(
      groupItem,
      0,
      realDy,
      newWidth,
      newHeight,
      "to bottom",
      [newWidth / 2, newHeight, 0]
    );
  }

  moveBottomVertex(distVector) {
    const groupItem = this.cachedGroupItem;

    const [, realDy] = this.calculateRealDist(groupItem, 2, distVector);

    // 변형되는 넓이 높이 구하기
    const newWidth = groupItem.width;
    const newHeight = groupItem.height + realDy;

    this.moveDirectionVertex(groupItem, 0, 0, newWidth, newHeight, "to top", [
      newWidth / 2,
      0,
      0,
    ]);
  }

  moveTopLeftVertex(distVector) {
    const groupItem = this.cachedGroupItem;

    let [realDx, realDy] = this.calculateRealDist(groupItem, 0, distVector);

    if (this.$config.get("bodyEvent").shiftKey) {
      realDy = (realDx * groupItem.height) / groupItem.width;
    }

    // 변형되는 넓이 높이 구하기
    const newWidth = groupItem.width - realDx;
    const newHeight = groupItem.height - realDy;

    this.moveDirectionVertex(
      groupItem,
      realDx,
      realDy,
      newWidth,
      newHeight,
      "to bottom right",
      [newWidth, newHeight, 0]
    );
  }

  moveLeftVertex(distVector) {
    const groupItem = this.cachedGroupItem;

    const [realDx] = this.calculateRealDist(groupItem, 0, distVector);

    // 변형되는 넓이 높이 구하기
    const newWidth = groupItem.width - realDx;
    const newHeight = groupItem.height;

    this.moveDirectionVertex(
      groupItem,
      realDx,
      0,
      newWidth,
      newHeight,
      "to right",
      [newWidth, newHeight / 2, 0]
    );
  }

  moveRightVertex(distVector) {
    const groupItem = this.cachedGroupItem;

    const [realDx] = this.calculateRealDist(groupItem, 2, distVector);

    // 변형되는 넓이 높이 구하기
    const newWidth = groupItem.width + realDx;
    const newHeight = groupItem.height;

    this.moveDirectionVertex(groupItem, 0, 0, newWidth, newHeight, "to left", [
      0,
      newHeight / 2,
      0,
    ]);
  }

  moveBottomLeftVertex(distVector) {
    const groupItem = this.cachedGroupItem;

    let [realDx, realDy] = this.calculateRealDist(groupItem, 3, distVector);

    if (this.$config.get("bodyEvent").shiftKey) {
      realDy = -((realDx * groupItem.height) / groupItem.width);
    }

    // 변형되는 넓이 높이 구하기
    const newWidth = groupItem.width - realDx;
    const newHeight = groupItem.height + realDy;

    this.moveDirectionVertex(
      groupItem,
      realDx,
      0,
      newWidth,
      newHeight,
      "to top right",
      [newWidth, 0, 0]
    );
  }

  moveVertex() {
    const targetMousePoint = this.$viewport.getWorldPosition();
    const distVector = vec3.floor(
      [],
      vec3.subtract([], targetMousePoint, this.initMousePoint)
    );

    if (this.state.moveType === "to bottom right") {
      // 2
      this.moveBottomRightVertex(distVector);
    } else if (this.state.moveType === "to top right") {
      this.moveTopRightVertex(distVector);
    } else if (this.state.moveType === "to top left") {
      this.moveTopLeftVertex(distVector);
    } else if (this.state.moveType === "to bottom left") {
      this.moveBottomLeftVertex(distVector);
    } else if (this.state.moveType === "to top") {
      this.moveTopVertex(distVector);
    } else if (this.state.moveType === "to left") {
      this.moveLeftVertex(distVector);
    } else if (this.state.moveType === "to right") {
      this.moveRightVertex(distVector);
    } else if (this.state.moveType === "to bottom") {
      this.moveBottomVertex(distVector);
    }

    this.$commands.emit(
      "setAttribute",
      this.$context.selection.pack("x", "y", "width", "height")
    );

    this.renderPointers();

    this.state.dragging = true;
  }

  moveEndVertex() {
    this.state.dragging = false;
    this.$commands.emit("recoverCursor");
    this.$config.set("set.move.control.point", false);
    this.$context.selection.reselect();
    this.initMatrix(true);
    this.nextTick(() => {
      this.$context.selection.recoverChildren();

      this.$commands.executeCommand(
        "setAttribute",
        "move selection pointer",
        this.$context.selection.pack("x", "y", "width", "height")
      );

      this.$commands.emit("recoverBooleanPath");
    });
  }

  show() {
    this.$el.show();
    this.state.show = true;
  }

  hide() {
    if (this.state.show) {
      this.$el.hide();
      this.state.show = false;
    }
  }

  initSelectionTool() {
    if (this.$el.isHide() && this.$context.selection.isMany) {
      this.show();
    } else {
      if (this.$el.isShow() && this.$context.selection.isMany === false)
        this.hide();
    }

    this.initMatrix();

    this.makeSelectionTool();
  }

  get item() {
    const verties = this.verties || rectToVerties(0, 0, 0, 0);

    if (!this.state.groupSelectionView) {
      this.state.groupSelectionView = this.$editor.createModel(
        { itemType: "artboard" },
        false
      );
    }

    this.state.groupSelectionView.reset({
      parentId: this.$context.selection.currentProject.id,
      x: verties[0][0],
      y: verties[0][1],
      width: vec3.dist(verties[0], verties[1]),
      height: vec3.dist(verties[0], verties[3]),
    });

    return this.state.groupSelectionView;
  }

  initMatrix() {
    if (this.$context.selection.isMany && this.state.dragging === false) {
      // matrix 초기화
      this.verties = clone(this.$context.selection.verties);
      this.angle = 0;
      this.localAngle = this.angle;
      this.groupItem = this.item;
      this.cachedGroupItem = this.item.matrix;
    } else {
      // 초기화 옵션이 없으면 아무것도 변경하지 않는다.
      // matrix 초기화
      // this.verties = clone(this.$context.selection.verties);
      // this.angle = 0;
      // this.localAngle = this.angle;
      // this.groupItem = this.item;
      // this.cachedGroupItem = this.item.matrix;
    }
  }

  makeSelectionTool() {
    this.renderPointers();
  }

  /**
   * 선택영역 컴포넌트 그리기
   */
  renderPointers() {
    if (this.$context.selection.isEmpty) {
      this.refs.$pointerRect.empty();
      return;
    }

    this.state.renderPointerList = [
      this.$viewport.applyVerties(this.$context.selection.verties),
    ];

    const { line, point, size, elementLine } = this.createRenderPointers(
      this.state.renderPointerList[0]
    );

    this.refs.$pointerRect.updateDiff(line + elementLine + point + size);
  }

  createPointer(pointer, number, rotate) {
    return /*html*/ `
        <div    
            class='pointer' 
            data-number="${number}" 
            data-pointer="${pointer}" 
            style="transform: translate3d( calc(${pointer[0]}px - 50%), calc(${
      pointer[1]
    }px - 50%), 0px) rotateZ(${rotate || "0deg"})" 
        ></div>
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

  createPointerRect(pointers, rotatePointer) {
    if (pointers.length === 0) return "";

    const centerPointer = vec3.lerp([], pointers[0], pointers[1], 0.5);
    const line = `
            M ${centerPointer[0]},${centerPointer[1]} 
            L ${rotatePointer[0]}, ${rotatePointer[1]} 
        `;

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

  /**
   * 연결된 path 를 그리기 위한 함수
   *
   * @param {vec3[]} pointers
   * @returns
   */
  createLine(pointers) {
    return /*html*/ `
            M ${pointers[0][0]}, ${pointers[0][1]} 
            L ${pointers[1][0]}, ${pointers[1][1]} 
            L ${pointers[2][0]}, ${pointers[2][1]} 
            L ${pointers[3][0]}, ${pointers[3][1]} 
            L ${pointers[0][0]}, ${pointers[0][1]}
            Z
        `;
  }

  createSize(pointers) {
    const top = vec3.lerp([], pointers[0], pointers[1], 0.5);
    const right = vec3.lerp([], pointers[1], pointers[2], 0.5);
    const bottom = vec3.lerp([], pointers[2], pointers[3], 0.5);
    const left = vec3.lerp([], pointers[3], pointers[0], 0.5);

    const worldPosition = this.$viewport.applyVertiesInverse(pointers);
    const width = vec3.dist(worldPosition[0], worldPosition[1]);
    const height = vec3.dist(worldPosition[0], worldPosition[3]);

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
    const diff = vec3.subtract([], item.data.start, item.data.end);
    const angle = calculateAngle360(diff[0], diff[1]) + 90;

    let text = `${round(width, 100)} x ${round(height, 100)}`;

    if (this.state.isRotate) {
      const rotateZ = this.groupItem.angle;

      if (rotateZ) {
        text = `${rotateZ}°`;
      }
    }

    return /*html*/ `
            <div 
                class='size-pointer' 
                style="transform: translate3d( calc(${newPointer[0]}px - 50%), calc(${newPointer[1]}px - 50%), 0px) rotateZ(${angle}deg)" >
               ${text}
            </div>
        `;
  }

  createRenderPointers(pointers) {
    const diff = vec3.subtract(
      [],
      vec3.lerp([], pointers[0], pointers[1], 0.5),
      vec3.lerp([], pointers[0], pointers[2], 0.5)
    );

    //TODO: 여기서는 법선벡터를 구하게 되면 식이 훨씬 간단해진다.
    const rotate = Length.deg(calculateAngle360(diff[0], diff[1]) - 90).round(
      1000
    );

    const rotatePointer = getRotatePointer(pointers, 30);
    const dist = vec3.dist(pointers[0], pointers[2]);
    const width = vec3.dist(pointers[0], pointers[1]);
    const height = vec3.dist(pointers[0], pointers[3]);

    return {
      line: this.createPointerRect(pointers, rotatePointer),
      elementLine: `
                <svg class='line' overflow="visible">
                    <path 
                        d="${this.$context.selection.items
                          .map((it) => {
                            return this.createLine(
                              this.$viewport.applyVerties(it.originVerties)
                            );
                          })
                          .join("")}
                        " />
                </svg>
            `,
      size: this.createSize(pointers),
      point: [
        // 모서리 영역은 사용하지 않음 , 클릭하는 시점에 다른 도구가 selection 되지 않는 문제가 있어서
        // 추후 UI 를 다르게 만들어야할 듯
        // 4모서리에서도 rotate 할 수 있도록 맞춤
        // this.createRotatePointer (selectionPointers[0], 0, 'bottom right'),
        // this.createRotatePointer (selectionPointers[1], 1, 'bottom left'),
        // this.createRotatePointer (selectionPointers[2], 2, 'top left'),
        // this.createRotatePointer (selectionPointers[3], 3, 'top right'),
        this.createRotatePointer(rotatePointer, 4, "center center"),

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
      ].join(""),
    };
  }

  checkShow() {
    if (this.state.show && this.$context.selection.isMany) {
      return true;
    }

    return false;
  }

  [SUBSCRIBE("hideSelectionToolView")]() {
    this.hide();
  }
}
