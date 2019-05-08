import { getXYInCircle, calculateAngle } from "../../../../util/functions/math";
import UIElement, { EVENT } from "../../../../util/UIElement";
import {
  CHANGE_EDITOR,
  CHANGE_SELECTION,
  CHANGE_LAYER,
  CHANGE_TOOL
} from "../../../types/event";
import { POINTERSTART, MOVE } from "../../../../util/Event";
import { isUndefined } from "../../../../util/functions/func";
import { editor } from "../../../../editor/editor";

export default class LayerAngle extends UIElement {
  template() {
    return `
            <div class='drag-angle-rect'>
                <div class="drag-angle" ref="$dragAngle">
                    <div ref="$angleText" class="angle-text"></div>
                    <div ref="$dragPointer" class="drag-pointer"></div>
                </div>
            </div>
        `;
  }

  refresh() {
    if (this.isShow()) {
      this.$el.show();
      this.refreshUI();
    } else {
      this.$el.hide();
    }
  }

  isShow() {
    if (!editor.selection.layer) return false;
    return editor.config.get("guide.angle");
  }

  getCurrentXY(isUpdate, angle, radius, centerX, centerY) {
    return isUpdate
      ? editor.config.get("pos")
      : getXYInCircle(angle, radius, centerX, centerY);
  }

  getRectangle() {
    var width = this.refs.$dragAngle.width();
    var height = this.refs.$dragAngle.height();
    var radius = Math.floor((width / 2) * 0.7);
    var { left, top } = this.refs.$dragAngle.offset();
    var minX = left;
    var minY = top;
    var centerX = minX + width / 2;
    var centerY = minY + height / 2;

    return { minX, minY, width, height, radius, centerX, centerY };
  }

  getDefaultValue() {
    var layer = editor.selection.layer;
    if (!layer) return -90;
    if (isUndefined(layer.rotate)) return -90;

    return layer.rotate - 90;
  }

  refreshAngleText(angleText) {
    this.refs.$angleText.text(angleText + " °");
  }

  refreshUI(isUpdate) {
    var { minX, minY, radius, centerX, centerY } = this.getRectangle();
    var { x, y } = this.getCurrentXY(
      isUpdate,
      this.getDefaultValue(),
      radius,
      centerX,
      centerY
    );

    var rx = x - centerX,
      ry = y - centerY,
      angle = calculateAngle(rx, ry);

    {
      var { x, y } = this.getCurrentXY(null, angle, radius, centerX, centerY);
    }

    // set drag pointer position
    this.refs.$dragPointer.px("left", x - minX);
    this.refs.$dragPointer.px("top", y - minY);

    var lastAngle = Math.round(angle + 90) % 360;

    this.refreshAngleText(lastAngle);

    if (isUpdate) {
      this.setAngle(lastAngle);
    }
  }

  setAngle(rotate) {
    editor.selection.items.forEach(item => {
      item.rotate =
        (this.cachedRotate[id] + (rotate - this.cachedRotate[id])) % 360;
      this.emit(CHANGE_LAYER);
    });
  }

  [EVENT(CHANGE_LAYER, CHANGE_EDITOR, CHANGE_SELECTION)]() {
    this.refresh();
  }

  [EVENT(CHANGE_TOOL)]() {
    this.$el.toggle(this.isShow());
  }

  // Event Bindings
  move() {
    this.refreshUI(true);
  }

  [POINTERSTART("$dragAngle") + MOVE()](e) {
    this.cachedRotate = {};
    editor.selection.items.forEach(item => {
      this.cachedRotate[item.id] = item.rotate || 0;
    });
    this.refreshUI(e);
  }
}
