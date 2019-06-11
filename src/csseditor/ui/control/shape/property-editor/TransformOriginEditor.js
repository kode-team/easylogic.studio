import { CLICK, INPUT, CHANGE, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { Length } from "../../../../../editor/unit/Length";
import icon from "../../../icon/icon";
import UIElement, { EVENT } from "../../../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import { WHITE_STRING } from "../../../../../util/css/types";

const typeList = [
  { key: "transform-origin-x", title: "Origin X" },
  { key: "transform-origin-y", title: "Origin Y" },
];

const keyList = typeList.map(it => it.key);

export default class TransformOriginEditor extends UIElement {
  components() {
    return { 
      RangeEditor
    }
  }
  initState() {

    var arr = this.props.value.split(WHITE_STRING);

    var obj = {
      isAll: false,
      'transform-origin': Length.px(0),
      'transform-origin-x': Length.px(0),
      'transform-origin-y': Length.px(0) 
    }

    if (this.props.value) {

      if (arr.length === 1) {
        obj['isAll'] = true; 
        obj['transform-origin'] = Length.parse(arr[0]);
        obj['transform-origin-x'] = Length.parse(arr[0]);
        obj['transform-origin-y'] = Length.parse(arr[0]);
      } else if (arr.length == 2) {
        obj['isAll'] = false;       
        obj['transform-origin-x'] = Length.parse(arr[0]);
        obj['transform-origin-y'] = Length.parse(arr[1]);
      }
    }


    return obj
  }

  template() {
    return `<div class='transform-origin-editor' ref='$body'></div>`
  }

  [EVENT('changeTransformOrigin')] (key, value) {

    if (key === 'transform-origin') {
      keyList.forEach(type => {
        this.children[`$${type}`].setValue(value.toString())
      });
    } 

    if (key === 'transform-origin-z') {
      this.state[key] = value; 
    }

    this.setTransformOrigin()
  }

  [LOAD('$body')] () {

    var selectedValue = this.state.isAll ? 'all' : 'partitial'
    var transformOrigin = this.state['transform-origin'];

    return html`
      <div class="property-item transform-origin-item">
        <div class="radius-selector" data-selected-value="${selectedValue}" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="radius-value">
          <RangeEditor ref='$all' key='transform-origin' value="${transformOrigin.toString()}" onchange='changeTransformOrigin' />
        </div>
      </div>
      <div
        class="property-item full transform-origin-item"
        ref="$partitialSetting"
      >
        <div class="radius-setting-box" ref="$radiusSettingBox">
          ${typeList.map(it => {
            return `
              <div>
                  <RangeEditor ref='$${it.key}' label='${it.title}' key='${it.key}' value="${this.state[it.key].toString()}" onchange='changeTransformOrigin' />
              </div>  
            `;
          })}

          <div>
            <RangeEditor ref='$transform-origin-z' label='Offset Z' key='transform-origin-z' value="${(this.state['transform-origin-z'] || "").toString()}" onchange='changeTransformOrigin' />
          </div>  
        </div>
      </div>
    `;
  }

  setTransformOrigin() {
    var type = this.refs.$selector.attr("data-selected-value");

    if (type === "all") {
      this.state.isAll = true; 
      this.state['transform-origin'] = this.children[`$all`].getValue();
    } else {
      this.state.isAll = false; 
      keyList.forEach(key => {
        this.state[key] = this.children[`$${key}`].getValue();
      });
    }

    this.modifyTransformOrigin();
  }

  modifyTransformOrigin () {
    var value = '';

    if (this.state.isAll) {
      value = this.state['transform-origin']
    } else {
      value = `${this.state['transform-origin-x']} ${this.state['transform-origin-y']}`

      if (this.state['transform-origin-z']) {
        value = `${value} ${this.state['transform-origin-z']}`
      }
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

    this.setTransformOrigin();
  }


}
