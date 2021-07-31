import { CLICK, LOAD, PREVENT, SUBSCRIBE, IF } from "el/sapa/Event";
import icon from "el/editor/icon/icon";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './ClipPathProperty.scss';

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

  hasKeyframe() {
    return true;
  }

  getKeyframeProperty() {
    return 'clip-path';
  }


  getClassName() {
    return 'clip-path-property'
  }

  getBody() {
    return /*html*/`<div class='elf--clip-path-list' ref='$clippathList'></div>`;
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

  makeClipPathTemplate(clippath) {
    return /*html*/`
      <div class='clippath-item'>
        <div class='title'>
          <div class='name'>${clippath}</div>
        </div>
        <div class='tools'>
          <button type="button" class="del">${icon.remove2}</button>
        </div>        
      </div>
    `
  }

  [CLICK('$clippathList .clippath-item .title')](e) {
    var current = this.$selection.current;
    if (!current) return;


    this.viewClipPathPicker();

  }

  [CLICK('$clippathList .del') + PREVENT](e) {
    var current = this.$selection.current;
    if (!current) return;

    this.command('setAttributeForMulti', 'delete clip-path', this.$selection.packByValue({
      'clip-path': ''
    }));
    this.emit('hideClipPathPopup');

    setTimeout(() => {
      this.refresh();
    }, 100)
  }

  get editableProperty() {
    return "clip-path";
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
    this.refresh();
  }


  [LOAD("$clippathList")]() {
    var current = this.$selection.current;
    if (!current) return '';
    if (!current['clip-path']) return ''

    return this.makeClipPathTemplate(current['clip-path'].split('(')[0]);
  }

  [CLICK("$add")]() {

    var current = this.$selection.current;

    if (!current) return;
    if (current['clip-path']) {
      alert('clip-path is already exists.');
      return;
    }

    if (current) {
      current['clip-path'] = this.refs.$clipPathSelect.value;


      this.command("setAttributeForMulti", 'change clip-path', this.$selection.packByValue({
        'clip-path': this.refs.$clipPathSelect.value
      }));
    }

    this.refresh();
  }

  viewClipPathPicker() {
    var current = this.$selection.current;
    if (!current) return;

    var obj = ClipPath.parseStyle(current['clip-path'])

    switch (obj.type) {
      case 'path':
        var d = current.accumulatedPath(current.clipPathString).d
        var mode = d ? 'modify' : 'path'

        this.emit('showPathEditor', mode, {
          changeEvent: (data) => {
            data.d = current.invertPath(data.d).scale(1 / current.width.value, 1 / current.height.value).d;

            this.updatePathInfo({
              'clip-path': `path(${data.d})`
            });
          },
          current,
          d,
        })
        break;
      case 'svg':
        // TODO: clip art 선택하기 
        break;
      default:
        this.emit("showClipPathPopup", {
          'clip-path': current['clip-path'],
          changeEvent: (data) => {
            this.updatePathInfo(data);
          }
        });
        break;
    }
  }


  updatePathInfo(data) {
    if (!data) return;
    var current = this.$selection.current;
    if (!current) return;

    current.reset(data);

    this.refresh();
    this.command('setAttributeForMulti', 'change clip-path', this.$selection.packByValue(data));
  }

}