import BaseProperty from "./BaseProperty";
import { CLICK, INPUT, CHANGE } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import icon from "../../../icon/icon";

const typeList = [
  { key: "topLeft", title: "Top Left" },
  { key: "topRight", title: "Top Right" },
  { key: "bottomLeft", title: "Bottom Left" },
  { key: "bottomRight", title: "Bottom Right" }
];

const keyList = typeList.map(it => it.key);

export default class BorderRadiusProperty extends BaseProperty {
  getTitle() {
    return "Radius";
  }

  isFirstShow () {
    return false
  }

  getBody() {
    return html`
      <div class="property-item border-radius-item">
        <div class="radius-selector" data-selected-value="all" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="radius-value">
          <input type="range" min="0" max="100" ref="$range" value="0" />
          <input type="number" min="0" max="100" ref="$number" value="0" />
          <select ref="$unit">
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="em">em</option>
          </select>
        </div>
      </div>
      <div
        class="property-item border-radius-item"
        ref="$partitialSetting"
        style="display: none;"
      >
        <label></label>
        <div class="radius-setting-box" ref="$radiusSettingBox">
          ${typeList.map(it => {
            return `
              <div>
                <label class='${it.key}'></label>
                <input type="number" ref="$${
                  it.key
                }Radius" min="0" value="0" data-key="${it.key}" /> 
                <select ref="$${it.key}Unit" data-key="${it.key}">
                  <option value='px'>px</option>
                  <option value='%'>%</option>
                  <option value='em'>em</option>
                </select>
              </div>  
            `;
          })}
        </div>
      </div>
    `;
  }

  [INPUT("$range")](e) {
    var value = this.getRef("$range").value;
    this.getRef("$number").val(value);

    keyList.forEach(type => {
      this.getRef("$", type, "Radius").val(value);
    });

    this.setBorderRadius();
  }

  [INPUT("$number")](e) {
    var value = this.getRef("$number").value;
    this.getRef("$range").val(value);

    keyList.forEach(type => {
      this.getRef("$", type, "Radius").val(value);
    });
    this.setBorderRadius();
  }

  [CHANGE("$unit")](e) {
    var unit = this.getRef("$unit").value;
    keyList.forEach(type => {
      this.getRef("$", type, "Unit").val(unit);
    });
    this.setBorderRadius();
  }

  [INPUT("$radiusSettingBox input")](e) {
    this.setBorderRadius();
  }

  [CHANGE("$radiusSettingBox select")](e) {
    this.setBorderRadius();
  }

  setBorderRadius() {
    var current = editor.selection.current;
    if (!current) return;

    var type = this.refs.$selector.attr("data-selected-value");

    if (type === "all") {
      current.setBorderRadius(type, {
        all: new Length(this.getRef("$range").value, this.getRef("$unit").value)
      });
    } else {
      var obj = {};
      keyList.forEach(type => {
        obj[type] = new Length(
          this.getRef("$", type, "Radius").value,
          this.getRef("$", type, "Unit").value
        );
      });
      current.setBorderRadius(type, obj);
    }

    this.emit("refreshCanvas");
  }

  [CLICK("$selector button")](e) {
    var type = e.$delegateTarget.attr("data-value");
    this.refs.$selector.attr("data-selected-value", type);

    if (type === "all") {
      this.refs.$partitialSetting.hide();
    } else {
      this.refs.$partitialSetting.show("grid");
    }

    this.setBorderRadius();
  }
}
