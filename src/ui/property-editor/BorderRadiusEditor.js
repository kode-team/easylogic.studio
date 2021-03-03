import { CLICK, INPUT, CHANGE, LOAD } from "@core/Event";
import icon from "@icon/icon";
import UIElement, { EVENT } from "@core/UIElement";
import RangeEditor from "./RangeEditor";
import BorderRadius from "@property-parser/BorderRadius";

const typeList = [
  { key: "border-top-left-radius", title: "topLeft" },
  { key: "border-top-right-radius", title: "topRight" },
  { key: "border-bottom-right-radius", title: "bottomRight" },
  { key: "border-bottom-left-radius", title: "bottomLeft" }  
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
        this.children[`$${type}`].setValue(value.clone())
      });
    }

    this.setBorderRadius()
  }

  [LOAD('$body')] () {

    var selectedValue = this.state.isAll ? 'all' : 'partitial'
    var borderRadius = this.state['border-radius'];

    return /*html*/`
      <div class="property-item border-radius-item">
        <div class="radius-selector" data-selected-value="${selectedValue}" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="radius-value">
          <span refClass="RangeEditor"  ref='$all' key='border-radius' value="${borderRadius}" onchange='changeBorderRadius' />
        </div>
      </div>
      <div
        class="property-item full border-radius-item"
        ref="$partitialSetting"
        style="display: none;"
      >
        <div class="radius-setting-box" ref="$radiusSettingBox">
          ${typeList.map(it => {
            var value = this.state[it.key]
            var label = this.$i18n('border.radius.editor.' + it.title);
            return /*html*/`
              <div>
                  <span refClass="RangeEditor"  ref='$${it.key}' label='${label}' key='${it.key}' value='${value}' onchange='changeBorderRadius' />
              </div>  
            `;
          }).join('')}
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
      value = this.state['border-radius'] + ''
    } else {
      value = keyList.map(key => `${this.state[key]}`).join(' ')
    }

    this.parent.trigger(this.props.onchange, value);
  }

  [CLICK("$selector button")](e) {
    var type = e.$dt.attr("data-value");
    this.refs.$selector.attr("data-selected-value", type);

    if (type === "all") {
      this.refs.$partitialSetting.hide();
    } else {
      this.refs.$partitialSetting.show("grid");
    }

    this.setBorderRadius();
  }


}
