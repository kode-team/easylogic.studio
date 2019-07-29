import BaseProperty from "./BaseProperty";
import icon from "../../../icon/icon";
import {
  LOAD,
  CLICK,
  PREVENT,
  DEBOUNCE
} from "../../../../../util/Event";

import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";


export default class ClipPathProperty extends BaseProperty {
  getTitle() {
    return "Clip Path";
  }

  getClassName() {
    return 'clip-path-property'
  }

  getBody() {
    return `<div class='property-item clip-path-list' ref='$clippathList'></div>`;
  }

  getTools() {
    return `
      <button type="button" ref="$add" title="add Clip Path">${icon.add}</button>
    `;
  }

  makeClipPathTemplate (clippath) {
    return `
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
    var current = editor.selection.current;
    if (!current) return;


    this.viewClipPathPicker();

  }

  [CLICK('$clippathList .del') + PREVENT] (e) {
    var current = editor.selection.current;
    if (!current) return;

    current['clip-path'] = '';

    this.refresh();
    
    this.emit("refreshElement", current);
    this.emit('hideClipPathPopup');    
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot('project');
  }


  [LOAD("$clippathList")]() {
    var current = editor.selection.current;
    if (!current) return '';
    if (!current['clip-path']) return ''

    return this.makeClipPathTemplate(current['clip-path']);
  }

  [CLICK("$add")]() {

    var current = editor.selection.current;

    if (!current) return ;
    if (current['clip-path']) {
      alert('clip-path is already exists.');
      return; 
    }

    if (current) {
      current['clip-path'] = 'none';

      this.emit("refreshElement", current);
    }

    this.refresh();
  }

  viewClipPathPicker() {
    var current = editor.selection.current;
    if (!current) return;

    this.emit("showClipPathPopup", {
      'clip-path': current['clip-path']
    });
  }

  [EVENT('changeClipPathPopup')] (data) {
    var current = editor.selection.current;

    if (!current) return;

    current.reset(data); 

    this.refresh();
    this.emit("refreshElement", current);
  }

}
