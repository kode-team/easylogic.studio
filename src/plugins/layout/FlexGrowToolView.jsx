import { END, MOVE } from "el/editor/types/event";
import { FlexDirection, Layout, ResizingMode } from "el/editor/types/model";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { Length } from "el/editor/unit/Length";
import {
  DOMDIFF,
  LOAD,
  POINTERSTART,
  SUBSCRIBE,
  THROTTLE,
} from "el/sapa/Event";

import "./FlexGrowToolView.scss";

export default class FlexGrowToolView extends EditorElement {
  template() {
    return <div class="elf--flex-grow-tool-view"></div>;
  }

  [LOAD("$el") + DOMDIFF]() {
    return this.$selection.map((item) => {
      const parentItem = item.parent;

      if (!parentItem) return;
      if (parentItem.is("project")) return;
      if (parentItem.isLayout(Layout.FLEX) === false) return;

      return parentItem.layers
        .map((child) => {
          const verties = this.$viewport.applyVerties(child.verties);
          const center = verties[4];
          let flexGrow = 0;
          let size = child.screenWidth || 0;

          const parentLayoutDirection = parentItem?.["flex-direction"];
          if (
            parentLayoutDirection === FlexDirection.ROW &&
            child.resizingHorizontal === ResizingMode.FILL_CONTAINER
          ) {
            flexGrow = child["flex-grow"] || 1;
            size = child.screenWidth;
          } else if (
            parentLayoutDirection === FlexDirection.COLUMN &&
            child.resizingVertical === ResizingMode.FILL_CONTAINER
          ) {
            flexGrow = child["flex-grow"] || 1;
            size = child.screenHeight;
          }

          return (
            <div
              class="flex-grow-item"
              style={{
                left: Length.px(center[0]),
                top: Length.px(center[1]),
              }}
              data-flex-item-id={child.id}
              data-parent-direction={parentLayoutDirection}
              data-flex-grow={flexGrow}
            >
              {size} | {flexGrow || "none"}
            </div>
          );
        })
        .join("");
    });
  }

  [POINTERSTART("$el .flex-grow-item") + MOVE() + END()](e) {
    const [id, grow] = e.$dt.attrs("data-flex-item-id", "data-flex-grow");

    this.state = {
      id,
      grow: +grow,
    };
  }

  move(dx, dy) {
    const { id, grow } = this.state;

    const item = this.$editor.get(id);
    if (!item) return;

    const parentItem = item.parent;
    if (!parentItem) return;

    const parentLayoutDirection = parentItem["flex-direction"];

    let flexGrow = grow;

    if (
      parentLayoutDirection === FlexDirection.ROW &&
      item.resizingHorizontal === ResizingMode.FILL_CONTAINER
    ) {
      flexGrow = grow + Math.floor(dx / 10);
    } else if (
      parentLayoutDirection === FlexDirection.COLUMN &&
      item.resizingVertical === ResizingMode.FILL_CONTAINER
    ) {
      flexGrow = grow + Math.floor(dy / 10);
    }

    flexGrow = Math.max(1, flexGrow);

    this.emit("setAttributeForMulti", {
      [id]: {
        "flex-grow": flexGrow,
      },
    });
  }

  end() {}

  [SUBSCRIBE("updateViewport")]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSelection") + THROTTLE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSelectionStyleView") + THROTTLE(1)]() {
    this.refresh();
  }
}
