import BaseProperty from "./BaseProperty";
import { INPUT, CLICK } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";

export default class SizeProperty extends BaseProperty {
  isHideHeader() {
    return true;
  }

  afterRender() {
    setTimeout(() => {
      this.emit("caculateSize", "caculateSizeProperty");
    }, 1000);
  }

  [EVENT("caculateSizeProperty")](data) {
    this.refs.$width.val(data.width.value);
    this.refs.$height.val(data.height.value);
  }

  getBody() {
    return html`
      <div class="property-item size-item">
        <div class="width">
          <input type="number" ref="$width" min="1" />
          <label>Width</label>
        </div>
        <div class="tool">
          <button type="button" data-value="fixed" ref="$fixSize">
            ${icon.arrowRight}
          </button>
        </div>
        <div class="height">
          <input type="number" ref="$height" min="1" />
          <label>Height</label>
        </div>
      </div>
    `;
  }

  [INPUT("$width")]() {
    this.setSize({
      width: Length.px(+this.getRef("$width").value)
    });
  }

  [INPUT("$height")]() {
    this.setSize({
      height: Length.px(+this.getRef("$height").value)
    });
  }

  [CLICK("$fixSize")]() {
    var width = Length.px(+this.getRef("$width").value);
    this.getRef("$height").val(+width);

    this.setSize({
      width,
      height: width
    });
  }

  setSize(data) {
    var current = editor.selection.current;
    if (current) {
      current.setSize(data);

      this.emit("refreshCanvas");
    }
  }
}
