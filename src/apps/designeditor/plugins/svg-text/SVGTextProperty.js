import { SUBSCRIBE, SUBSCRIBE_SELF, createComponent } from "sapa";

import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class SVGTextProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("svg.text.property.title");
  }

  [SUBSCRIBE(REFRESH_SELECTION)]() {
    this.refreshShow(["svg-textpath", "svg-text", "svg-tspan"]);
  }

  refresh() {
    var current = this.$context.selection.current;
    if (current) {
      this.setAllValue([
        "lengthAdjust",
        "textLength",
        "startOffset",
        "text-anchor",
        "text",
      ]);
    }
  }

  setAllValue(list = []) {
    var current = this.$context.selection.current;
    if (!current) return;

    list.forEach((key) => {
      this.children[`$${key}`].setValue(current[key]);
    });
  }

  getBody() {
    return /*html*/ `
      <div class='property-item '>
        ${createComponent("TextAreaEditor", {
          ref: "$text",
          label: this.$i18n("svg.text.property.textarea"),
          key: "text",
          onchange: "changeTextValue",
        })}
      </div>        
      <div class='property-item'>
        ${createComponent("SelectIconEditor", {
          ref: "$text-anchor",
          label: this.$i18n("svg.text.property.anchor"),
          key: "text-anchor",
          options: ["start", "middle", "end"],
          onchange: "changeTextValue",
        })}
          
      </div>            
      <div class='property-item '>
        ${createComponent("SelectEditor", {
          ref: "$lengthAdjust",
          label: this.$i18n("svg.text.property.length.adjust"),
          key: "lengthAdjust",
          value: "spacing",
          options: ["spacing", "spacingAndGlyphs"],
          onchange: "changeTextValue",
        })}
          
      </div>        
      <div class='property-item '>
        ${createComponent("RangeEditor", {
          ref: "$textLength",
          label: this.$i18n("svg.text.property.text.length"),
          key: "textLength",
          min: 0,
          max: 1000,
          step: 0.1,
          onchange: "changeTextValue",
        })}
          
      </div>        
      <div class='property-item '>
        ${createComponent("RangeEditor", {
          ref: "$startOffset",
          label: this.$i18n("svg.text.property.start.offset"),
          key: "startOffset",
          min: 0,
          max: 1000,
          step: 0.1,
          onchange: "changeTextValue",
        })}
          
      </div>                    
    `;
  }

  [SUBSCRIBE_SELF("changeTextValue")](key, value) {
    this.$commands.executeCommand(
      "setAttribute",
      `change svg text property: ${key}`,
      this.$context.selection.packByValue({
        [key]: value,
      })
    );
  }
}
