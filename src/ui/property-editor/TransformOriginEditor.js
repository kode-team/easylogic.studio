import { CLICK, LOAD } from "@core/Event";
import { Length } from "@unit/Length";
import icon from "@icon/icon";
import UIElement, { EVENT } from "@core/UIElement";
import RangeEditor from "./RangeEditor";


const typeList = [
  { key: "transform-origin-x", title: "X" },
  { key: "transform-origin-y", title: "Y" },
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

export default class TransformOriginEditor extends UIElement {
  components() {
    return { 
      RangeEditor
    }
  }
  initState() {

    var arr = this.props.value.split(' ');

    var obj = {
      isAll: false,
      'transform-origin': Length.percent(50),
      'transform-origin-x': Length.percent(50),
      'transform-origin-y': Length.percent(50)
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
    return /*html*/`
      <div class='transform-origin-editor'>
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
    this.state['transform-origin-x'] = Length.parse(x);
    this.state['transform-origin-y'] = Length.parse(y);
    this.refresh();
    this.modifyTransformOrigin();
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

    return /*html*/`
      <div class="transform-origin-item">
        <div class="radius-selector" data-selected-value="${selectedValue}" ref="$selector">
          <button type="button" data-value="all">${icon.border_all}</button>
          <button type="button" data-value="partitial">
            ${icon.border_inner}
          </button>
        </div>
        <div class="radius-value">
          <RangeEditor ref='$all' key='transform-origin' value="${transformOrigin}" onchange='changeTransformOrigin' />
        </div>
      </div>
      <div class="full transform-origin-item" ref="$partitialSetting" >
        <div class="radius-setting-box" ref="$radiusSettingBox">
          ${typeList.map(it => {
            return `
              <div>
                  <RangeEditor ref='$${it.key}' label='${it.title}' key='${it.key}' value="${this.state[it.key]}" onchange='changeTransformOrigin' />
              </div>  
            `;
          }).join('')}

          <div>
            <RangeEditor ref='$transform-origin-z' label='Z' key='transform-origin-z' value="${(this.state['transform-origin-z'] || "")}" onchange='changeTransformOrigin' />
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
      value = `${this.state['transform-origin']}`
    } else {
      value = `${this.state['transform-origin-x']} ${this.state['transform-origin-y']}`

      if (this.state['transform-origin-z']) {
        value = `${value} ${this.state['transform-origin-z']}`
      }
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

    this.setTransformOrigin();
  }


}
