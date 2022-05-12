import { vec3 } from "gl-matrix";

import { LEFT_BUTTON, POINTERSTART } from "sapa";

import "./ClippathEditorView.scss";
import ClippathPolygonEditorView from "./ClippathPolygonEditorView";

import { vertiesMap } from "elf/core/math";
import { ClipPath } from "elf/editor/property-parser/ClipPath";
import { END, MOVE } from "elf/editor/types/event";
import { ClipPathType } from "elf/editor/types/model";
import { Length } from "elf/editor/unit/Length";

export default class ClippathInsetEditorView extends ClippathPolygonEditorView {
  initializeInset() {
    const current = this.$context.selection.current;

    this.state.current;
    this.state.width = current.screenWidth;
    this.state.height = current.screenHeight;
    this.state.clippath = ClipPath.parseStyle(current["clip-path"]);
    this.state.clippath.value = ClipPath.parseStyleForInset(
      this.state.clippath.value
    );
    this.state.inset = this.state.clippath.value;

    const inset = this.state.inset;
    const top = inset.top.toPx(current.screenHeight);
    const left = inset.left.toPx(current.screenWidth);
    const right = Length.px(
      current.screenWidth - inset.right.toPx(current.screenWidth)
    );
    const bottom = Length.px(
      current.screenHeight - inset.bottom.toPx(current.screenHeight)
    );

    const verties = this.$viewport.applyVerties(
      vertiesMap(
        [
          [left, top, 0],
          [right, top, 0],
          [right, bottom, 0],
          [left, bottom, 0],
        ],
        current.absoluteMatrix
      )
    );

    const leftPoint = vec3.lerp([], verties[0], verties[3], 0.5);
    const topPoint = vec3.lerp([], verties[0], verties[1], 0.5);
    const rightPoint = vec3.lerp([], verties[1], verties[2], 0.5);
    const bottomPoint = vec3.lerp([], verties[2], verties[3], 0.5);
    const centerPoint = vec3.lerp([], verties[0], verties[2], 0.5);

    this.screenPoints = [
      leftPoint,
      topPoint,
      rightPoint,
      bottomPoint,
      centerPoint,
    ];
  }

  [POINTERSTART("$el .inset .inset-direction") +
    LEFT_BUTTON +
    MOVE("moveInsetRadius") +
    END("moveEndInsetRadius")](e) {
    this.initializeInset();

    this.insetTarget = e.$dt.data("direction");
  }

  moveInsetRadius(dx, dy) {
    const { left, top, right, bottom } = this.state.inset;
    let [leftPoint, topPoint, rightPoint, bottomPoint] = this.screenPoints;

    // screen 좌표를 움직이고
    if (this.insetTarget == "left")
      leftPoint = vec3.add([], leftPoint, [dx, dy, 0]);
    else if (this.insetTarget == "top")
      topPoint = vec3.add([], topPoint, [dx, dy, 0]);
    else if (this.insetTarget == "right")
      rightPoint = vec3.add([], rightPoint, [dx, dy, 0]);
    else if (this.insetTarget == "bottom")
      bottomPoint = vec3.add([], bottomPoint, [dx, dy, 0]);

    // global world 좌표로 바꾸고
    const newLeftPoint = this.$viewport.applyVertexInverse(leftPoint);
    const newTopPoint = this.$viewport.applyVertexInverse(topPoint);
    const newRightPoint = this.$viewport.applyVertexInverse(rightPoint);
    const newBottomPoint = this.$viewport.applyVertexInverse(bottomPoint);

    // relative 좌표로 바꾸고
    const inverseMatrix = this.$context.selection.current.absoluteMatrixInverse;

    const [
      relativeLeftPosition,
      relativeTopPosition,
      relativeRightPosition,
      relativeBottomPosition,
    ] = vertiesMap(
      [newLeftPoint, newTopPoint, newRightPoint, newBottomPoint],
      inverseMatrix
    );

    this.state.clippath.value = [
      top.isPercent()
        ? Length.makePercent(relativeTopPosition[1], this.state.height)
        : Length.px(relativeTopPosition[1]),
      right.isPercent()
        ? Length.makePercent(
            this.state.width - relativeRightPosition[0],
            this.state.width
          )
        : Length.px(this.state.width - relativeRightPosition[0]),
      bottom.isPercent()
        ? Length.makePercent(
            this.state.height - relativeBottomPosition[1],
            this.state.height
          )
        : Length.px(this.state.height - relativeBottomPosition[1]),
      left.isPercent()
        ? Length.makePercent(relativeLeftPosition[0], this.state.width)
        : Length.px(relativeLeftPosition[0]),
    ].join(" ");

    const value = ClipPath.toCSS(this.state.clippath);

    this.$commands.emit(
      "setAttribute",
      this.$context.selection.packByValue(value)
    );
  }

  moveEndInsetRadius() {
    const value = ClipPath.toCSS(this.state.clippath);

    this.$commands.executeCommand(
      "setAttribute",
      "change clippath",
      this.$context.selection.packByValue(value)
    );
  }

  [POINTERSTART("$el .inset .inset-center") +
    LEFT_BUTTON +
    MOVE("moveInsetCenter") +
    END("moveEndInsetCenter")]() {
    this.initializeInset();
  }

  moveInsetCenter(dx, dy) {
    const { left, top, right, bottom } = this.state.inset;
    let [leftPoint, topPoint, rightPoint, bottomPoint] = this.screenPoints;

    // screen 좌표를 움직이고
    leftPoint = vec3.add([], leftPoint, [dx, dy, 0]);
    topPoint = vec3.add([], topPoint, [dx, dy, 0]);
    rightPoint = vec3.add([], rightPoint, [dx, dy, 0]);
    bottomPoint = vec3.add([], bottomPoint, [dx, dy, 0]);

    // global world 좌표로 바꾸고
    const newLeftPoint = this.$viewport.applyVertexInverse(leftPoint);
    const newTopPoint = this.$viewport.applyVertexInverse(topPoint);
    const newRightPoint = this.$viewport.applyVertexInverse(rightPoint);
    const newBottomPoint = this.$viewport.applyVertexInverse(bottomPoint);

    // relative 좌표로 바꾸고
    const inverseMatrix = this.$context.selection.current.absoluteMatrixInverse;

    const [
      relativeLeftPosition,
      relativeTopPosition,
      relativeRightPosition,
      relativeBottomPosition,
    ] = vertiesMap(
      [newLeftPoint, newTopPoint, newRightPoint, newBottomPoint],
      inverseMatrix
    );

    this.state.clippath.value = [
      top.isPercent()
        ? Length.makePercent(relativeTopPosition[1], this.state.height)
        : Length.px(relativeTopPosition[1]),
      right.isPercent()
        ? Length.makePercent(
            this.state.width - relativeRightPosition[0],
            this.state.width
          )
        : Length.px(this.state.width - relativeRightPosition[0]),
      bottom.isPercent()
        ? Length.makePercent(
            this.state.height - relativeBottomPosition[1],
            this.state.height
          )
        : Length.px(this.state.height - relativeBottomPosition[1]),
      left.isPercent()
        ? Length.makePercent(relativeLeftPosition[0], this.state.width)
        : Length.px(relativeLeftPosition[0]),
    ].join(" ");

    const value = ClipPath.toCSS(this.state.clippath);

    this.$commands.emit(
      "setAttribute",
      this.$context.selection.packByValue(value)
    );
  }

  moveEndInsetCenter(dx, dy) {
    if (dx == 0 && dy == 0) {
      switch (this.state.clippath.type) {
        case ClipPathType.INSET:
          // eslint-disable-next-line no-case-declarations
          const value = ClipPath.toCSS({
            type: ClipPathType.POLYGON,
            value: `0% 0%, 100% 0%, 100% 100%, 0% 100%`,
          });

          this.$commands.executeCommand(
            "setAttribute",
            "change clippath",
            this.$context.selection.packByValue(value)
          );
          break;
      }
      return;
    }

    const value = ClipPath.toCSS(this.state.clippath);

    this.$commands.executeCommand(
      "setAttribute",
      "change clippath",
      this.$context.selection.packByValue(value)
    );
  }

  templateInset(clippath) {
    const current = this.$context.selection.current;

    clippath.value = ClipPath.parseStyleForInset(clippath.value);

    const top = clippath.value.top.toPx(current.screenHeight);
    const left = clippath.value.left.toPx(current.screenWidth);
    const right = Length.px(
      current.screenWidth - clippath.value.right.toPx(current.screenWidth)
    );
    const bottom = Length.px(
      current.screenHeight - clippath.value.bottom.toPx(current.screenHeight)
    );

    const verties = this.$viewport.applyVerties(
      vertiesMap(
        [
          [left, top, 0],
          [right, top, 0],
          [right, bottom, 0],
          [left, bottom, 0],
        ],
        current.absoluteMatrix
      )
    );

    const leftPoint = vec3.lerp([], verties[0], verties[3], 0.5);
    const topPoint = vec3.lerp([], verties[0], verties[1], 0.5);
    const rightPoint = vec3.lerp([], verties[1], verties[2], 0.5);
    const bottomPoint = vec3.lerp([], verties[2], verties[3], 0.5);
    const centerPoint = vec3.lerp([], verties[0], verties[2], 0.5);

    return (
      <div class="inset">
        <div class="inset-back">
          <svg style="position:absolute;width:100%;height:100%;">
            <path
              d={`
            M ${verties[0][0]} ${verties[0][1]}
            L ${verties[1][0]} ${verties[1][1]}
            L ${verties[2][0]} ${verties[2][1]}
            L ${verties[3][0]} ${verties[3][1]}
            Z
          `}
            ></path>
          </svg>
        </div>
        <div
          class="inset-direction"
          data-direction="left"
          style={{
            left: Length.px(leftPoint[0]),
            top: Length.px(leftPoint[1]),
          }}
        ></div>
        <div
          class="inset-direction"
          data-direction="top"
          style={{ left: Length.px(topPoint[0]), top: Length.px(topPoint[1]) }}
        ></div>
        <div
          class="inset-direction"
          data-direction="right"
          style={{
            left: Length.px(rightPoint[0]),
            top: Length.px(rightPoint[1]),
          }}
        ></div>
        <div
          class="inset-direction"
          data-direction="bottom"
          style={{
            left: Length.px(bottomPoint[0]),
            top: Length.px(bottomPoint[1]),
          }}
        ></div>
        <div
          class="inset-center"
          style={{
            left: Length.px(centerPoint[0]),
            top: Length.px(centerPoint[1]),
          }}
        ></div>
      </div>
    );
  }
}
