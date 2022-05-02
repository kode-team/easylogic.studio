import { vec3 } from "gl-matrix";

import { LEFT_BUTTON, POINTERSTART } from "sapa";

import "./ClippathEditorView.scss";
import ClippathInsetEditorView from "./ClippathInsetEditorView";

import { vertiesMap } from "elf/core/math";
import { ClipPath } from "elf/editor/property-parser/ClipPath";
import { END, MOVE } from "elf/editor/types/event";
import { ClipPathType } from "elf/editor/types/model";
import { Length } from "elf/editor/unit/Length";
export default class ClippathCircleEditorView extends ClippathInsetEditorView {
  [POINTERSTART("$el .circle .circle-radius") +
    LEFT_BUTTON +
    MOVE("moveCircleRadius") +
    END("moveEndCircleRadius")]() {
    const current = this.$context.selection.current;

    this.state.current;
    this.state.width = current.screenWidth;
    this.state.height = current.screenHeight;
    this.state.clippath = ClipPath.parseStyle(current["clip-path"]);
    this.state.circle = ClipPath.parseStyleForCircle(this.state.clippath.value);
  }

  moveCircleRadius(dx, dy) {
    const current = this.$context.selection.current;
    const { radius, x, y } = this.state.circle;

    const oldX = x.toPx(current.screenWidth);
    const oldY = y.toPx(current.screenHeight);

    const r =
      Math.sqrt(
        Math.pow(current.screenWidth, 2) + Math.pow(current.screenHeight, 2)
      ) / Math.sqrt(2);
    const oldRadius = radius.toPx(current.screenWidth);

    const verties = this.$viewport.applyVerties(
      vertiesMap(
        [[oldX.value + oldRadius.value, oldY, 0]],
        current.absoluteMatrix
      )
    );

    const newRadius = verties[0];

    const newX = newRadius[0] + dx;
    const newY = newRadius[1] + dy;

    const localPosition = this.$viewport.applyVertexInverse([newX, newY, 0]);

    const relativePosition = vertiesMap(
      [localPosition],
      this.$context.selection.current.absoluteMatrixInverse
    )[0];

    const distX = Math.abs(relativePosition[0] - oldX);

    const result = [
      radius.isPercent() ? Length.makePercent(distX, r) : Length.px(distX),
      x,
      y,
    ];

    this.state.clippath.value = `${result[0]} at ${result[1]} ${result[2]}`;

    const value = ClipPath.toCSS(this.state.clippath);

    this.emit(
      "setAttributeForMulti",
      this.$context.selection.packByValue(value)
    );
  }

  moveEndCircleRadius() {
    const value = ClipPath.toCSS(this.state.clippath);

    this.command(
      "setAttributeForMulti",
      "change clippath",
      this.$context.selection.packByValue(value)
    );
  }

  [POINTERSTART("$el .circle .circle-center") +
    LEFT_BUTTON +
    MOVE("moveCircleCenter") +
    END("moveEndCircleCenter")]() {
    const current = this.$context.selection.current;

    this.state.current;
    this.state.width = current.screenWidth;
    this.state.height = current.screenHeight;
    this.state.clippath = ClipPath.parseStyle(current["clip-path"]);
    this.state.circle = ClipPath.parseStyleForCircle(this.state.clippath.value);
  }

  moveCircleCenter(dx, dy) {
    const current = this.$context.selection.current;
    const { radius, x, y } = this.state.circle;

    const oldX = x.toPx(current.screenWidth);
    const oldY = y.toPx(current.screenHeight);

    const verties = this.$viewport.applyVerties(
      vertiesMap([[oldX, oldY, 0]], current.absoluteMatrix)
    );

    const center = verties[0];

    const newX = center[0] + dx;
    const newY = center[1] + dy;

    const localPosition = this.$viewport.applyVertexInverse([newX, newY, 0]);

    const relativePosition = vertiesMap(
      [localPosition],
      this.$context.selection.current.absoluteMatrixInverse
    )[0];

    const result = [
      radius,
      x.isPercent()
        ? Length.makePercent(relativePosition[0], this.state.width)
        : Length.px(relativePosition[0]),
      y.isPercent()
        ? Length.makePercent(relativePosition[1], this.state.height)
        : Length.px(relativePosition[1]),
    ];

    this.state.clippath.value = `${radius} at ${result[1]} ${result[2]}`;

    const value = ClipPath.toCSS(this.state.clippath);

    this.emit(
      "setAttributeForMulti",
      this.$context.selection.packByValue(value)
    );
  }

  moveEndCircleCenter(dx, dy) {
    if (dx == 0 && dy == 0) {
      switch (this.state.clippath.type) {
        case ClipPathType.CIRCLE:
          // eslint-disable-next-line no-case-declarations
          const value = ClipPath.toCSS({
            type: ClipPathType.ELLIPSE,
            value: `${this.state.circle.radius} ${this.state.circle.radius} at ${this.state.circle.x} ${this.state.circle.y}`,
          });

          this.command(
            "setAttributeForMulti",
            "change clippath",
            this.$context.selection.packByValue(value)
          );
          break;
      }
      return;
    }

    const value = ClipPath.toCSS(this.state.clippath);

    this.command(
      "setAttributeForMulti",
      "change clippath",
      this.$context.selection.packByValue(value)
    );
  }

  templateCircle(clippath) {
    const current = this.$context.selection.current;

    const r =
      Math.sqrt(
        Math.pow(current.screenWidth, 2) + Math.pow(current.screenHeight, 2)
      ) / Math.sqrt(2);
    const radius = clippath.value.radius.toPx(r);
    const x = clippath.value.x.toPx(current.screenWidth);
    const y = clippath.value.y.toPx(current.screenHeight);

    const verties = this.$viewport.applyVerties(
      vertiesMap(
        [
          [x, y, 0],
          [x.value + radius.value, y, 0],
        ],
        current.absoluteMatrix
      )
    );

    const center = verties[0];
    const radiusPos = verties[1];

    const dist = vec3.dist(center, radiusPos);

    return (
      <div class="circle">
        <div
          class="circle-back"
          style={{
            left: Length.px(center[0]),
            top: Length.px(center[1]),
            width: Length.px(dist * 2),
            height: Length.px(dist * 2),
          }}
        ></div>
        <div
          class="circle-center"
          style={{
            left: center[0] + "px",
            top: center[1] + "px",
          }}
        ></div>
        <div
          class="circle-radius"
          style={{
            left: radiusPos[0] + "px",
            top: radiusPos[1] + "px",
          }}
        ></div>
      </div>
    );
  }
}
