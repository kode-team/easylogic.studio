import { CLICK, INPUT, CHANGE, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { Length } from "../../../../../editor/unit/Length";
import icon from "../../../icon/icon";
import UIElement from "../../../../../util/UIElement";
import RangeEditor from "./RangeEditor";

const typeList = [
  { key: "border-top-left-radius", title: "Top Left" },
  { key: "border-top-right-radius", title: "Top Right" },
  { key: "border-bottom-left-radius", title: "Bottom Left" },
  { key: "border-bottom-right-radius", title: "Bottom Right" }
];

const keyList = typeList.map(it => it.key);



export default class BorderRadiusEditor extends UIElement {

  initState() {
    return {
      isAll: true,
      'border-radius': Length.px(0),
      'border-top-left-radius': Length.px(0),
      'border-top-right-radius': Length.px(0),
      'border-bottom-left-radius': Length.px(0),
      'border-bottom-right-radius': Length.px(0)
    }
  }

  template() {
    return `<div class='border-radius-editor' ref='$body'></div>`
  }

  [LOAD('$body')] () {

    var selectedValue = this.state.isAll ? 'all' : 'partitial'
    var borderRadius = this.state['border-radius'];

    return html`
      <div class="property-item border-radius-item">
        <div class="radius-selector" data-selected-value="${selectedValue}" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="radius-value">
          <input type="range" min="0" max="100" ref="$range" value="${borderRadius.value.toString()}" />
          <input type="number" min="0" max="100" ref="$number" value="${borderRadius.value.toString()}" />
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
    var type = this.refs.$selector.attr("data-selected-value");

    if (type === "all") {
      var value = new Length(this.getRef("$range").value, this.getRef("$unit").value)

      this.state.isAll = true; 
      this.state['border-radius'] = value; 
    } else {

      this.state.isAll = false; 
      keyList.forEach(key => {
        this.state[key] = new Length(
          this.getRef("$", key, "Radius").value,
          this.getRef("$", key, "Unit").value
        );
      });
    }

    this.modifyBorderRadius();
  }

  modifyBorderRadius () {
    var value = '';

    if (this.state.isAll) {
      value = ['border-radius'].map(key => `${key}: ${this.state[key]}`).join(';')
    } else {
      value = keyList.map(key => `${key}: ${this.state[key]}`).join(';')
    }

    this.parent.trigger(this.props.onchange, value);
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
