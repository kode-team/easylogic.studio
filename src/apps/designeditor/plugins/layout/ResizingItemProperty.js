import {
  CLICK,
  DEBOUNCE,
  DOMDIFF,
  LOAD,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  createComponent,
} from "sapa";

import "./ResizingItemProperty.scss";

import { iconUse } from "elf/editor/icon/icon";
import { REFRESH_SELECTION, UPDATE_CANVAS } from "elf/editor/types/event";
import { ResizingMode, Layout } from "elf/editor/types/model";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class ResizingItemProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("layout.property.resizing.self.title");
  }

  getClassName() {
    return "elf--resizing-item-property";
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
    var current = this.$context.selection.current || {};

    const h = current.resizingHorizontal || ResizingMode.FIXED;
    const v = current.resizingVertical || ResizingMode.FIXED;

    return /*html*/ `
      <div class="resizing-mode-box" data-horizontal="${h}" data-vertical="${v}">
        <div class="rect">
          <div class="tool">
            <div class="vertical">
              <div class="vertical-top" data-key="resizingVertical">${iconUse(
                "keyboard_arrow_up"
              )}</div>
              <div class="vertical-bottom" data-key="resizingVertical">${iconUse(
                "keyboard_arrow_down"
              )}</div>
            </div>
            <div class="horizontal">
              <div class="horizontal-left" data-key="resizingHorizontal">${iconUse(
                "keyboard_arrow_left"
              )}</div>
              <div class="horizontal-right" data-key="resizingHorizontal">${iconUse(
                "keyboard_arrow_right"
              )}</div>
            </div>
          </div>         
          <div class="inner-rect"></div>
        </div>

      </div>
    `;
  }

  makeOptionsForHorizontal() {
    const options = [
      { value: ResizingMode.FIXED, text: "Fixed Width" },
      { value: ResizingMode.FILL_CONTAINER, text: "Fill Container" },
    ];

    return options;
  }

  makeOptionsForVertical() {
    const options = [
      { value: ResizingMode.FIXED, text: "Fixed Height" },
      { value: ResizingMode.FILL_CONTAINER, text: "Fill Container" },
    ];

    return options;
  }

  [LOAD("$resizingModeInfoInput") + DOMDIFF]() {
    var current = this.$context.selection.current || {};

    this.setState(
      {
        resizingHorizontal: current?.resizingHorizontal || ResizingMode.FIXED,
        resizingVertical: current?.resizingVertical || ResizingMode.FIXED,
      },
      false
    );

    return /*html*/ `
      <div class="has-label-grid">
        <label data-direction="horizontal"></label>
        ${createComponent("SelectEditor", {
          ref: "$resizingHorizontal",
          key: "resizingHorizontal",
          value: this.state.resizingHorizontal,
          options: this.makeOptionsForHorizontal(),
          onchange: "changeResizingMode",
        })}
      </div>

      <div class="has-label-grid">
      <label data-direction="vertical"></label>
        ${createComponent("SelectEditor", {
          ref: "$resizingVertical",
          key: "resizingVertical",
          value: this.state.resizingVertical,
          options: this.makeOptionsForVertical(),
          onchange: "changeResizingMode",
        })}
      </div>
    `;
  }

  [CLICK("$resizingModeInfo [data-key]")](e) {
    const key = e.$dt.data("key");

    const current = this.$context.selection.current;

    if (current[key] === ResizingMode.FIXED) {
      this.trigger("changeResizingMode", key, ResizingMode.FILL_CONTAINER);
    } else {
      this.trigger("changeResizingMode", key, ResizingMode.FIXED);
    }
  }

  [SUBSCRIBE_SELF("changeResizingMode")](key, value) {
    this.$commands.executeCommand(
      "setAttribute",
      "apply self resizing",
      this.$context.selection.packByValue({
        [key]: value,
        flexGrow: 1,
      })
    );

    this.nextTick(() => {
      this.refresh();
    }, 100);
  }

  [SUBSCRIBE(REFRESH_SELECTION) + DEBOUNCE(100)]() {
    this.refreshShow(() => {
      var current = this.$context.selection.current;

      return (
        current?.parent?.hasLayout() &&
        current?.parent?.isLayout(Layout.GRID) === false
      );
    });
  }

  [SUBSCRIBE(UPDATE_CANVAS)]() {
    const current = this.$context.selection.current;

    if (current && current.changedLayoutItem) {
      if (
        current.resizingHorizontal !== this.state.resizingHorizontal ||
        current.resizingVertical !== this.state.resizingVertical
      ) {
        this.refresh();
      }
    }
  }
}
