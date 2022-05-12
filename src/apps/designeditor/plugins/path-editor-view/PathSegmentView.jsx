import { vec3 } from "gl-matrix";

import { DOMDIFF, IF, LOAD, POINTERSTART, SUBSCRIBE } from "sapa";

import "./PathSegmentView.scss";

import { PathParser } from "elf/core/parser/PathParser";
import { Segment } from "elf/core/parser/Segment";
import {
  END,
  MOVE,
  REFRESH_SELECTION,
  UPDATE_VIEWPORT,
  UPDATE_CANVAS,
} from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class PathSegmentView extends EditorElement {
  initState() {
    return {
      verties: [],
      selectedSegment: [],
    };
  }

  template() {
    return (
      <div class="elf--path-segment-view">
        <div class="segment-list" ref="$segmentList"></div>
        <div class="guide-list" ref="$guideList"></div>
      </div>
    );
  }

  setCacheVerties() {
    this.setState(
      {
        verties: this.getSegmentVerties(),
      },
      false
    );
  }

  refresh() {
    this.setCacheVerties();

    this.load();
  }

  getSegmentVerties() {
    if (!this.$context.selection.current) return [];

    if (this.$context.selection.current.isNot("svg-path")) return [];

    return this.$context.selection.current
      .absolutePath()
      .pathVerties.map((it) => {
        it.absoluteVertex = this.$viewport.applyVertex(it.vertex);
        return it;
      });
  }

  checkMoveSegment(e) {
    // shift 가 눌러져있으면 selection 을 추가하는걸로 생각
    return !e.shiftKey;
  }

  [POINTERSTART("$segmentList .segment") +
    IF("checkMoveSegment") +
    MOVE("moveSegment") +
    END("moveEndSegment")](e) {
    const [index] = e.$dt.attrs("data-index");

    if (this.state.selectedSegment.length === 0) {
      this.state.selectedSegment = [index];
    }

    this.localPathSegmentList = this.getSegmentVerties();
    this.targetPathSegmentList = this.getSegmentVerties();
    this.localPathParser = this.$context.selection.current.absolutePath();

    this.initMousePosition = this.$viewport.getWorldPosition(e);
  }

  moveSegment() {
    const { selectedSegment } = this.state;
    const targetPosition = this.$viewport.getWorldPosition();

    const newDist = vec3.subtract([], targetPosition, this.initMousePosition);

    selectedSegment.forEach((index) => {
      const currentSegment = this.localPathSegmentList[index];
      const targetSegment = this.targetPathSegmentList[index];

      targetSegment.vertex = vec3.add([], currentSegment.vertex, newDist);
    });

    this.updatePath();
  }

  updatePath() {
    const current = this.$context.selection.current;

    // world 좌표를 local 좌표로 변경
    const target = PathParser.fromStructuredVerties(
      this.targetPathSegmentList
    ).transformMat4(current.absoluteMatrixInverse);

    this.$commands.executeCommand(
      "setAttribute",
      "update path",
      this.$context.selection.packByValue(current.updatePath(target.d))
    );
  }

  moveEndSegment() {
    this.updatePath();

    this.localPathSegmentList = null;
    this.targetPathSegmentList = null;
    this.localPathParser = null;

    this.state.selectedSegment = [];
  }

  [LOAD("$segmentList") + DOMDIFF]() {
    const verties = this.state.verties;

    return verties.map((it, index) => {
      return (
        <div
          class="segment"
          data-index={index}
          style={{
            left: Length.px(it.absoluteVertex[0]),
            top: Length.px(it.absoluteVertex[1]),
          }}
        ></div>
      );
    });
  }

  [LOAD("$guideList") + DOMDIFF]() {
    const verties = this.state.verties;

    const results = [];

    for (let i = 0; i < verties.length; i++) {
      const it = verties[i];
      const prev = verties[i - 1];
      const next = verties[i + 1];

      if (Segment.isCubicBezierCurve(it.segment)) {
        if (it.valueIndex === 0) {
          results.push({
            start: prev.absoluteVertex,
            end: it.absoluteVertex,
          });
        } else if (it.valueIndex === 2) {
          results.push({
            start: next.absoluteVertex,
            end: it.absoluteVertex,
          });
        }
      } else if (Segment.isQuadraticBezierCurve(it.segment)) {
        if (it.valueIndex === 0) {
          if (
            Segment.isQuadraticBezierCurve(it.prevSegment) ||
            Segment.isCubicBezierCurve(it.prevSegment)
          ) {
            results.push({
              start: prev.absoluteVertex,
              end: it.absoluteVertex,
            });
          } else {
            results.push({
              start: next.absoluteVertex,
              end: it.absoluteVertex,
            });
          }
        }
      }
    }

    return (
      <svg>
        {results.map((it) => {
          return (
            <line
              class="guide"
              x1={it.start[0]}
              y1={it.start[1]}
              x2={it.end[0]}
              y2={it.end[1]}
            ></line>
          );
        })}
      </svg>
    );
  }

  [SUBSCRIBE(UPDATE_CANVAS)]() {
    this.refresh();
  }

  [SUBSCRIBE(REFRESH_SELECTION)]() {
    this.refresh();
  }

  [SUBSCRIBE(UPDATE_VIEWPORT)]() {
    this.refresh();
  }
}
