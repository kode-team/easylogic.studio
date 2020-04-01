import BaseProperty from "./BaseProperty";
import icon from "../icon/icon";
import {
  LOAD,
  CLICK,
  PREVENT,
  DEBOUNCE
} from "../../../util/Event";

import { EVENT } from "../../../util/UIElement";
import { ClipPath } from "../../../editor/css-property/ClipPath";


var clipPathList = [
  'circle',
  'ellipse',
  'inset',
  'polygon',
  'path',
  'svg'
];


export default class ClipPathProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('clippath.property.title');
  }

  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'clip-path';
  }


  getClassName() {
    return 'clip-path-property'
  }

  getBody() {
    return /*html*/`<div class='clip-path-list' ref='$clippathList'></div>`;
  }

  getTools() {
    return /*html*/`
      <select ref="$clipPathSelect">      
        ${clipPathList.map(it => {
          return `<option value='${it}'>${it}</option>`
        }).join('')}
      </select>
      <button type="button" ref="$add" title="add Clip Path">${icon.add}</button>
    `;
  }

  makeClipPathTemplate (clippath) {
    return /*html*/`
      <div class='clippath-item'>
        <div class='title'>
          <div class='name'>${clippath}</div>
          <div class='tools'>
              <button type="button" class="del">
                ${icon.remove2}
              </button>
          </div>
        </div>
      </div>
    `
  }

  [CLICK('$clippathList .clippath-item')] (e) {
    var current = this.$selection.current;
    if (!current) return;


    this.viewClipPathPicker();

  }

  [CLICK('$clippathList .del') + PREVENT] (e) {
    var current = this.$selection.current;
    if (!current) return;

    this.emit('setAttribute', { 'clip-path': '' }, current.id);    
    this.refresh();    
    this.emit('hideClipPathPopup');    

  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot(['project', 'artboard']);
  }


  [LOAD("$clippathList")]() {
    var current = this.$selection.current;
    if (!current) return '';
    if (!current['clip-path']) return ''

    return this.makeClipPathTemplate(current['clip-path']);
  }

  [CLICK("$add")]() {

    var current = this.$selection.current;

    if (!current) return ;
    if (current['clip-path']) {
      alert('clip-path is already exists.');
      return; 
    }

    if (current) {
      current['clip-path'] = this.refs.$clipPathSelect.value;

      
      this.emit("setAttribute", {
        'clip-path':  this.refs.$clipPathSelect.value
      }, current.id);
    }

    this.refresh();
  }

  viewClipPathPicker() {
    var current = this.$selection.current;
    if (!current) return;

    var obj = ClipPath.parseStyle(current['clip-path'])

    switch(obj.type) {
    case 'path':
      var d = obj.value.trim()
      var mode = d ? 'modify' : 'path'

      this.emit('showPathEditor', mode, {
        changeEvent: 'updateClipPathString',
        current,
        d,
        box: 'box',
        screenX: current.screenX,
        screenY: current.screenY,
        screenWidth: current.screenWidth,
        screenHeight: current.screenHeight,
      }) 
      break; 
    case 'svg':
      // TODO: clip art 선택하기 
      break; 
    default: 
      this.emit("showClipPathPopup", {
        'clip-path': current['clip-path']
      });      
      break; 
    }


  }

  [EVENT('updateClipPathString')] (data) {
    var current = this.$selection.current;

    if (!current) return;

    current.reset({
      'clip-path': `path(${data.d})`      
    })

    this.refresh();

    this.emit('setAttribute', {
      'clip-path': `path(${data.d})`
    }, null, true);
  }

  [EVENT('changeClipPathPopup')] (data) {
    var current = this.$selection.current;

    if (!current) return;

    current.reset(data); 

    this.refresh();
    this.emit('setAttribute', data, current.id);        
  }

}
