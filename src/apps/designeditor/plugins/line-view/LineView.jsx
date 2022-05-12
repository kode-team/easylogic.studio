import { CONFIG, SUBSCRIBE, LOAD, DOMDIFF, POINTERSTART } from "sapa";

import "./LineView.scss";

import {
  UPDATE_VIEWPORT,
  UPDATE_CANVAS,
  MOVE,
  END,
} from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class LineView extends EditorElement {
  template() {
    return <div class="elf--line-view sepia(0.2)"></div>;
  }

  /**
   * CanvasView 모드일 때만  HoverView 동작하도록 설정
   */
  [CONFIG("vertical.line")]() {
    this.refresh();
  }

  [CONFIG("horizontal.line")]() {
    this.refresh();
  }

  [SUBSCRIBE(UPDATE_VIEWPORT, UPDATE_CANVAS)]() {
    this.refresh();
  }

  [LOAD("$el") + DOMDIFF]() {
    return [
      ...this.$config.get("vertical.line").map((it, index) => {
        const screen = this.$viewport.applyVertex([0, it, 0]);

        return (
          <div
            class="vertical-line"
            data-index={index}
            style={`transform: translate3d(0px, ${screen[1]}px, 0px);`}
          ></div>
        );
      }),
      ...this.$config.get("horizontal.line").map((it, index) => {
        const screen = this.$viewport.applyVertex([it, 0, 0]);

        return (
          <div
            class="horizontal-line"
            data-index={index}
            style={`transform: translate3d(${screen[0]}px, 0px, 0px);`}
          ></div>
        );
      }),
    ];
  }

  [POINTERSTART("$el .horizontal-line") +
    MOVE("moveHorizontalLine") +
    END("moveEndHorizontalLine")](e) {
    this.startIndex = +e.$dt.data("index");
    this.$context.snapManager.clear();
  }

  moveHorizontalLine() {
    const newPos = this.$context.snapManager.getWorldPosition();
    this.$config.setIndexValue("horizontal.line", this.startIndex, newPos[0]);
  }

  moveEndHorizontalLine() {
    this.$commands.emit("recoverCursor");
  }

  [POINTERSTART("$el .vertical-line") +
    MOVE("moveVerticalLine") +
    END("moveEndVerticalLine")](e) {
    this.startIndex = +e.$dt.data("index");
    this.$context.snapManager.clear();
  }

  moveVerticalLine() {
    const newPos = this.$context.snapManager.getWorldPosition();
    this.$config.setIndexValue("vertical.line", this.startIndex, newPos[1]);
  }

  moveEndVerticalLine() {
    this.$commands.emit("recoverCursor");
  }
}
