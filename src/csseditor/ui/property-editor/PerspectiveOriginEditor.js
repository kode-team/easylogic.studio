import { CLICK, LOAD } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import icon from "../icon/icon";
import UIElement, { EVENT } from "../../../util/UIElement";
import RangeEditor from "./RangeEditor";


const typeList = [
  { key: "perspective-origin-x", title: "Origin X" },
  { key: "perspective-origin-y", title: "Origin Y" },
];

const keyList = typeList.map(it => it.key);

export default class PerspectiveOriginEditor extends UIElement {
  components() {
    return { 
      RangeEditor
    }
  }
  initState() {

    var arr = this.props.value.split(' ');

    var obj = {
      isAll: true,
      'perspective-origin': Length.px(0),
      'perspective-origin-x': Length.px(0),
      'perspective-origin-y': Length.px(0)      
    }

    if (this.props.value) {

      if (arr.length === 1) {
        obj['isAll'] = true; 
        obj['perspective-origin'] = Length.parse(arr[0]);
        obj['perspective-origin-x'] = Length.parse(arr[0]);
        obj['perspective-origin-y'] = Length.parse(arr[0]);
      } else if (arr.length == 2) {
        obj['isAll'] = false;       
        obj['perspective-origin-x'] = Length.parse(arr[0]);
        obj['perspective-origin-y'] = Length.parse(arr[1]);
      }
    }


    return obj
  }

  template() {
    return `<div class='perspective-origin-editor' ref='$body'></div>`
  }

  [EVENT('changePerspectiveOrigin')] (key, value) {

    if (key === 'perspective-origin') {
      keyList.forEach(type => {
        this.children[`$${type}`].setValue(value.toString())
      });
    }

    this.setPerspectiveOrigin()
  }

  [LOAD('$body')] () {

    var selectedValue = this.state.isAll ? 'all' : 'partitial'
    var perspectiveOrigin = this.state['perspective-origin'];

    return `
      <div class="property-item perspective-origin-item">
        <div class="radius-selector" data-selected-value="${selectedValue}" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="radius-value">
          <RangeEditor ref='$all' key='perspective-origin' value="${perspectiveOrigin}" onchange='changePerspectiveOrigin' />
        </div>
      </div>
      <div
        class="property-item full perspective-origin-item"
        ref="$partitialSetting"
        style="display: none;"
      >
        <div class="radius-setting-box" ref="$radiusSettingBox">
          ${typeList.map(it => {
            return `
              <div>
                  <RangeEditor ref='$${it.key}' label='${it.title}' key='${it.key}' value="${this.state[it.key]}" onchange='changePerspectiveOrigin' />
              </div>  
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  setPerspectiveOrigin() {
    var type = this.refs.$selector.attr("data-selected-value");

    if (type === "all") {
      this.state.isAll = true; 
      this.state['perspective-origin'] = this.children[`$all`].getValue();
    } else {
      this.state.isAll = false; 
      keyList.forEach(key => {
        this.state[key] = this.children[`$${key}`].getValue();
      });
    }

    this.modifyPerspectiveOrigin();
  }

  modifyPerspectiveOrigin () {
    var value = '';

    if (this.state.isAll) {
      value = this.state['perspective-origin']
    } else {
      value = `${this.state['perspective-origin-x']} ${this.state['perspective-origin-y']}`
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

    this.setPerspectiveOrigin();
  }


}
