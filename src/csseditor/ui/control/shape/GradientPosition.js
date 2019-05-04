import UIElement, { EVENT } from "../../../../util/UIElement";
import { WHITE_STRING } from "../../../../util/css/types";
import { POINTERSTART, MOVE } from "../../../../util/Event";
import { isString } from "../../../../util/functions/func";
import { Position, Length } from "../../../../editor/unit/Length";
import { editor } from "../../../../editor/editor";

const DEFINE_POSITIONS = {
  [Position.CENTER]: [Position.CENTER, Position.CENTER],
  [Position.RIGHT]: [Position.RIGHT, Position.CENTER],
  [Position.TOP]: [Position.CENTER, Position.TOP],
  [Position.LEFT]: [Position.LEFT, Position.CENTER],
  [Position.BOTTOM]: [Position.CENTER, Position.BOTTOM]
};

export default class GradientPosition extends UIElement {
  template() {
    return `
        <div class="drag-position">
            <div ref="$dragPointer" class="drag-pointer"></div>
        </div>
    `;
  }

  refresh() {
    this.refreshUI();
  }

  getCurrentXY(isUpdate, position) {
    if (isUpdate) {
      var xy = editor.config.get("pos");

      return [xy.x, xy.y];
    }

    var { minX, minY, maxX, maxY, width, height } = this.getRectangle();

    let p = position;

    if (isString(p) && DEFINE_POSITIONS[p]) {
      p = DEFINE_POSITIONS[p];
    } else if (isString(p)) {
      p = p.split(WHITE_STRING);
    }

    p = p.map((item, index) => {
      if (item == Position.CENTER) {
        if (index == 0) {
          return minX + width / 2;
        } else if (index == 1) {
          return minY + height / 2;
        }
      } else if (item === Position.LEFT) {
        return minX;
      } else if (item === Position.RIGHT) {
        return maxX;
      } else if (item === Position.TOP) {
        return minY;
      } else if (item === Position.BOTTOM) {
        return maxY;
      } else {
        if (index == 0) {
          return minX + width * (+item / 100);
        } else if (index == 1) {
          return minY + height * (+item / 100);
        }
      }
    });

    return p;
  }

  getRectangle() {
    var width = this.$el.width();
    var height = this.$el.height();
    var minX = this.$el.offsetLeft();
    var minY = this.$el.offsetTop();

    var maxX = minX + width;
    var maxY = minY + height;

    return { minX, minY, maxX, maxY, width, height };
  }

  getDefaultValue() {
    return this.radialPosition || Position.CENTER;
  }

  refreshUI(isUpdate) {
    var { minX, minY, maxX, maxY, width, height } = this.getRectangle();
    var [x, y] = this.getCurrentXY(isUpdate, this.getDefaultValue());

    x = Math.max(Math.min(maxX, x), minX);
    y = Math.max(Math.min(maxY, y), minY);

    var left = x - minX;
    var top = y - minY;

    this.refs.$dragPointer.px("left", left);
    this.refs.$dragPointer.px("top", top);

    if (isUpdate) {
      this.setRadialPosition([
        Length.percent(Math.floor((left / width) * 100)),
        Length.percent(Math.floor((top / height) * 100))
      ]);
    }
  }

  setRadialPosition(radialPosition) {
    this.emit("changeGradientPosition", radialPosition);
  }

  // Event Bindings
  move() {
    this.refreshUI(true);
  }

  [POINTERSTART() + MOVE()](e) {}

  [EVENT("showGradientPosition")](radialPosition) {
    this.radialPosition = radialPosition;
    this.$el.show();
    this.refresh();
  }

  [EVENT("hideGradientPosition")]() {
    this.$el.hide();
  }
}
