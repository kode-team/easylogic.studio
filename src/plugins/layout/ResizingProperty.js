import {
  CLICK,
  DEBOUNCE,
  DOMDIFF,
  LOAD,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
} from "sapa";

import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

import "./ResizingProperty.scss";
import { ResizingMode } from "elf/editor/types/model";
import { iconUse } from "elf/editor/icon/icon";
import { createComponent } from "sapa";

export default class ResizingProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("layout.property.resizing.title");
  }

  getClassName() {
    return "elf--resizing-property";
  }

  getBody() {
    return /*html*/ `
        <div ref='$body'>
          <div class="resizing-mode">
            <div class="resizing-box" ref="$resizingModeInfo"></div>
            <div ref="$resizingModeInfoInput"></div>
          </div>
        </div>
      `;
  }

  [LOAD("$resizingModeInfo") + DOMDIFF]() {
    var current = this.$selection.current || {};

    const h = current.resizingHorizontal || ResizingMode.FIXED;
    const v = current.resizingVertical || ResizingMode.FIXED;

    return /*html*/ `
      <div class="resizing-mode-box" data-horizontal="${h}" data-vertical="${v}">
        <div class="rect">
          <div class="vertical" data-key="resizingVertical">
            <div class="vertical-top">${iconUse("keyboard_arrow_down")}</div>
            <div class="vertical-bottom">${iconUse("keyboard_arrow_up")}</div>
          </div>
          <div class="horizontal" data-key="resizingHorizontal">
            <div class="horizontal-left">${iconUse(
              "keyboard_arrow_right"
            )}</div>
            <div class="horizontal-right">${iconUse(
              "keyboard_arrow_left"
            )}</div>
          </div>
          <div class="inner-rect"></div>
          <div class="inner-horizontal-rect"></div>
          <div class="inner-vertical-rect"></div>
        </div>
      </div>
    `;
  }

  makeOptionsForHorizontal() {
    const options = [
      { value: ResizingMode.FIXED, text: "Fixed Width" },
      { value: ResizingMode.HUG_CONTENT, text: "Hug Content" },
    ];

    return options;
  }

  makeOptionsForVertical() {
    const options = [
      { value: ResizingMode.FIXED, text: "Fixed Height" },
      { value: ResizingMode.HUG_CONTENT, text: "Hug Content" },
    ];

    return options;
  }

  [LOAD("$resizingModeInfoInput")]() {
    var current = this.$selection.current || {};

    // const h = current.resizingHorizontal;
    // const v = current.reisizngModeVertical;
    return /*html*/ `
      <div class="has-label-grid">
        <label data-direction="horizontal"></label>
        ${createComponent("SelectEditor", {
          ref: "$resizingHorizontal",
          key: "resizingHorizontal",
          value: current?.resizingHorizontal || ResizingMode.FIXED,
          options: this.makeOptionsForHorizontal(),
          onchange: "changeResizingMode",
        })}
      </div>

      <div class="has-label-grid">
      <label data-direction="vertical"></label>
        ${createComponent("SelectEditor", {
          ref: "$resizingVertical",
          key: "resizingVertical",
          value: current?.resizingVertical || ResizingMode.FIXED,
          options: this.makeOptionsForVertical(),
          onchange: "changeResizingMode",
        })}
      </div>
    `;
  }

  [CLICK("$resizingModeInfo [data-key]")](e) {
    const key = e.$dt.data("key");

    const current = this.$selection.current;

    if (current[key] === ResizingMode.FIXED) {
      this.trigger("changeResizingMode", key, ResizingMode.HUG_CONTENT);
    } else {
      this.trigger("changeResizingMode", key, ResizingMode.FIXED);
    }
  }

  [SUBSCRIBE_SELF("changeResizingMode")](key, value) {
    this.command(
      "setAttributeForMulti",
      "apply constraints",
      this.$selection.packByValue({
        [key]: value,
      })
    );

    this.nextTick(() => {
      this.refresh();
    }, 100);
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100)]() {
    this.refreshShow(() => {
      var current = this.$selection.current;

      return current && current.hasLayout();
    });
  }
}
