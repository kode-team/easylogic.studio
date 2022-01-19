import { CLICK, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './PerspectiveOriginEditor.scss';

const typeList = [
  { key: "perspective-origin-x", title: "X" },
  { key: "perspective-origin-y", title: "Y" },
];

const keyList = typeList.map(it => it.key);

const origin = {
  top: '50% 0%',
  'top left': '0% 0%' ,
  'top right': '100% 0%' ,
  left: '0% 50%' ,
  center: '50% 50%',
  right: '100% 50%' ,
  bottom: '50% 100%' ,
  'bottom left': '0% 100%' ,
  'bottom right': '100% 100%'
}
export default class PerspectiveOriginEditor extends EditorElement {

  initState() {

    var arr = this.props.value.split(' ');

    var obj = {
      isAll: true,
      'perspective-origin': 0,
      'perspective-origin-x': 0,
      'perspective-origin-y': 0      
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
    return /*html*/`
      <div class='elf--perspective-origin-editor' ref='$body'>
        <div class='direction' ref='$direction'>
          <div class='pos' data-value='top'></div>
          <div class='pos' data-value='top left'></div>
          <div class='pos' data-value='top right'></div>
          <div class='pos' data-value='bottom'></div>
          <div class='pos' data-value='bottom left'></div>
          <div class='pos' data-value='bottom right'></div>
          <div class='pos' data-value='left'></div>
          <div class='pos' data-value='right'></div>
          <div class='pos' data-value='center'></div>
        </div>
        <div ref='$body'></div>
      </div>
    `
  }


  [CLICK('$direction .pos')] (e) {
    var direct = e.$dt.attr('data-value');
    
    this.state.isAll = false; 
    var [x, y] = origin[direct].split(' ')
    this.state['perspective-origin-x'] = Length.parse(x);
    this.state['perspective-origin-y'] = Length.parse(y);
    this.refresh();
    this.modifyPerspectiveOrigin();
  }  

  [SUBSCRIBE_SELF('changePerspectiveOrigin')] (key, value) {

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

    return /*html*/`
      <div class="property-item perspective-origin-item">
        <div class="radius-selector" data-selected-value="${selectedValue}" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="radius-value">
          <object refClass="RangeEditor"  ref='$all' key='perspective-origin' value="${perspectiveOrigin}" onchange='changePerspectiveOrigin' />
        </div>
      </div>
      <div
        class="property-item full perspective-origin-item"
        ref="$partitialSetting"
        style="display: none;"
      >
        <div class="radius-setting-box" ref="$radiusSettingBox">
          ${typeList.map(it => {

            var label = this.$i18n(it.title)

            return /*html*/`
              <div>
                  <object refClass="RangeEditor"  ref='$${it.key}' label='${label}' key='${it.key}' value="${this.state[it.key]}" onchange='changePerspectiveOrigin' />
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
      value = `${this.state['perspective-origin']}`
    } else {
      value = `${this.state['perspective-origin-x']} ${this.state['perspective-origin-y']}`
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

    this.setPerspectiveOrigin();
  }


}