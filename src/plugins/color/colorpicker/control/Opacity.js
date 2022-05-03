import { BIND, POINTERSTART, clone } from "sapa";

import * as Color from "elf/core/color";
import { END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class Opacity extends EditorElement {
  initState() {
    return {
      colorbar: Color.parse("rgba(0, 0, 0, 1)"),
      opacity: 0,
      minValue: 0,
      maxValue: 100,
    };
  }

  template() {
    return /*html*/ `
        <div class="opacity">
            <div ref="$container" class="opacity-container">
                <div ref="$colorbar" class="color-bar"></div>
                <div ref="$bar" class="drag-bar2"></div>
            </div>
        </div>
        `;
  }

  [BIND("$colorbar")]() {
    const rgb = clone(this.state.colorbar);

    rgb.a = 0;
    const start = Color.format(rgb, "rgb");

    rgb.a = 1;
    const end = Color.format(rgb, "rgb");

    return {
      style: {
        background: `linear-gradient(to right, ${start}, ${end})`,
      },
    };
  }

  [BIND("$bar")]() {
    const opacity = this.state.opacity * 100;

    return {
      style: {
        left: Length.percent(opacity),
      },
      class: {
        first: opacity <= this.state.minValue,
        last: opacity >= this.state.maxValue,
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
      a: rate.toFixed(2),
    });
  }

  setValue(colorbar, opacity) {
    this.setState({
      opacity,
      colorbar,
    });
  }
}
