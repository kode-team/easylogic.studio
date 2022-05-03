import { BIND, POINTERSTART } from "sapa";

import { END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class Hue extends EditorElement {
  initState() {
    return {
      hue: 0,
      minValue: 0,
      maxValue: 360,
    };
  }

  template() {
    return /*html*/ `
            <div class="hue">
                <div ref="$container" class="hue-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `;
  }

  [BIND("$bar")]() {
    const hue = this.state.hue;

    return {
      style: {
        left: Length.makePercent(hue, 360),
      },
      class: {
        first: hue <= this.state.minValue,
        last: hue >= this.state.maxValue,
      },
    };
  }

  [POINTERSTART("$container") + MOVE("movePointer") + END("moveEndPointer")]() {
    this.rect = this.refs.$container.rect();

    this.refreshColorUI();
  }

  movePointer() {
    this.refreshColorUI();
  }

  refreshColorUI() {
    const minX = this.rect.left;
    const maxX = this.rect.right;

    const currentX = Math.max(
      Math.min(maxX, this.$config.get("bodyEvent").clientX),
      minX
    );
    const rate = (currentX - minX) / (maxX - minX);

    this.parent.changeColor({
      h: rate * this.state.maxValue,
      type: "hsv",
    });
  }

  setValue(hue) {
    this.setState({
      hue,
    });
  }
}
