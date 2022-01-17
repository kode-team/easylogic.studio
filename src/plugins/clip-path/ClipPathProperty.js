import { CLICK, LOAD, PREVENT, SUBSCRIBE, IF } from "el/sapa/Event";
import icon, { iconUse } from "el/editor/icon/icon";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './ClipPathProperty.scss';
import PathParser from "el/editor/parser/PathParser";
import { vertiesToRectangle } from "el/utils/collision";
import { ClipPathType } from "el/editor/types/model";
import polygon from "el/editor/preset/clip-path/polygon";
import { createComponent } from "el/sapa/functions/jsx";

const ClipPathSample = {
  [ClipPathType.CIRCLE]: 'circle(50% at 50% 50%)',
  [ClipPathType.ELLIPSE]: 'ellipse(50% 50% at 50% 50%)',
  [ClipPathType.INSET]: 'inset(0% 0% 0% 0%)',
  [ClipPathType.POLYGON]: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
}



export default class ClipPathProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('clippath.property.title');
  }

  getClassName() {
    return 'clip-path-property'
  }

  getBody() {
    return /*html*/`<div class='elf--clip-path-list' ref='$clippathList'></div>`;
  }

  getTools() {
    return /*html*/`
      <div ref="$tools" class="add-tools">
        <button type="button" data-value='circle' data-tooltip="Circle">${iconUse('outline_circle')}</button>
        <button type="button" data-value='ellipse' data-tooltip="Ellipse">${iconUse('outline_circle', "scale(1 0.7) translate(0 5)")}</button>
        <button type="button" data-value='inset' data-tooltip="Inset">${iconUse('outline_rect')}</button>
        <button type="button" data-value='polygon' data-tooltip="Polygon">${iconUse('polygon')}</button>
        <button type="button" data-value='path' data-tooltip="Path">${iconUse('pentool')}</button>
        <button type="button" data-value='svg' data-tooltip="SVG">${iconUse('image')}</button>
      </div>
    `;
  }

  makeClipPathTemplate(clippath, func) {

    const isPath = clippath === 'path';
    const isPolygon = clippath = 'polygon';

    let newPathString = '';
    if (isPath) {
      const pathString = func.split('(')[1].split(')')[0];

      let pathObject = PathParser.fromSVGString(pathString);
      const bbox = pathObject.getBBox();
      const rectangle = vertiesToRectangle(bbox)

      const rate = 260 / rectangle.width;
      const hRate = 150 / rectangle.height;

      const lastRate = Math.min(rate, hRate);

      pathObject = pathObject.translate(-bbox[0][0], -bbox[0][1]).scale(lastRate, lastRate);

      const newBBox = pathObject.getBBox();
      const newRectangle = vertiesToRectangle(newBBox);

      newPathString = pathObject.translate(260 / 2 - newRectangle.width / 2, 0).d;
    }

    let polygonSelect = ''
    if (isPolygon) {
      const polygonList = polygon.execute();

      polygonSelect = createComponent('SelectEditor', {
        ref: '$polygonSelect',
        options: ['', ...polygonList.map(it => it.name)],
        onchange: (key, value) => {

          const polygon = polygonList.find(it => it.name === value)

          if (polygon) {
            this.updatePathInfo({
              'clip-path': `polygon(${polygon.polygon})`
            })
          }

        }
      })
    }

    return /*html*/`
      <div>
        <div class='clippath-item'>
          <label>${iconUse('drag_indicator')}</label>
          <div class='title'>
            <div class='name'>${clippath}</div>
            ${isPolygon ? polygonSelect : ''}
          </div>
          <div class='tools'>
            <button type="button" class="del">${icon.remove2}</button>
          </div>        
        </div>
        ${isPath ? `<svg><path d="${newPathString}" fill="transparent" stroke="currentColor" /></svg>` : ''}
      </div>

    `
  }

  // [CLICK('$clippathList .clippath-item .title .name')](e) {
  //   var current = this.$selection.current;
  //   if (!current) return;


  //   this.viewClipPathPicker();

  // }

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

    return this.makeClipPathTemplate(current['clip-path'].split('(')[0], current['clip-path']);
  }

  [CLICK("$tools [data-value]")](e) {

    var current = this.$selection.current;

    if (!current) return;
    if (current['clip-path']) {
      alert('clip-path is already exists.');
      return;
    }

    if (current) {

      current.reset({
        'clip-path': ClipPathSample[e.$dt.data('value')]
      })

      this.command("setAttributeForMulti", 'change clip-path', this.$selection.pack('clip-path'));
    }

    this.refresh();
  }

  // viewClipPathPicker() {
  //   var current = this.$selection.current;
  //   if (!current) return;

  //   var obj = ClipPath.parseStyle(current['clip-path'])

  //   switch (obj.type) {
  //     case 'path':
  //       var d = current.absolutePath(current.clipPathString).d
  //       var mode = d ? 'modify' : 'path'

  //       this.emit('showPathEditor', mode, {
  //         changeEvent: (data) => {
  //           data.d = current.invertPath(data.d).d;

  //           this.updatePathInfo({
  //             'clip-path': `path(${data.d})`
  //           });
  //         },
  //         current,
  //         d,
  //       })
  //       break;
  //     case 'svg':
  //       // TODO: clip art 선택하기 
  //       break;
  //     default:
  //       this.emit("showClipPathPopup", {
  //         'clip-path': current['clip-path'],
  //         changeEvent: (data) => {
  //           this.updatePathInfo(data);
  //         }
  //       }, this.refs.$clippathList.rect());
  //       break;
  //   }
  // }


  updatePathInfo(data) {
    if (!data) return;
    var current = this.$selection.current;
    if (!current) return;

    current.reset(data);

    this.refresh();
    this.command('setAttributeForMulti', 'change clip-path', this.$selection.packByValue(data));
  }

}