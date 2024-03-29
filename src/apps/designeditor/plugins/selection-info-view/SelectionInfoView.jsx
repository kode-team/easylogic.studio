import { vec3 } from "gl-matrix";

import { DOMDIFF, LOAD, POINTERSTART, SUBSCRIBE } from "sapa";

import "./SelectionInfoView.scss";

import { calculateAngle360 } from "elf/core/math";
import { iconUse } from "elf/editor/icon/icon";
import {
  END,
  MOVE,
  UPDATE_VIEWPORT,
  UPDATE_CANVAS,
  FIRSTMOVE,
  REFRESH_SELECTION_TOOL,
} from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class SelectionInfoView extends EditorElement {
  template() {
    return <div class="elf--selection-info-view"></div>;
  }

  /**
   * 드래그 해서 객체 옮기기
   *
   * ctrl + pointerstart 하는  시점에 카피해보자.
   *
   * @param {PointerEvent} e
   */
  [POINTERSTART("$el [data-artboard-title-id]") +
    FIRSTMOVE("calculateFirstMovedElement") +
    MOVE("calculateMovedElement") +
    END("calculateEndedElement")](e) {
    this.startXY = e.xy;
    this.initMousePoint = this.$viewport.getWorldPosition(e);
    const id = e.$dt.attr("data-artboard-title-id");
    this.$context.selection.select(id);

    // alt(option) + pointerstart 시점에 Layer 카피하기
    if (e.altKey) {
      // 선택된 모든 객체 카피하기
      this.$commands.emit("history.copyLayer", "copy");
      // this.$context.selection.selectAfterCopy();
      // this.emit("refreshAllCanvas");
      // this.emit("refreshLayerTreeView");
    }

    this.initializeDragSelection();
  }

  initializeDragSelection() {
    this.$context.selection.reselect();
    this.$context.snapManager.clear();
  }

  moveTo(dist) {
    //////  snap 체크 하기
    const snap = this.$context.snapManager.check(
      this.$context.selection.cachedRectVerties.map((v) => {
        return vec3.add([], v, dist);
      }),
      3 / this.$viewport.scale
    );

    const localDist = vec3.add([], snap.dist, dist);

    const result = {};
    this.$context.selection.cachedItemMatrices.forEach((it) => {
      // newVerties 에 실제 움직인 좌표로 넣고
      const newVerties = it.verties.map((v) => {
        return vec3.add([], v, localDist);
      });

      // 첫번째 좌표 it.rectVerties[0] 과
      // 마지막 좌표 newVerties[0] 를
      // parentMatrixInverse 기준으로 다시 원복하고 거리를 잰다
      // 그게 실제적인 distance 이다.
      const newDist = vec3.subtract(
        [],
        vec3.transformMat4([], newVerties[0], it.parentMatrixInverse),
        vec3.transformMat4([], it.verties[0], it.parentMatrixInverse)
      );

      result[it.id] = {
        x: Math.floor(it.x + newDist[0]), // 1px 단위로 위치 설정
        y: Math.floor(it.y + newDist[1]),
      };
    });
    this.$context.selection.reset(result);
  }

  calculateFirstMovedElement() {
    this.$config.set("set.move.control.point", true);
    this.emit(REFRESH_SELECTION_TOOL);
  }

  calculateMovedElement() {
    const targetMousePoint = this.$viewport.getWorldPosition();

    const newDist = vec3.floor(
      [],
      vec3.subtract([], targetMousePoint, this.initMousePoint)
    );

    this.moveTo(newDist);

    this.$commands.emit("setAttribute", this.$context.selection.pack("x", "y"));
    // this.emit(UPDATE_CANVAS);
    this.refresh();
  }

  /**
   * ArtBoard title 변경하기
   * @param {string} id
   * @param {string} title
   */
  [SUBSCRIBE("refreshItemName")](id, title) {
    this.$commands.emit("setAttribute", {
      [id]: { name: title },
    });
    this.$el.$(`[data-artboard-title-id='${id}']`)?.text(title);
  }

  calculateEndedElement() {
    this.$commands.executeCommand(
      "setAttribute",
      "move item",
      this.$context.selection.pack("x", "y")
    );
    this.$config.set("set.move.control.point", false);
    this.emit(REFRESH_SELECTION_TOOL);
    this.$commands.emit("history.refreshSelection");
  }

  [SUBSCRIBE(UPDATE_VIEWPORT)]() {
    this.refresh();
  }

  [SUBSCRIBE(UPDATE_CANVAS)]() {
    if (this.$context.selection.current) {
      if (this.$context.selection.current.is("artboard")) {
        if (
          this.$context.selection.hasChangedField(
            "x",
            "y",
            "width",
            "height",
            "angle",
            "transform",
            "transform-origin"
          )
        ) {
          this.refresh();
        }
      }
    }
  }

  [LOAD("$el") + DOMDIFF]() {
    return this.$context.selection.currentProject?.artboards
      .map((it) => {
        return {
          item: it,
          title: it.name,
          id: it.id,
          layout: it.layout,
          pointers: this.$viewport.applyVerties(it.verties),
        };
      })
      .map((it) => this.makeArtboardTitleArea(it));
  }

  getIcon(item) {
    if (item.hasLayout() || item.hasChildren() || item.is("artboard")) {
      if (item.isLayout("flex")) {
        return iconUse(
          "layout_flex",
          item.flexDirection === "column" ? "rotate(90 12 12)" : ""
        );
      } else if (item.isLayout("grid")) {
        return iconUse("layout_grid");
      }

      return "";
    }

    return this.$icon.get(item.itemType, item);
  }

  createSize(pointers, artboardItem) {
    const newPointer = pointers[0];
    const diff = vec3.subtract([], pointers[0], pointers[3]);
    const angle = calculateAngle360(diff[0], diff[1]) - 90;

    return (
      <div
        class="artboard-title is-not-drag-area"
        data-artboard-title-id={artboardItem.id}
        data-layout={artboardItem.layout}
        style={{
          "transform-origin": "0% 0%",
          transform: `translate3d( calc(${newPointer[0]}px), calc(${newPointer[1]}px), 0px) rotateZ(${angle}deg)`,
        }}
      >
        <div style="transform: translateY(-100%);">
          {this.getIcon(artboardItem.item)}
          {artboardItem.title}
        </div>
      </div>
    );
  }

  makeArtboardTitleArea(it) {
    return this.createSize(it.pointers, it);
  }

  [SUBSCRIBE("refreshAll")]() {
    this.refresh();
  }

  [SUBSCRIBE("appendLayer")]() {
    this.refresh();
  }
}
