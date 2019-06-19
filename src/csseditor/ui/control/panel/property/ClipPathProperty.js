import BaseProperty from "./BaseProperty";
import { html } from "../../../../../util/functions/func";
import icon from "../../../icon/icon";
import {
  LOAD,
  CLICK,
  PREVENT
} from "../../../../../util/Event";
import { EMPTY_STRING } from "../../../../../util/css/types";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { CHANGE_ARTBOARD, CHANGE_SELECTION } from "../../../../types/event";

export default class ClipPathProperty extends BaseProperty {
  getTitle() {
    return "Clip Path";
  }
  getBody() {
    return `<div class='property-item clip-path-list' ref='$clippathList'></div>`;
  }

  getTools() {
    return html`
      <button type="button" ref="$add" title="add Clip Path">${icon.add}</button>
    `;
  }

  makeClipPathTemplate (clippath) {
    return html`
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
    
    this.emit("refreshCanvas");
    this.emit('hideClipPathPopup');    
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)] () {
    this.refresh();
  }


  [LOAD("$clippathList")]() {
    var current = editor.selection.current;
    if (!current) return EMPTY_STRING;
    if (!current['clip-path']) return EMPTY_STRING

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

      this.emit("refreshCanvas");
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
    this.emit('refreshCanvas');
  }

}
