import { vec3 } from "gl-matrix";

import { CONFIG, SUBSCRIBE, IF, Dom } from "sapa";

import "./HoverView.scss";

import { vertiesToPath } from "elf/core/collision";
import { UPDATE_VIEWPORT, UPDATE_CANVAS } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class HoverView extends EditorElement {
  template() {
    return (
      <div class="elf--hover-view sepia(0.2)">
        <div class="elf--hover-rect" ref="$hoverRect"></div>
      </div>
    );
  }

  checkModeView() {
    const e = this.$config.get("bodyEvent");

    // viewport 영역에 있을 때만 이벤트 발생
    if (!this.$viewport.checkInViewport(this.$viewport.getWorldPosition(e))) {
      return false;
    }

    const canvas = Dom.create(e.target).closest("elf--page-container");

    if (!canvas) return false;

    return (
      this.$modeView.isCurrentMode("CanvasView") &&
      this.$stateManager.isPointerUp
    );
  }

  /**
   * CanvasView 모드일 때만  HoverView 동작하도록 설정
   */
  [CONFIG("bodyEvent") + IF("checkModeView")]() {
    if (this.$config.true("set.move.control.point")) {
      this.$context.selection.setHoverId("");
      this.renderHoverLayer();
      return;
    }

    const filteredList = this.$context.selection.filteredLayers;
    const point = this.$viewport.getWorldPosition(
      this.$config.get("bodyEvent")
    );

    const items = filteredList
      .filter((it) => it.hasPoint(point[0], point[1]))
      .filter((it) => it.isNot("artboard"));

    // 그룹에 속해 있으면 삭제한다.
    let hoverItems = items; //this.$model.convertGroupItems(items);

    // 계층 구조에서 마지막 객체를 선택
    let id = hoverItems[0]?.id;

    if (this.$context.selection.isEmpty) {
      id = hoverItems[0]?.id;
    } else if (this.$context.selection.isOne) {
      const pathIds = this.$context.selection.current.pathIds;
      hoverItems = hoverItems.filter(
        (it) =>
          pathIds.includes(it.id) === false ||
          it.id === this.$context.selection.current.id
      );

      id = hoverItems[0]?.id;
    }

    if (!id) {
      this.$context.selection.setHoverId("");
      this.renderHoverLayer();
    } else {
      if (this.$context.selection.setHoverId(id)) {
        this.renderHoverLayer();
      }
    }
  }

  [CONFIG("set.move.control.point")]() {
    this.renderHoverLayer();
  }

  [SUBSCRIBE("refreshHoverView")](id) {
    if (this.$context.selection.setHoverId(id)) {
      this.renderHoverLayer();
    }
  }

  [SUBSCRIBE(UPDATE_VIEWPORT, UPDATE_CANVAS)]() {
    this.$context.selection.setHoverId("");
    this.renderHoverLayer();
  }

  createVisiblePath(current) {
    if (!current.is("boolean-path")) {
      return "";
    }

    const newPath = current.absolutePath();
    newPath.transformMat4(this.$viewport.matrix);

    return /*html*/ `
        <svg overflow="visible">
            <path
                d="${newPath.d}"
                stroke="red"
                stroke-width="2"
                fill="none"
                />
        </svg>
        `;
  }

  renderHoverLayer() {
    const items = this.$context.selection.hoverItems;
    if (items.length === 0) {
      // hide render hover layer
      this.refs.$hoverRect.updateDiff("");
      // this.emit("removeGuideLine");
    } else {
      // refresh hover view
      const verties = items[0].verties;

      const line = this.createPointerLine(this.$viewport.applyVerties(verties));
      const offsetLine = this.createOffsetLine();

      this.refs.$hoverRect.updateDiff(line + offsetLine);

      // this.emit("refreshGuideLineByTarget", [items[0].verties]);
    }
  }

  getOffsetVerties(current, parent) {
    const currentVerties = current.verties;
    const parentVerties = parent.verties;

    const result = {};

    // left;
    const left = this.$viewport.applyVerties([
      // start
      [
        currentVerties[0][0],
        vec3.lerp([], currentVerties[0], currentVerties[3], 0.5)[1],
        0,
      ],
      // end
      [
        parentVerties[0][0],
        vec3.lerp([], currentVerties[0], currentVerties[3], 0.5)[1],
        0,
      ],
    ]);

    var dist = vec3.dist(...left);

    if (dist > 0) {
      result.left = left;
    }

    const top = this.$viewport.applyVerties([
      // start
      [
        vec3.lerp([], currentVerties[0], currentVerties[1], 0.5)[0],
        currentVerties[1][1],
        0,
      ],
      // end
      [
        vec3.lerp([], currentVerties[0], currentVerties[1], 0.5)[0],
        parentVerties[1][1],
        0,
      ],
    ]);

    var dist = vec3.dist(...top);

    if (dist > 0) {
      result.top = top;
    }

    return result;
  }

  createOffsetLine() {
    const item =
      this.$context.selection.hoverItems[0] || this.$context.selection.current;

    if (!item || !item.parent) {
      return "";
    }

    if (item.parent && item.parent.is("project")) {
      return "";
    }

    if (this.$context.selection.isEmpty) {
      const offsetVerties = this.getOffsetVerties(item, item.parent);

      return /*html*/ `
            <svg overflow="visible">
                <path
                    class="offset-line"
                    d="
                        ${vertiesToPath(offsetVerties.left)}
                        ${vertiesToPath(offsetVerties.right)}
                        ${vertiesToPath(offsetVerties.top)}
                        ${vertiesToPath(offsetVerties.bottom)}
                    "
                    />
            </svg>
            `;
    } else {
      const offsetVerties = this.getOffsetVerties(
        item,
        this.$context.selection.current
      );

      return /*html*/ `
            <svg overflow="visible">
                <path
                    d="
                        ${vertiesToPath(offsetVerties.left)}
                        ${vertiesToPath(offsetVerties.top)}
                    "
                    stroke="red"
                    stroke-width="1"
                    stroke-dasharray="5, 10"
                    fill="none"
                    />
            </svg>
            `;
    }

    // return /*html*/ `
    //     <svg overflow="visible">

    //         <path
    //             class="line"
    //             d="M0,0 L0,0"
    //             stroke="red"
    //             stroke-width="2"
    //             fill="none"
    //             />
    //     </svg>`;
  }

  createPointerLine(pointers) {
    if (pointers.length === 0) return "";

    pointers = pointers.filter((_, index) => index < 4);

    return /*html*/ `
        <svg overflow="visible">
            <path class='line' d="${vertiesToPath(pointers)}" />
        </svg>`;
  }
}
