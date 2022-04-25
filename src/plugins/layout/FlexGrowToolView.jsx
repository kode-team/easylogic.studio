import { CONFIG, DOMDIFF, LOAD, POINTERSTART, SUBSCRIBE, THROTTLE } from "sapa";

import "./FlexGrowToolView.scss";

import { END, MOVE } from "elf/editor/types/event";
import { FlexDirection, Layout, ResizingMode } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

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

          if (parentLayoutDirection === FlexDirection.ROW) {
            if (child.resizingHorizontal === ResizingMode.FILL_CONTAINER) {
              flexGrow = child["flex-grow"] || 1;
            }
            size = child.screenWidth;
          } else if (parentLayoutDirection === FlexDirection.COLUMN) {
            if (child.resizingVertical === ResizingMode.FILL_CONTAINER) {
              flexGrow = child["flex-grow"] || 1;
            }

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
              <span class="size">{Math.floor(size)}</span>{" "}
              <span class="grow">{flexGrow || "x"}</span>
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

  getFlexGrow(parentLayoutDirection, item, grow, dx, dy) {
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

    return flexGrow;
  }

  move(dx, dy) {
    const { id, grow } = this.state;

    const item = this.$editor.get(id);
    if (!item) return;

    const parentItem = item.parent;
    if (!parentItem) return;

    const parentLayoutDirection = parentItem["flex-direction"];

    let flexGrow = this.getFlexGrow(parentLayoutDirection, item, grow, dx, dy);

    this.emit("setAttributeForMulti", {
      [id]: {
        "flex-grow": flexGrow,
      },
    });
  }

  end(dx, dy) {
    const { id, grow } = this.state;

    const item = this.$editor.get(id);
    if (!item) return;

    const parentItem = item.parent;
    if (!parentItem) return;

    const parentLayoutDirection = parentItem["flex-direction"];

    let flexGrow = this.getFlexGrow(parentLayoutDirection, item, grow, dx, dy);

    if (dx === 0 && dy === 0) {
      // 이 때 flex-grow 를 1로 다시 맞춘다.
      if (
        parentLayoutDirection === FlexDirection.ROW &&
        item.resizingHorizontal !== ResizingMode.FILL_CONTAINER
      ) {
        this.command("setAttributeForMulti", "change self resizing", {
          [id]: {
            "flex-grow": 1,
            resizingHorizontal: ResizingMode.FILL_CONTAINER,
          },
        });
      } else if (
        parentLayoutDirection === FlexDirection.COLUMN &&
        item.resizingVertical !== ResizingMode.FILL_CONTAINER
      ) {
        this.command("setAttributeForMulti", "change self resizing", {
          [id]: {
            "flex-grow": 1,
            resizingVertical: ResizingMode.FILL_CONTAINER,
          },
        });
      }
    } else {
      this.command("setAttributeForMulti", "change self resizing", {
        [id]: {
          "flex-grow": flexGrow,
        },
      });
    }

    this.nextTick(() => {
      this.refresh();
    }, 10);
  }

  [SUBSCRIBE("updateViewport")]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSelection") + THROTTLE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSelectionStyleView") + THROTTLE(1)]() {
    this.refresh();
  }

  [CONFIG("set.move.control.point")]() {
    this.refresh();
  }
}
