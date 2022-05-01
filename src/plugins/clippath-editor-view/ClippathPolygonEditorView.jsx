import { vec3 } from "gl-matrix";

import { POINTERSTART, clone } from "sapa";

import "./ClippathEditorView.scss";

import { toRectVerties } from "elf/core/collision";
import { vertiesMap } from "elf/core/math";
import { ClipPath } from "elf/editor/property-parser/ClipPath";
import { END, MOVE } from "elf/editor/types/event";
import { ClipPathType } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class ClippathPolygonEditorView extends EditorElement {
  initializePolygon() {
    const current = this.$context.selection.current;

    this.state.current = current;
    this.state.width = current.screenWidth;
    this.state.height = current.screenHeight;
    this.state.clippath = ClipPath.parseStyle(current["clip-path"]);
    this.state.clippath.value = ClipPath.parseStyleForPolygon(
      this.state.clippath.value
    );

    this.screenPoints = this.$viewport.applyVerties(
      vertiesMap(
        this.state.clippath.value.map((point) => {
          const { x, y } = point;

          const newX = x.toPx(this.state.width);
          const newY = y.toPx(this.state.height);

          return vec3.fromValues(newX, newY, 0);
        }),
        current.absoluteMatrix
      )
    );

    this.clonedScreenPoints = clone(this.screenPoints);
  }

  [POINTERSTART("$el .polygon .polygon-pointer") +
    MOVE("movePolygonPointer") +
    END("moveEndPolygonPointer")](e) {
    this.initializePolygon();

    this.polygonTargetIndex = +e.$dt.data("index");
  }

  movePolygonPointer(dx, dy) {
    this.clonedScreenPoints[this.polygonTargetIndex] = vec3.add(
      [],
      this.screenPoints[this.polygonTargetIndex],
      [dx, dy, 0]
    );

    this.updatePolygon(this.clonedScreenPoints);
  }

  moveEndPolygonPointer() {
    const value = ClipPath.toCSS(this.state.clippath);

    this.command(
      "setAttributeForMulti",
      "change clippath",
      this.$context.selection.packByValue(value)
    );
  }

  [POINTERSTART("$el .polygon .polygon-line")](e) {
    this.initializePolygon();

    const index = +e.$dt.data("index");

    this.polygonTargetIndex = index;

    const current = this.screenPoints[this.polygonTargetIndex];
    const next =
      this.screenPoints[
        (this.polygonTargetIndex + 1) % this.screenPoints.length
      ];

    const newPoint = vec3.lerp([], current, next, 0.5);

    this.screenPoints.splice(this.polygonTargetIndex + 1, 0, newPoint);

    this.updatePolygon(this.screenPoints);
  }

  updatePolygon(screenPoints) {
    // global world 좌표로 바꾸고
    const newWorldPoints = this.$viewport.applyVertiesInverse(screenPoints);

    // relative 좌표로 바꾸고
    const inverseMatrix = this.$context.selection.current.absoluteMatrixInverse;

    const newLocalPoints = vertiesMap(newWorldPoints, inverseMatrix);

    this.state.clippath.value = newLocalPoints
      .map((p) => {
        return [
          Length.makePercent(p[0], this.state.width),
          Length.makePercent(p[1], this.state.height),
        ].join(" ");
      })
      .join(",");

    const value = ClipPath.toCSS(this.state.clippath);

    this.emit(
      "setAttributeForMulti",
      this.$context.selection.packByValue(value)
    );
  }

  [POINTERSTART("$el .polygon .polygon-center") +
    MOVE("movePolygonCenter") +
    END("moveEndPolygonCenter")]() {
    this.initializePolygon();
  }

  movePolygonCenter(dx, dy) {
    const newScreenPoints = this.screenPoints.map((p) => {
      return vec3.add([], p, [dx, dy, 0]);
    });

    this.updatePolygon(newScreenPoints);
  }

  moveEndPolygonCenter(dx, dy) {
    if (dx == 0 && dy == 0) {
      switch (this.state.clippath.type) {
        case ClipPathType.POLYGON:
          // eslint-disable-next-line no-case-declarations
          const value = ClipPath.toCSS({
            type: ClipPathType.CIRCLE,
            value: `50% at 50% 50%`,
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

  templatePolygon(clippath) {
    const current = this.$context.selection.current;
    const points = ClipPath.parseStyleForPolygon(clippath.value).map(
      (point) => [
        point.x.toPx(current.screenWidth).value,
        point.y.toPx(current.screenHeight).value,
        0,
      ]
    );
    const centerPoint = toRectVerties(points)[4];

    const screenPoints = this.$viewport.applyVerties(
      vertiesMap(points, current.absoluteMatrix)
    );
    const screenCenter = this.$viewport.applyVerties(
      vertiesMap([centerPoint], current.absoluteMatrix)
    )[0];

    return (
      <div class="polygon">
        <div class="polygon-back">
          <svg style="position:absolute;width:100%;height:100%;">
            <polygon
              points={`${screenPoints
                .map((it) => [it[0], it[1]].join(","))
                .join(" ")}`}
            ></polygon>
            {screenPoints.map((it, index) => {
              const nextIndex = (index + 1) % screenPoints.length;
              const nextPoint = screenPoints[nextIndex];

              return (
                <line
                  x1={it[0]}
                  y1={it[1]}
                  x2={nextPoint[0]}
                  y2={nextPoint[1]}
                  class="polygon-line"
                  data-index={index}
                ></line>
              );
            })}
            {screenPoints.map((it, index) => {
              return (
                <circle
                  cx={it[0]}
                  cy={it[1]}
                  r={3}
                  class="polygon-pointer"
                  data-index={index}
                ></circle>
              );
            })}
          </svg>
        </div>
        <div
          class="polygon-center"
          style={{
            left: Length.px(screenCenter[0]),
            top: Length.px(screenCenter[1]),
          }}
        ></div>
      </div>
    );
  }
}
