import PathParser from "../../parse/PathParser";
import { SVGItem } from "./SVGItem";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { hasSVGProperty, hasCSSProperty } from "../../util/Resource";
import { Length } from "../../unit/Length";

export class SVGTextPathItem extends SVGItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-textpath',
      name: "New TextPath",   
      d: '',
      // segments: [],
      totalLength: 0,
      fill: 'rgba(0, 0, 0, 1)',
      text: 'Insert a text', 
      textLength: Length.em(0),
      lengthAdjust: 'spacingAndGlyphs',
      startOffset: Length.em(0),
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }
 

  updatePathItem (obj) {
    this.json.d = obj.d; 
    this.json.totalLength = obj.totalLength;
    this.json.path = new PathParser(obj.d);

    if(obj.segments) {
      this.json.path.resetSegment(obj.segments);
    }
  }
  
  setCache () {
    this.rect = this.clone();
    this.cachePath = this.json.path.clone()
  }

  recover () {
    var sx = this.json.width.value / this.rect.width.value 
    var sy = this.json.height.value / this.rect.height.value 

    this.scale(sx, sy);
  }

  scale (sx, sy) {
    this.json.d = this.cachePath.clone().scaleTo(sx, sy)
    this.json.path.reset(this.json.d)
  }

  convert(json) {
    json = super.convert(json);
    if (json.d)  {
      json.path = new PathParser(json.d);
    }

    json.textLength = Length.parse(json.textLength);
    json.startOffset = Length.parse(json.startOffset);

    return json;
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      totalLength: json.totalLength,
      d: json.d,
      text: json.text, 
      textLength: `${json.textLength}`,
      lengthAdjust: json.lengthAdjust,
      startOffset: `${json.startOffset}`
      // segments: clone(this.json.segments)
    }
  }

  getDefaultTitle() {
    return "TextPath";
  }

  toAnimationKeyframes (properties) {

    var svgProperties = properties.filter(it => hasSVGProperty(it.property));
    var cssProperties = properties.filter(it => hasCSSProperty(it.property));

    return [
      { selector: `[data-id="${this.json.id}"]`, properties: cssProperties  },
      { selector: `[data-id="${this.json.id}"] textPath`, properties: svgProperties }
    ] 
  }  


  updateFunction (currentElement, isChangeFragment = true) {

    var $path = currentElement.$('path');
    $path.attr('d', this.json.d);

    if (isChangeFragment) {
      var $textPath = currentElement.$('textPath'); 
      $textPath.text(this.json.text)
      $textPath.setAttr({
        filter: this.toFilterValue,
        fill: this.toFillValue,
        stroke: this.toStrokeValue,
        textLength: this.json.textLength,
        lengthAdjust: this.json.lengthAdjust,
        startOffset: this.json.startOffset
      })
  
      var $defs = currentElement.$('defs');
      $defs.html(this.toDefInnerString)  


    }

    this.json.totalLength = $path.el.getTotalLength()
  }    

  get toDefInnerString () {
    return /*html*/`
        ${this.toPathSVG}
        ${this.toFillSVG}
        ${this.toStrokeSVG}
    `
  }

  get toPathId () {
    return this.json.id + 'path'
  }

  get toPathSVG () {
    return /*html*/`
    <path ${OBJECT_TO_PROPERTY({
      'class': 'svg-path-item',
      id: this.toPathId,
      d: this.json.d,
      fill: 'none'
    })} />
    `
  }

  get html () {
    var {id, textLength, lengthAdjust, startOffset} = this.json; 

    return /*html*/`
  <svg class='element-item textpath' data-id="${id}" >
    ${this.toDefString}
      <text ${OBJECT_TO_PROPERTY({
        'class': 'svg-textpath-item',
      })} >
        <textPath ${OBJECT_TO_PROPERTY({
          'xlink:href' :`#${this.toPathId}`,
          textLength,
          lengthAdjust,
          startOffset
        })} >${this.json.text}</textPath>
    </text>
  </svg>`
  }
}
