import { CLICK, INPUT, CHANGE, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { Length } from "../../../../../editor/unit/Length";
import icon from "../../../icon/icon";
import UIElement, { EVENT } from "../../../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import BorderRadius from "../../../../../editor/css-property/BorderRadius";

const typeList = [
  { key: "border-top-left-radius", title: "Top Left" },
  { key: "border-top-right-radius", title: "Top Right" },
  { key: "border-bottom-left-radius", title: "Bottom Left" },
  { key: "border-bottom-right-radius", title: "Bottom Right" }
];

const keyList = typeList.map(it => it.key);

export default class BorderRadiusEditor extends UIElement {
  components() {
    return {
      RangeEditor
    }
  }
  initState() {

    return BorderRadius.parseStyle(this.props.value)
  }

  template() {
    return `<div class='border-radius-editor' ref='$body'></div>`
  }

  [EVENT('changeBorderRadius')] (key, value) {

    if (key === 'border-radius') {
      keyList.forEach(type => {
        this.children[`$${type}`].setValue(value)
      });
    }

    this.setBorderRadius()
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
          <RangeEditor ref='$all' key='border-radius' value="${borderRadius.toString()}" onchange='changeBorderRadius' />
        </div>
      </div>
      <div
        class="property-item full border-radius-item"
        ref="$partitialSetting"
        style="display: none;"
      >
        <div class="radius-setting-box" ref="$radiusSettingBox">
          ${typeList.map(it => {
            return `
              <div>
                  <RangeEditor ref='$${it.key}' label='${it.title}' key='border-${it.key}-radius' onchange='changeBorderRadius' />
              </div>  
            `;
          })}
        </div>
      </div>
    `;
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
      this.state.isAll = true; 
      this.state['border-radius'] = this.children[`$all`].getValue();
    } else {

      this.state.isAll = false; 
      keyList.forEach(key => {
        this.state[key] = this.children[`$${key}`].getValue();
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
