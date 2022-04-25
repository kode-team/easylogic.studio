import { vec3 } from "gl-matrix";

import { LEFT_BUTTON, POINTERSTART } from "sapa";

import ClippathCircleEditorView from "./ClippathCircleEditorView";
import "./ClippathEditorView.scss";

import { calculateAngle, vertiesMap } from "elf/core/math";
import { ClipPath } from "elf/editor/property-parser/ClipPath";
import { END, MOVE } from "elf/editor/types/event";
import { ClipPathType } from "elf/editor/types/model";
import { Length } from "elf/editor/unit/Length";

export default class ClippathEllipseEditorView extends ClippathCircleEditorView {
  [POINTERSTART("$el .ellipse .ellipse-radius-x") +
    LEFT_BUTTON +
    MOVE("moveEllipseRadiusX") +
    END("moveEndEllipseRadiusX")]() {
    const current = this.$selection.current;

    this.state.current;
    this.state.width = current.screenWidth;
    this.state.height = current.screenHeight;
    this.state.clippath = ClipPath.parseStyle(current["clip-path"]);
    this.state.ellipse = ClipPath.parseStyleForEllipse(
      this.state.clippath.value
    );
  }

  moveEllipseRadiusX(dx, dy) {
    const current = this.$selection.current;
    const { radiusX, radiusY, x, y } = this.state.ellipse;

    const oldX = x.toPx(current.screenWidth);
    const oldY = y.toPx(current.screenHeight);

    const oldRadiusX = radiusX.toPx(current.screenWidth);

    const verties = this.$viewport.applyVerties(
      vertiesMap(
        [[oldX.value + oldRadiusX.value, oldY, 0]],
        current.absoluteMatrix
      )
    );

    const newRadius = verties[0];

    const newX = newRadius[0] + dx;
    const newY = newRadius[1] + dy;

    const localPosition = this.$viewport.applyVertexInverse([newX, newY, 0]);

    const relativePosition = vertiesMap(
      [localPosition],
      this.$selection.current.absoluteMatrixInverse
    )[0];

    const distX = Math.abs(relativePosition[0] - oldX);

    const result = [
      radiusX.isPercent()
        ? Length.makePercent(distX, this.state.width)
        : Length.px(distX),
      x,
      y,
    ];

    this.state.clippath.value = `${result[0]} ${radiusY} at ${result[1]} ${result[2]}`;

    const value = ClipPath.toCSS(this.state.clippath);

    this.emit("setAttributeForMulti", this.$selection.packByValue(value));
  }

  [POINTERSTART("$el .ellipse .ellipse-radius-y") +
    LEFT_BUTTON +
    MOVE("moveEllipseRadiusY") +
    END("moveEndEllipseRadiusX")]() {
    const current = this.$selection.current;

    this.state.current;
    this.state.width = current.screenWidth;
    this.state.height = current.screenHeight;
    this.state.clippath = ClipPath.parseStyle(current["clip-path"]);
    this.state.ellipse = ClipPath.parseStyleForEllipse(
      this.state.clippath.value
    );
  }

  moveEllipseRadiusY(dx, dy) {
    const current = this.$selection.current;
    const { radiusX, radiusY, x, y } = this.state.ellipse;

    const oldX = x.toPx(current.screenWidth);
    const oldY = y.toPx(current.screenHeight);

    const oldRadiusY = radiusY.toPx(current.screenHeight);

    const verties = this.$viewport.applyVerties(
      vertiesMap(
        [[oldX.value, oldY.value + oldRadiusY.value, 0]],
        current.absoluteMatrix
      )
    );

    const newRadius = verties[0];

    const newX = newRadius[0] + dx;
    const newY = newRadius[1] + dy;

    const localPosition = this.$viewport.applyVertexInverse([newX, newY, 0]);

    const relativePosition = vertiesMap(
      [localPosition],
      this.$selection.current.absoluteMatrixInverse
    )[0];

    const distY = Math.abs(relativePosition[1] - oldY);

    const result = [
      radiusY.isPercent()
        ? Length.makePercent(distY, this.state.height)
        : Length.px(distY),
      x,
      y,
    ];

    this.state.clippath.value = `${radiusX} ${result[0]} at ${x} ${y}`;

    const value = ClipPath.toCSS(this.state.clippath);

    this.emit("setAttributeForMulti", this.$selection.packByValue(value));
  }

  moveEndEllipseRadiusX() {
    const value = ClipPath.toCSS(this.state.clippath);

    this.command(
      "setAttributeForMulti",
      "change clippath",
      this.$selection.packByValue(value)
    );
  }

  [POINTERSTART("$el .ellipse .ellipse-center") +
    LEFT_BUTTON +
    MOVE("moveEllipseCenter") +
    END("moveEndEllipseCenter")](e) {
    const current = this.$selection.current;

    this.state.current;
    this.state.width = current.screenWidth;
    this.state.height = current.screenHeight;
    this.state.clippath = ClipPath.parseStyle(current["clip-path"]);
    this.state.ellipse = ClipPath.parseStyleForEllipse(
      this.state.clippath.value
    );
    this.state.left = Length.parse(e.$dt.css("left")).value;
    this.state.top = Length.parse(e.$dt.css("top")).value;
  }

  moveEllipseCenter(dx, dy) {
    const { radiusX, radiusY, x, y } = this.state.ellipse;

    const newLeft = this.state.left + dx;
    const newTop = this.state.top + dy;

    const worldPosition = this.$viewport.applyVertexInverse([
      newLeft,
      newTop,
      0,
    ]);

    // local position 으로 바꾸기
    const relativePosition = vertiesMap(
      [worldPosition],
      this.$selection.current.absoluteMatrixInverse
    )[0];

    const result = [
      radiusX,
      radiusY,
      x.isPercent()
        ? Length.makePercent(relativePosition[0], this.state.width)
        : Length.px(relativePosition[0]),
      y.isPercent()
        ? Length.makePercent(relativePosition[1], this.state.height)
        : Length.px(relativePosition[1]),
    ];

    this.state.clippath.value = `${radiusX} ${radiusY} at ${result[2]} ${result[3]}`;

    const value = ClipPath.toCSS(this.state.clippath);

    this.emit("setAttributeForMulti", this.$selection.packByValue(value));
  }

  moveEndEllipseCenter(dx, dy) {
    if (dx == 0 && dy == 0) {
      switch (this.state.clippath.type) {
        case ClipPathType.ELLIPSE:
          // eslint-disable-next-line no-case-declarations
          const value = ClipPath.toCSS({
            type: ClipPathType.INSET,
            value: "",
          });

          this.command(
            "setAttributeForMulti",
            "change clippath",
            this.$selection.packByValue(value)
          );
          break;
      }
      return;
    }

    const value = ClipPath.toCSS(this.state.clippath);

    this.command(
      "setAttributeForMulti",
      "change clippath",
      this.$selection.packByValue(value)
    );
  }

  templateEllipse(clippath) {
    const current = this.$selection.current;

    const radiusX = clippath.value.radiusX.toPx(current.screenWidth);
    const radiusY = clippath.value.radiusY.toPx(current.screenHeight);
    const x = clippath.value.x.toPx(current.screenWidth);
    const y = clippath.value.y.toPx(current.screenHeight);

    const verties = this.$viewport.applyVerties(
      vertiesMap(
        [
          [x, y, 0],
          [x.value + radiusX.value, y, 0],
          [x.value, y.value + radiusY.value, 0],
        ],
        current.absoluteMatrix
      )
    );

    const center = verties[0];
    const radiusXPos = verties[1];
    const radiusYPos = verties[2];

    const distX = vec3.dist(center, radiusXPos);
    const distY = vec3.dist(center, radiusYPos);

    const direction = vec3.subtract([], radiusXPos, center);

    const angle = calculateAngle(direction[0], direction[1]);

    return (
      <div class="ellipse">
        <div class="ellipse-back">
          <svg style="position:absolute;width:100%;height:100%;">
            <ellipse
              cx={center[0]}
              cy={center[1]}
              rx={distX}
              ry={distY}
              transform={`rotate(${angle} ${center[0]} ${center[1]})`}
            ></ellipse>
          </svg>
        </div>
        <div
          class="ellipse-center"
          style={{
            left: center[0] + "px",
            top: center[1] + "px",
          }}
        ></div>
        <div
          class="ellipse-radius ellipse-radius-x"
          style={{
            left: radiusXPos[0] + "px",
            top: radiusXPos[1] + "px",
          }}
        ></div>
        <div
          class="ellipse-radius ellipse-radius-y"
          style={{
            left: radiusYPos[0] + "px",
            top: radiusYPos[1] + "px",
          }}
        ></div>
      </div>
    );
  }
}
