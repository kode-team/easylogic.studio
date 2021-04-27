import { CLICK, LOAD, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import UIElement, { EVENT } from "el/base/UIElement";
import "./RangeEditor";
import { DirectionLength } from "el/editor/unit/DirectionLength";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

const typeList = [
  { key: "top", title: "Top" },
  { key: "right", title: "Right" },
  { key: "bottom", title: "Bottom" },
  { key: "left", title: "Left" }
];

export default class DirectionEditor extends EditorElement {

  initState() {

    var [count, top, right, bottom, left] = DirectionLength.parse(this.props.value)

    return {
      isAll: count === 1,
      all: top.clone(),
      top: top.clone(),
      right: right.clone(),
      bottom: bottom.clone(),
      left: left.clone()
    }
  }

  template() {
    return `<div class='direction-editor' ref='$body'></div>`
  }

  [SUBSCRIBE('changeBorderRadius')] (key, value) {

    if (key === 'all') {
      typeList.forEach(it => {
        this.state[it.key] = value.clone();
        this.children[`$${it.key}`].setValue(value.clone())
      })
    }

    this.updateData({
      [key]: value
    })
  }

  [LOAD('$body')] () {

    var selectedValue = this.state.isAll ? 'all' : 'partitial'
    var direction = this.state.all;
    var display = selectedValue === 'all' ? 'display:none' : 'display:block';

    return /*html*/`
      <div class="property-item direction-item">
        <div class="radius-selector" data-selected-value="${selectedValue}" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="radius-value">
          <object refClass="RangeEditor"  ref='$all' key='all' value="${direction}" onchange='changeBorderRadius' />
        </div>
      </div>
      <div
        class="property-item full direction-item"
        ref="$partitialSetting"
        style="${display}"
      >
        <div class="radius-setting-box">
          ${typeList.map(it => {
            var value = this.state[it.key]
            return /*html*/`
              <div>
                  <object refClass="RangeEditor"  ref='$${it.key}' label='${it.title}' key='${it.key}' value="${value}" onchange='changeBorderRadius' />
              </div>  
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  updateData (opt = {}) {
    this.setState(opt, false);

    var value = [];

    if (this.state.isAll) {
      value = [1, this.state.all,this.state.all,this.state.all,this.state.all]
    } else {
      value = [4, this.state.top,this.state.right,this.state.bottom,this.state.left]
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

    this.updateData({
      isAll: type === 'all'
    });
  }


}


registElement({ DirectionEditor })