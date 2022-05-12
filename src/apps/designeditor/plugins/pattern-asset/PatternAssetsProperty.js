import {
  LOAD,
  DEBOUNCE,
  DRAGSTART,
  CLICK,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  IF,
  variable,
  createComponent,
} from "sapa";

import "./PatternAssetsProperty.scss";

import { CSS_TO_STRING } from "elf/core/func";
import patterns from "elf/editor/preset/patterns";
import { Pattern } from "elf/editor/property-parser/Pattern";
import { ViewModeType } from "elf/editor/types/editor";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class PatternAssetsProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("pattern.asset.property.title");
  }

  initState() {
    return {
      mode: "grid",
      preset: "check",
    };
  }

  getTools() {
    const options = variable(
      patterns.map((it) => {
        return { value: it.key, text: it.title };
      })
    );

    return createComponent("SelectEditor", {
      ref: "$assets",
      key: "preset",
      value: this.state.preset,
      options,
      onchange: "changePreset",
    });
  }

  [SUBSCRIBE_SELF("changePreset")](key, value) {
    this.setState({
      [key]: value,
    });
  }

  getClassName() {
    return "elf--pattern-assets-property";
  }

  get editableProperty() {
    return "pattern";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + DEBOUNCE(100) + IF("checkShow")]() {}

  getBody() {
    return /*html*/ `
      <div class='property-item pattern-assets'>
        <div class='pattern-list' ref='$patternList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [DRAGSTART("$patternList .pattern-item")](e) {
    const pattern = e.$dt.attr("data-pattern");
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/pattern", pattern);
  }

  [LOAD("$patternList")]() {
    var preset = patterns.find((it) => it.key === this.state.preset);

    if (!preset) {
      return "";
    }

    var results = preset.execute().map((item, index) => {
      const cssText = CSS_TO_STRING(Pattern.toCSS(item.pattern));

      return /*html*/ `
        <div class='pattern-item' data-index="${index}" data-pattern="${item.pattern}">
          <div class='preview' title="${item.title}" draggable="true">
            <div class='pattern-view' style='${cssText}'></div>
          </div>
        </div>
      `;
    });

    return results;
  }

  [CLICK("$patternList .pattern-item")](e) {
    const pattern = e.$dt.attr("data-pattern");

    // view 에 따라 다른 속성을 가진다.
    if (this.$modeView.isCurrentMode(ViewModeType.CanvasView)) {
      this.$commands.emit("addBackgroundImagePattern", pattern);
    } else {
      this.emit("setPatternAsset", pattern);
    }
  }
}
