import {
  LOAD,
  CLICK,
  DEBOUNCE,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  IF,
  createComponent,
} from "sapa";

import "./PatternProperty.scss";

import { iconUse } from "elf/editor/icon/icon";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class PatternProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("pattern.property.title");
  }

  getClassName() {
    return "el--pattern-property";
  }

  getTitleClassName() {
    return "pattern";
  }

  getBody() {
    return `<div class='pattern-property' ref='$body'></div>`;
  }

  getTools() {
    return /*html*/ `
      <div ref='$tools' class='add-tools'>
        <button type="button" data-pattern='check' data-tooltip="Check">${iconUse(
          "pattern_check"
        )}</button>
        <button type="button" data-pattern='grid' data-tooltip="Grid">${iconUse(
          "pattern_grid"
        )}</button>
        <button type="button" data-pattern='dot' data-tooltip="Dot">${iconUse(
          "pattern_dot"
        )}</button>
        <button type="button" data-pattern='cross-dot' data-tooltip="Cross Dot">${iconUse(
          "pattern_cross_dot",
          "rotate(45 12 12)"
        )}</button>
        <button type="button" data-pattern='diagonal-line' data-tooltip="Diagonal Line">${iconUse(
          "texture"
        )}</button>
        <button type="button" data-pattern='vertical-line' data-tooltip="Vertical Line" data-direction="bottom right">${iconUse(
          "pattern_horizontal_line",
          "rotate(90 12 12)"
        )}</button>
        <button type="button" data-pattern='horizontal-line' data-tooltip="Horizontal Line" data-direction="bottom right">${iconUse(
          "pattern_horizontal_line"
        )}</button>
      </div>
    `;
  }

  [CLICK("$tools button")](e) {
    var patternType = e.$dt.data("pattern");

    this.children.$patternEditor.trigger("add", patternType);
  }

  [LOAD("$body")]() {
    var current = this.$context.selection.current || {};
    var value = current.pattern;

    return createComponent("PatternEditor", {
      ref: "$patternEditor",
      value,
      "hide-label": true,
      onchange: "changePatternEditor",
    });
  }

  [SUBSCRIBE_SELF("changePatternEditor")](key, pattern) {
    this.command(
      "setAttributeForMulti",
      "change pattern",
      this.$context.selection.packByValue({
        pattern,
      })
    );
  }

  get editableProperty() {
    return "pattern";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + IF("checkShow")]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSVGArea") + DEBOUNCE(1000)]() {
    this.load("$patternSelect");
  }
}
