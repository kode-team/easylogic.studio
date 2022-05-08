import {
  LOAD,
  DEBOUNCE,
  CLICK,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  DOMDIFF,
  IF,
  createComponent,
} from "sapa";

import { iconUse } from "elf/editor/icon/icon";
import { UPDATE_CANVAS, REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

var transformList = [
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "rotate3d",
  "skew",
  "skewX",
  "skewY",
  "translate",
  "translateX",
  "translateY",
  "translateZ",
  "translate3d",
  "perspective",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "scale3d",
  "matrix",
  "matrix3d",
];

export default class TransformProperty extends BaseProperty {
  isFirstShow() {
    return true;
  }

  getTitle() {
    return this.$i18n("transform.property.title");
  }

  getBody() {
    return /*html*/ `
      ${createComponent("RotateEditorView")}
      <div class='full transform-property' ref='$body'></div>
    `;
  }

  hasKeyframe() {
    return true;
  }

  getKeyframeProperty() {
    return "transform";
  }

  getTools() {
    return /*html*/ `
      <select ref="$transformSelect">
      ${transformList
        .map((transform) => {
          var label = this.$i18n("css.item." + transform);
          return `<option value='${transform}'>${label}</option>`;
        })
        .join("")}
      </select>
      <button type="button" ref="$add" title="add Filter">${iconUse(
        "add"
      )}</button>
    `;
  }

  [CLICK("$add")]() {
    var transformType = this.refs.$transformSelect.value;

    this.children.$transformEditor.trigger("add", transformType);
  }

  [LOAD("$body") + DOMDIFF]() {
    var current = this.$context.selection.current || {};
    var value = current.transform;

    return createComponent("TransformEditor", {
      ref: "$transformEditor",
      value,
      hideLabel: true,
      onchange: "changeTransformEditor",
    });
  }

  [SUBSCRIBE_SELF("changeTransformEditor")](transform) {
    this.$commands.executeCommand(
      "setAttribute",
      "change transform property",
      this.$context.selection.packByValue({
        transform,
      })
    );
  }

  refresh() {
    this.children.$transformEditor.setValue(
      this.$context.selection.current.transform
    );
  }

  get editableProperty() {
    return "transform";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + IF("checkShow")]() {
    this.refresh();
  }

  [SUBSCRIBE(UPDATE_CANVAS) + DEBOUNCE(100)]() {
    const current = this.$context.selection.current;

    if (current) {
      if (current.hasChangedField("transform")) {
        this.refresh();
      }
    }
  }
}
