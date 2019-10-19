import PathParser from "../../parse/PathParser";
import { SVGItem } from "./SVGItem";
import { OBJECT_TO_CLASS, OBJECT_TO_PROPERTY } from "../../../util/functions/func";
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
      text: 'Insert a text', 
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

    this.json.width = Length.px(obj.rect.width);
    this.json.height = Length.px(obj.rect.height);

    this.setScreenX(Length.px(obj.rect.x))
    this.setScreenY(Length.px(obj.rect.y))
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

    return json;
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      totalLength: json.totalLength,
      d: json.d,
      text: json.text, 
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
      { selector: `[data-id="${this.json.id}"] path`, properties: svgProperties }
    ] 
  }  


  updateFunction (currentElement, isChangeFragment = true) {

    var $path = currentElement.$('path');
    $path.attr('d', this.json.d);


    if (isChangeFragment) {
      var $textPath = currentElement.$('textPath'); 
      $textPath.text(this.json.text)
  
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
    var {id} = this.json; 

    return /*html*/`
  <svg class='element-item textpath' data-id="${id}" >
    ${this.toDefString}
      <text ${OBJECT_TO_PROPERTY({
        'class': 'svg-textpath-item',
      })} >
        <textPath xlink:href="#${this.toPathId}">${this.json.text}</textPath>
    </text>
  </svg>`
  }
}
