
import icon from "el/editor/icon/icon";
import {
  LOAD,
  CLICK,
  PREVENT,
  DEBOUNCE,
  SUBSCRIBE
} from "el/sapa/Event";



import { Keyframe } from "el/editor/property-parser/Keyframe";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './KeyframeProperty.scss';

export default class KeyframeProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('keyframe.property.title');
  }
  getBody() {
    return `<div class='elf--keyframe-list' ref='$keyframeList'></div>`;
  }

  getTools() {
    return `
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `;
  }

  makeProperty (property) {
    var key = property.key
    if (key === 'x') key = 'left';
    else if (key === 'y') key = 'top';

    return /*html*/`
      <div class='offset-property-item'>
        <label>${key}:</label>
        <div class='value'>${property.value}</div>
      </div>
    `
  }

  makeOffset (offset) {
    return /*html*/`
      <div class='offset'>
        <label>${offset.offset}</label>
        <div class='properties'>
          ${offset.properties.map(p => {
            return this.makeProperty (p);
          }).join('')}
        </div>        
      </div>
    `    
  }

  makeKeyframeTemplate (keyframe, index) {
    index = index.toString()
    return /*html*/`
      <div class='keyframe-item' data-selected-value='${keyframe.selectedType}' ref='$keyframeIndex${index}' data-index='${index}'>
        <div class='title'>
          <div class='name'>${keyframe.name}</div>
          <div class='tools'>
            <div class='group'>
              <button type="button" data-type='list'>${icon.list}</button>
              <button type="button" data-type='code'>${icon.code}</button>
            </div>
            <button type="button" class="del" data-index="${index}">${icon.remove2}</button>
          </div>
        </div>
        <div class='offset-list'>
          <div class='container'>
            ${keyframe.offsets.map(o => {
              return /*html*/`
              <div class='offset' style='left: ${o.offset}; background-color: ${o.color}'></div>
              `
            }).join('')}
          </div>
        </div>
        <div class='keyframe-code' data-type='list'>
          ${keyframe.offsets.map(offset => {
            return this.makeOffset(offset);
          }).join('')}
        </div>
        <div class='keyframe-code' data-type='code'>
          <pre>${keyframe.toString().trim()}</pre>
        </div>        
      </div>
    `
  }

  [CLICK('$keyframeList .keyframe-item .title .group button[data-type]')] (e) {
    var $keyframeItem = e.$dt.closest('keyframe-item');
    var index  = +$keyframeItem.attr('data-index');
    var type = e.$dt.attr('data-type');

    var current = this.$selection.currentProject;
    if (!current) return;

    var currentKeyframe = current.keyframes[index];

    if (currentKeyframe) {
      currentKeyframe.reset({
        selectedType: type
      });
    }

    $keyframeItem.attr('data-selected-value', type)

  }

  [CLICK('$keyframeList .keyframe-item .offset-list')] (e) {
    var index  = +e.$dt.closest('keyframe-item').attr('data-index');

    var current = this.$selection.currentProject;
    if (!current) return;


    this.viewKeyframePicker(index);

  }

  [CLICK('$keyframeList .del') + PREVENT] (e) {
    var removeIndex = e.$dt.attr("data-index");
    var current = this.$selection.currentProject;
    if (!current) return;

    current.removeKeyframe(removeIndex);

    // project 는 항상 최상위이기 때문에  true 옵션을 줘서 혼자서 갱신 해야함 
    this.emit('refreshProject', current)

    this.refresh();
  }


  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    const current = this.$selection.current;
    if (current && current.hasChangedField('keyframes')) {
      this.refresh();
    }
  }


  [LOAD("$keyframeList")]() {
    var current = this.$selection.currentProject;

    if (!current) return '';

    var keyframes = current.keyframe ? Keyframe.parseStyle(current) : current.keyframes;

    current.keyframe = ''
    current.keyframes = keyframes;

    return keyframes.map((keyframe, index) => {
      return this.makeKeyframeTemplate(keyframe, index);
    });
  }

  [CLICK("$add")]() {

    var current = this.$selection.currentProject;
    if (current) {
      current.createKeyframe();
      this.refresh();
      this.emit('refreshProject', current)
    } else {
      alert('Please select a project.')
    }

  }

  viewKeyframePicker(index) {
    if (typeof this.selectedIndex === "number") {
      this.selectItem(this.selectedIndex, false);
    }

    this.selectedIndex = +index;
    this.selectItem(this.selectedIndex, true);
    this.current = this.$selection.currentProject;

    if (!this.current) return;
    this.currentKeyframe = this.current.keyframes[
      this.selectedIndex
    ];

    this.viewKeyframePropertyPopup();
  }


  
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
    this.current = this.$selection.currentProject;

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

  [SUBSCRIBE('changeKeyframePopup')] (data) {
    var project = this.$selection.currentProject;

    if (!project) return;
    this.currentKeyframe = project.keyframes[
      this.selectedIndex
    ];

    if (this.currentKeyframe) {
      this.currentKeyframe.reset(data);
    }

    this.refresh();

    // todo: add history 
    this.emit('refreshProject', project)
  }

}