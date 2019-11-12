import BaseProperty from "./BaseProperty";
import icon from "../icon/icon";
import {
  LOAD,
  CLICK,
  PREVENT,
  DEBOUNCE
} from "../../../util/Event";

import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { Shape } from "../../../editor/css-property/Shape";


var shapeInsideList = [
  'circle',
  'ellipse',
  'inset',
  'polygon',
  'path',
  'svg'
];


export default class ShapeInsideProperty extends BaseProperty {
  getTitle() {
    return "Shape Inside";
  }

  hasKeyframe () {
    return true; 
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['svg-text'])
  }  

  getKeyframeProperty () {
    return 'shape-inside';
  }


  getClassName() {
    return 'shape-inside-property'
  }

  getBody() {
    return /*html*/`<div class='shape-inside-list' ref='$shapeinsideList'></div>`;
  }

  getTools() {
    return /*html*/`
      <select ref="$shapeInsideSelect">      
        ${shapeInsideList.map(it => {
          return `<option value='${it}'>${it}</option>`
        }).join('')}
      </select>
      <button type="button" ref="$add" title="add Shape Inside">${icon.add}</button>
    `;
  }

  makeShapeInsideTemplate (shapeinside) {
    return /*html*/`
      <div class='shapeinside-item'>
        <div class='title'>
          <div class='name'>${shapeinside}</div>
          <div class='tools'>
              <button type="button" class="del">
                ${icon.remove2}
              </button>
          </div>
        </div>
      </div>
    `
  }

  [CLICK('$shapeinsideList .shapeinside-item')] (e) {
    var current = editor.selection.current;
    if (!current) return;


    this.viewShapeInsidePicker();

  }

  [CLICK('$shapeinsideList .del') + PREVENT] (e) {
    var current = editor.selection.current;
    if (!current) return;

    current['shape-inside'] = '';

    this.refresh();
    
    this.emit("refreshElement", current);
    this.emit('hideShapeInsidePopup');    
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot(['project', 'artboard']);
  }


  [LOAD("$shapeinsideList")]() {
    var current = editor.selection.current;
    if (!current) return '';
    if (!current['shape-inside']) return ''

    return this.makeShapeInsideTemplate(current['shape-inside']);
  }

  [CLICK("$add")]() {

    var current = editor.selection.current;

    if (!current) return ;
    if (current['shape-inside']) {
      alert('shape-inside is already exists.');
      return; 
    }

    if (current) {
      current['shape-inside'] = this.refs.$shapeInsideSelect.value;

      this.emit("refreshElement", current);
    }

    this.refresh();
  }

  viewShapeInsidePicker() {
    var current = editor.selection.current;
    if (!current) return;

    var obj = Shape.parseStyle(current['shape-inside'])

    switch(obj.type) {
    case 'path':
      var d = obj.value.trim()
      var mode = d ? 'modify' : 'draw'

      this.emit('showPathEditor', mode, {
        changeEvent: 'updateShapeInsideString',
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
      this.emit("showShapeInsidePopup", {
        'shape-inside': current['shape-inside']
      });      
      break; 
    }


  }

  [EVENT('updateShapeInsideString')] (data) {
    var current = editor.selection.current;

    if (!current) return;

    current.reset({
      'shape-inside': `path(${data.d})`
    }); 

    this.refresh();
    this.emit("refreshElement", current);
  }

  [EVENT('changeShapeInsidePopup')] (data) {
    var current = editor.selection.current;

    if (!current) return;

    current.reset(data); 

    this.refresh();
    this.emit("refreshElement", current);
  }

}
