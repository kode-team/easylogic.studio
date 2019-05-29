import BaseProperty from "./BaseProperty";
import { html } from "../../../../../util/functions/func";
import icon from "../../../icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT
} from "../../../../../util/Event";
import { EMPTY_STRING } from "../../../../../util/css/types";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { CHANGE_ARTBOARD, CHANGE_SELECTION, CHANGE_EDITOR } from "../../../../types/event";

export default class KeyFrameProperty extends BaseProperty {
  getTitle() {
    return "Keyframes";
  }
  getBody() {
    return `<div class='property-item keyframe-list' ref='$keyframeList'>
      ${this.loadTemplate('$keyframeList')}
    </div>`;
  }

  getTools() {
    return html`
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `;
  }

  makePropertyEditor (property) {

    switch(property.key) {
      case 'left': 
      case 'width': 
      case 'margin-top': 
      case 'margin-bottom': 
      case 'margin-left': 
      case 'margin-right': 
      case 'padding-top': 
      case 'padding-bottom': 
      case 'padding-left': 
      case 'padding-right': 
      case 'border-radius': 
      case 'font-size': 
      default: 
        return `
          <div class='property-editor'>
            <input type='number' value='${property.value}' />
            <select>
              <option value='px'>px</option>
              <option value='em'>em</option>
              <option value='%'>%</option>
              <option value='deg'>deg</option>
            </select>
          </div>
        `
    }

  }

  makeKeyframeOffsetPropertyTemplate (keyframe, keyframeIndex, offset, offsetIndex, property, propertyIndex) {
    return `
      <div class='offset-property-item'  data-property-index='${propertyIndex.toString()}'>
          <div class='key'>${property.key}</div>
          <div class='value'>${property.value}</div>
          <div class='input tools'>
            <button type='button' class='open-property-editor'>${icon.setting}</button>
          </div>
      </div>
    `
  }

  makePropertySelect(keyframeIndex, offsetIndex) {
    return `
      <select class='property-select' ref='$propertySelect_${keyframeIndex.toString()}_${offsetIndex.toString()}'>
        <optgroup label='Size'>
          <option value='width'>width</option>
          <option value='height'>height</option>
        </optgroup>      
        <optgroup label='Box Model'>
          <option value='margin-left'>margin-left</option>
          <option value='margin-right'>margin-right</option>
          <option value='margin-bottom'>margin-bottom</option>
          <option value='margin-top'>margin-top</option>
          <option value='padding-left'>padding-left</option>
          <option value='padding-right'>padding-right</option>
          <option value='padding-bottom'>padding-bottom</option>
          <option value='padding-top'>padding-top</option>       
        </optgroup>
        <optgroup label='Border'>
          <option value='border'>border</option>
          <option value='border-top'>border-top</option>
          <option value='border-bottom'>border-bottom</option>
          <option value='border-left'>border-left</option>
          <option value='border-right'>border-right</option>
        </optgroup>
        <optgroup label='Border Radius'>
          <option value='border-radius'>border-radius</option>
        </optgroup>        
        <optgroup label='Style'>
          <option value='background-color'>background-color</option>
          <option value='background-image'>background-image</option>
          <option value='box-shadow'>box-shadow</option>
          <option value='text-shadow'>text-shadow</option>
          <option value='filter'>filter</option>          
        </optgroup>                
        <optgroup label='Font'>
          <option value='font-size'>font-size</option>
        </optgroup>
        <optgroup label='Animation'>
          <option value='animation-timing-function'>timing-function</option>
        </optgroup>        
      </select>
    `
  }

  makeKeyframeOffsetTemplate (keyframe, keyframeIndex, offset, offsetIndex) {
    var [keyframeIndex, offsetIndex] = [keyframeIndex, offsetIndex].map(it => it.toString(10));
    
    return html`
      <div class='keyframe-offset-item' data-offset-index='${offsetIndex}'>
        <div class='offset'>
          <label>Offset</label>
          <input type='number' min="0" max="100" step="0.01" value="${offset.offset.value}" />
          <span>%</span>
        </div>
        <div class='property-list-title'>
          <label>Properties</label>
          <div class='tools'>
            ${this.makePropertySelect(keyframeIndex, offsetIndex)}
            <button type="button" class='add-property' data-index='${keyframeIndex}' data-offset-index="${offsetIndex}">${icon.add}</button>
          </div>
        </div>
        <div class='property-list'>
          ${offset.properties.map( (property, propertyIndex) => {
            return this.makeKeyframeOffsetPropertyTemplate (keyframe, keyframeIndex, offset, offsetIndex, property, propertyIndex)
          })}
        </div>
      </div>
    `
  }

  makeKeyframeTemplate (keyframe, index) {
    index = index.toString()
    return html`
      <div class='keyframe-item' draggable='true' ref='$keyframeIndex${index}' data-index='${index}'>
        <div class='title'>
          <div class='name'>${keyframe.name}</div>
          <div class='tools'>
              <button type="button" class="del" data-index="${index}">
                ${icon.remove2}
              </button>
          </div>
        </div>
        <div class='offset-list'>
          <div class='container'>
            ${keyframe.offsets.map(o => {
              var title = `${o.offset} ${o.properties.map(p => p.key).join(',')}`
              return `<div data-title='${title}' class='offset' style='left: ${o.offset}; background-color: ${o.color}'></div>`
            })}
          </div>
        </div>
      </div>
    `
  }

  [CLICK('$keyframeList .keyframe-item')] (e) {
    var index  = +e.$delegateTarget.attr('data-index');

    var current = editor.selection.current;
    if (!current) return;


    this.viewKeyframePicker(index);

  }

  [CLICK('$keyframeList .del')] (e) {
    var removeIndex = e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    current.removeKeyframe(removeIndex);

    this.emit("refreshCanvas");

    this.refresh();
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION, CHANGE_EDITOR)] () {
    this.refresh();
  }


  [LOAD("$keyframeList")]() {
    var current = editor.selection.current;

    if (!current) return EMPTY_STRING;

    return current.keyframes.map((keyframe, index) => {
      return this.makeKeyframeTemplate(keyframe, index);
    });
  }

  // keyframe-item 을 통째로  dragstart 를 걸어버리니깐
  // 다른 ui 를 핸들링 할 수가 없어서
  // title  에만 dragstart 거는 걸로 ok ?
  [DRAGSTART("$keyframeList .keyframe-item .title")](e) {
    this.startIndex = +e.$delegateTarget.attr("data-index");
  }

  // drop 이벤트를 걸 때 dragover 가 같이 선언되어 있어야 한다.
  [DRAGOVER("$keyframeList .keyframe-item") + PREVENT](e) {}

  [DROP("$keyframeList .keyframe-item") + PREVENT](e) {
    var targetIndex = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    current.sortKeyframe(this.startIndex, targetIndex);

    this.emit("refreshCanvas");

    this.refresh();
  }

  [CLICK("$add")]() {

    var current = editor.selection.current;
    if (current) {
      current.createKeyframe();

      this.emit("refreshCanvas");
    }

    this.refresh();
  }

  refresh() {
    this.load();
  }


  viewKeyframePicker(index) {
    if (typeof this.selectedIndex === "number") {
      this.selectItem(this.selectedIndex, false);
    }

    this.selectedIndex = +index;
    this.selectItem(this.selectedIndex, true);
    this.current = editor.selection.current;

    if (!this.current) return;
    this.currentKeyframe = this.current.keyframes[
      this.selectedIndex
    ];

    this.viewKeyframePropertyPopup();
  }


  // 객체를 선택하는 괜찮은 패턴이 어딘가에 있을 텐데......
  // 언제까지 selected 를 설정해야하는가?
  selectItem(selectedIndex, isSelected = true) {
    if (isSelected) {
      this.getRef('$keyframeIndex', selectedIndex).addClass("selected");
    } else {
      this.getRef('$keyframeIndex', selectedIndex).removeClass("selected");
    }

    if (this.current) {
      this.current.keyframes.forEach((it, index) => {
        it.selected = index === selectedIndex;
      });
    }
  }  

  viewKeyframePropertyPopup(position) {
    this.current = editor.selection.current;

    if (!this.current) return;
    this.currentKeyframe = this.current.keyframes[
      this.selectedIndex
    ];

    const back = this.currentKeyframe;

    const name = back.name
    const offsets = back.offsets

    this.emit("showKeyframePopup", {
      position,
      name, 
      offsets
    });
  }

  [EVENT('changeKeyframePopup')] (data) {
    this.current = editor.selection.current;

    if (!this.current) return;
    this.currentKeyframe = this.current.keyframes[
      this.selectedIndex
    ];

    if (this.currentKeyframe) {
      this.currentKeyframe.reset(data);
    }

    this.refresh();
    this.emit('refreshCanvas');
  }

}
