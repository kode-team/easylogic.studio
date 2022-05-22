import { vec3 } from "gl-matrix";

import {
  BIND,
  CONFIG,
  DRAGOVER,
  DROP,
  IF,
  normalizeWheelEvent,
  POINTERSTART,
  PREVENT,
  SUBSCRIBE,
  WHEEL,
  Dom,
  createComponent,
} from "sapa";

import "./CanvasView.scss";
import DragAreaRectView from "./render-view/draw-panels/DragAreaRectView";
import DragAreaView from "./render-view/draw-panels/DragAreaView";
import HTMLRenderView from "./render-view/html-render-view/HTMLRenderView";
import PageTools from "./render-view/util-panels/PageTools";

import { EditingMode } from "elf/editor/types/editor";
import {
  UPDATE_VIEWPORT,
  END,
  MOVE,
  RESIZE_WINDOW,
  RESIZE_CANVAS,
} from "elf/editor/types/event";
import { KEY_CODE } from "elf/editor/types/key";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class CanvasView extends EditorElement {
  components() {
    return {
      PageTools,
      DragAreaRectView,
      HTMLRenderView,
      DragAreaView,
    };
  }

  initState() {
    return {
      cursor: "auto",
      cursorArgs: [],
    };
  }

  afterRender() {
    // 그려진 이후에 시간차를 두고 크기를 구해야한다.
    this.nextTick(() => {
      // 캔버스 사이즈를 먼저 정의하고
      this.refreshCanvasSize();
      // 가운데로 움직인다.
      this.$commands.emit("moveSelectionToCenter", true);
      // 커서를 바꾼다.
      this.refreshCursor();
    });
  }
  template() {
    return (
      <div class="elf--page-container" tabIndex="-1" ref="$container">
        <div class="page-view" ref="$pageView">
          <div class="page-lock scrollbar" ref="$lock">
            <DragAreaView ref="$dragArea" />
            <HTMLRenderView ref="$htmlRenderView" />
            <DragAreaRectView ref="$dragAreaRectView" />

            {this.$injectManager.generate("canvas.view", true)}
          </div>
        </div>
        ${createComponent("PageTools", { ref: "pageTools" })}
      </div>
    );
  }

  [BIND("$pageView")]() {
    return {
      style: {
        "--elf--canvas-background-color": this.$config.get(
          "style.canvas.background.color"
        ),
      },
    };
  }

  // space 키가 눌러져 있을 때만 실행한다.
  checkSpace() {
    // hand 툴이 on 되어 있으면 항상 드래그 모드가 된다.
    if (this.$config.is("editing.mode", EditingMode.HAND)) {
      return true;
    }

    return this.$context.keyboardManager.check(
      this.$context.shortcuts.getGeneratedKeyCode(KEY_CODE.space)
    );
  }

  [POINTERSTART("$lock") +
    IF("checkSpace") +
    MOVE("movePan") +
    END("moveEndPan")]() {
    this.startMovePan();
  }

  [CONFIG("editing.mode")]() {
    if (this.$config.is("editing.mode", EditingMode.HAND)) {
      this.startMovePan();

      this.$commands.emit("refreshCursor", "grab");
    } else {
      this.$commands.emit("recoverCursor", "auto");
    }
  }

  startMovePan() {
    this.lastDist = vec3.create();
  }

  movePan(dx, dy) {
    this.$commands.emit("refreshCursor", "grabbing");
    const currentDist = vec3.fromValues(dx, dy, 0);
    this.$viewport.pan(
      ...vec3.transformMat4(
        [],
        vec3.subtract([], this.lastDist, currentDist),
        this.$viewport.scaleMatrixInverse
      )
    );
    this.lastDist = currentDist;
  }

  refreshCursor() {
    if (this.$config.is("editing.mode", EditingMode.HAND)) {
      this.$commands.emit("refreshCursor", "grab");
    } else {
      this.$commands.emit("refreshCursor", "auto");
    }
  }

  moveEndPan() {
    this.refreshCursor();
  }

  [DRAGOVER("$lock") + PREVENT]() {}
  [DROP("$lock") + PREVENT](e) {
    const newCenter = this.$viewport.getWorldPosition(e);

    if (e.dataTransfer.getData("text/asset")) {
      this.$commands.emit("drop.asset", {
        asset: { id: e.dataTransfer.getData("text/asset"), center: newCenter },
      });
    } else {
      // const files = Resource.getAllDropItems(e);
      const id = Dom.create(e.target).attr("data-id");

      if (id) {
        this.$commands.emit(
          "drop.asset",
          {
            gradient: e.dataTransfer.getData("text/gradient"),
            pattern: e.dataTransfer.getData("text/pattern"),
            color: e.dataTransfer.getData("text/color"),
            imageUrl: e.dataTransfer.getData("image/info"),
          },
          id
        );
      } else {
        const imageUrl = e.dataTransfer.getData("image/info");
        this.$commands.emit("dropImageUrl", imageUrl);
      }
    }
  }

  /**
   * wheel 은 제어 할 수 있다.
   *  내 위치를 나타낼려면 wheel 로 제어해야한다.
   * transform-origin 을 현재 보고 있는 시점의 좌표로 맞출 수 있어야 한다.
   * 그런 다음 scale 을 한다.
   * // 내 마우스 위치를
   */
  [WHEEL("$lock") + PREVENT](e) {
    const [dx, dy] = normalizeWheelEvent(e);

    if (!this.state.gesture) {
      if (e.ctrlKey) {
        this.$viewport.setMousePoint(e.clientX, e.clientY);
      }

      this.emit("startGesture");
      this.state.gesture = true;
    } else {
      if (e.ctrlKey) {
        const zoomFactor = 1 - (2.5 * dy) / 100;

        this.$viewport.zoom(zoomFactor);
      } else {
        const newDx = -2.5 * dx;
        const newDy = -2.5 * dy;

        this.$viewport.pan(
          -newDx / this.$viewport.scale,
          -newDy / this.$viewport.scale,
          0
        );
      }
    }

    window.clearTimeout(this.state.timer);
    this.state.timer = window.setTimeout(() => {
      this.state.gesture = undefined;
      this.emit("endGesture");
    }, 200);
  }

  refreshCanvasSize() {
    this.$viewport.refreshCanvasSize(this.refs.$lock.rect());
  }

  [SUBSCRIBE(RESIZE_WINDOW, RESIZE_CANVAS)]() {
    this.refreshCanvasSize();
  }

  [SUBSCRIBE(UPDATE_VIEWPORT)]() {
    this.$commands.emit("refreshCursor", "auto");
  }
}
