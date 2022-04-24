import { vec3 } from "gl-matrix";
import { Length } from "elf/editor/unit/Length";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { SUBSCRIBE } from "sapa";
import {
  toRectVerties,
  toRectVertiesWithoutTransformOrigin,
} from "elf/utils/collision";

import "./DragAreaView.scss";

export default class DragAreaRectView extends EditorElement {
  initState() {
    return {
      mode: "selection",
      x: 0,
      y: 0,
      width: 10000,
      height: 10000,
      cachedCurrentElement: {},
      html: "",
    };
  }

  template() {
    return /*html*/ `
            <div class="elf--drag-area-view" ref="$dragAreaView" style="pointer-events:none;">
                <div class='drag-area-rect' ref='$dragAreaRect'></div>
            </div>            
        `;
  }

  [SUBSCRIBE("drawAreaView")](style) {
    this.refs.$dragAreaRect.css(style);
  }

  [SUBSCRIBE("initDrawAreaView")]() {
    this.trigger("drawAreaView", {
      left: Length.px(-10000),
      top: Length.px(0),
      width: Length.px(0),
      height: Length.px(0),
    });
  }

  [SUBSCRIBE("startDragAreaView")]() {
    this.initMousePoint = this.$viewport.getWorldPosition();
    this.$config.init("set.move.control.point", true);

    this.dragRect = {
      left: Length.px(this.initMousePoint[0]),
      top: Length.px(this.initMousePoint[1]),
      width: Length.px(0),
      height: Length.px(0),
    };

    this.trigger("drawAreaView", this.dragRect);
  }

  getSelectedItems(rect, areaVerties) {
    var project = this.$selection.currentProject;
    let items = [];
    let selectedArtboard = [];
    if (project) {
      if (rect.width === 0 && rect.height === 0) {
        items = [];
      } else {
        // 프로젝트 내에 있는 모든 객체 검색
        project.layers.forEach((layer) => {
          if (layer.is("artboard") && layer.isIncludeByArea(areaVerties)) {
            selectedArtboard.push(layer);
          } else if (
            layer.is("artboard") &&
            layer.checkInArea(areaVerties) &&
            layer.hasChildren() === false
          ) {
            items.push(layer);
          } else {
            items.push.apply(items, layer.checkInAreaForAll(areaVerties));
          }
        });

        // boolean-path 의 자식은 드래그로 선택하지 않음.
        items = items.filter((it) => {
          return it.isDragSelectable;
        });

        if (items.length > 1) {
          items = items.filter((it) => {
            return it.is("artboard") === false;
          });
        }
      }
    }

    const selectedItems = selectedArtboard.length ? selectedArtboard : items;

    return selectedItems;
  }

  /**
   *
   *
   * @public
   */
  [SUBSCRIBE("moveDragAreaView")]() {
    const e = this.$config.get("bodyEvent");
    const targetMousePoint = this.$viewport.getWorldPosition();

    const newDist = vec3.floor(
      [],
      vec3.subtract([], targetMousePoint, this.initMousePoint)
    );

    if (e.shiftKey) {
      newDist[1] = newDist[0];
    }

    const startVertex = vec3.floor([], this.initMousePoint);
    const endVertex = vec3.floor(
      [],
      vec3.add([], this.initMousePoint, newDist)
    );

    const start = this.$viewport.applyVertex(startVertex);
    const end = this.$viewport.applyVertex(endVertex);

    const locaRect = toRectVerties([start, end]);

    this.dragRect = {
      left: locaRect[0][0],
      top: locaRect[0][1],
      width: Math.abs(locaRect[1][0] - locaRect[0][0]),
      height: Math.abs(locaRect[3][1] - locaRect[0][1]),
    };

    this.trigger("drawAreaView", {
      left: Length.px(this.dragRect.left),
      top: Length.px(this.dragRect.top),
      width: Length.px(this.dragRect.width),
      height: Length.px(this.dragRect.height),
    });

    var { left: x, top: y, width, height } = this.dragRect;
    var rect = {
      x,
      y,
      width,
      height,
    };

    const selectedItems = this.getSelectedItems(
      rect,
      toRectVertiesWithoutTransformOrigin([startVertex, endVertex])
    );

    if (this.$selection.selectByGroup(...selectedItems)) {
      this.emit("refreshSelection");
      this.emit("refreshSelectionTool", true);
    }
  }

  [SUBSCRIBE("endDragAreaView")]() {
    const targetMousePoint = this.$viewport.getWorldPosition();
    const newDist = vec3.floor(
      [],
      vec3.subtract([], targetMousePoint, this.initMousePoint)
    );
    this.$config.init("set.move.control.point", false);

    if (newDist[0] === 0 && newDist[1] === 0) {
      this.$selection.empty();
    }

    this.trigger("initDrawAreaView");

    this.$selection.reselect();
    this.emit("history.refreshSelection");
    this.emit("refreshSelectionTool", true);

    this.emit("removeGuideLine");
  }
}
