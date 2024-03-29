import {
  LOAD,
  CLICK,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  IF,
  createComponent,
  DEBOUNCE,
} from "sapa";

import "./BackgroundImageProperty.scss";

import { iconUse } from "elf/editor/icon/icon";
import { REFRESH_SELECTION, UPDATE_CANVAS } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class BackgroundImageProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("background.image.property.title");
  }

  afterRender() {
    this.show();
  }

  getClassName() {
    return "background-image";
  }

  getBodyClassName() {
    return "no-padding";
  }

  getBody() {
    return <div class="full" ref="$property"></div>;
  }

  getTools() {
    return (
      <div class="fill-sample-list" ref="$add">
        <button type="button" class="fill" data-value="static-gradient">
          {iconUse("add")}
        </button>
        {/* <button type="button" class='fill' data-value="linear-gradient" data-tooltip="Linear" ></button>
      <button type="button" class='fill' data-value="repeating-linear-gradient" data-tooltip="R Linear" ></button>
      <button type="button" class='fill' data-value="radial-gradient" data-tooltip="Radial" ></button>
      <button type="button" class='fill' data-value="repeating-radial-gradient" data-tooltip="R Radial" ></button>
      <button type="button" class='fill' data-value="conic-gradient" data-tooltip="Conic" ></button>
      <button type="button" class='fill' data-value="repeating-conic-gradient" data-tooltip="R Conic" data-direction="bottom right" ></button>
      <button type="button" class='fill' data-value="repeating-conic-gradient" data-tooltip="R Conic" data-direction="bottom right" ></button>         */}
      </div>
    );
  }

  [CLICK("$add [data-value]")](e) {
    this.children.$backgroundImageEditor.trigger("add", e.$dt.data("value"));
  }

  [LOAD("$property")]() {
    var current = this.$context.selection.current || {};
    var value = current.backgroundImage || "";

    return createComponent("BackgroundImageEditor", {
      ref: "$backgroundImageEditor",
      key: "backgroundImage",
      value,
      onchange: "changeBackgroundImage",
    });
  }

  get editableProperty() {
    return "backgroundImage";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + IF("checkShow")]() {
    this.refresh();
  }

  checkCurrentItem(item) {
    return this.$context.selection.current === item;
  }

  [SUBSCRIBE(UPDATE_CANVAS) + IF("checkCurrentItem") + DEBOUNCE(100)]() {
    if (this.$context.selection.current) {
      if (this.$context.selection.hasChangedField("backgroundImage")) {
        this.refresh();
      }
    }
  }

  [SUBSCRIBE_SELF("changeBackgroundImage")](key, value) {
    this.$commands.executeCommand(
      "setAttribute",
      "change background image",
      this.$context.selection.packByValue({
        [key]: value,
      })
    );
  }
}
