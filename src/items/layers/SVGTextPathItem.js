import PathParser from "@parser/PathParser";
import { SVGItem } from "./SVGItem";
import { OBJECT_TO_PROPERTY, CSS_TO_STRING } from "@core/functions/func";
import { hasSVGProperty, hasCSSProperty, hasSVGPathProperty } from "@util/Resource";
import { Length } from "@unit/Length";
import icon from "@icon/icon";
import { ComponentManager } from "@manager/ComponentManager";

export class SVGTextPathItem extends SVGItem {

  getIcon () {
    return icon.text_rotate;
  }  
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
    this.rect = this.clone(false);
    this.cachePath = this.json.path.clone()
  }

  recover () {

    if (!this.rect) this.setCache();

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
    // if (json.d)  {
      json.path = new PathParser(json.d);
    // }

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
    var svgPathProperties = properties.filter(it => hasSVGPathProperty(it.property));
    var cssProperties = properties.filter(it => hasCSSProperty(it.property));

    return [
      { selector: `[data-id="${this.json.id}"]`, properties: cssProperties  },
      { selector: `[data-id="${this.json.id}"] textPath`, properties: svgProperties },
      { selector: `[data-id="${this.json.id}"] path`, properties: svgPathProperties }
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

      this.updateDefString(currentElement)

    }

    this.json.totalLength = $path.totalLength
  }    

  get toDefInnerString () {
    return /*html*/`
        ${this.toPathSVG}
        ${this.toFillSVG}
        ${this.toStrokeSVG}
    `
  }

  get toPathId () {
    return this.getInnerId('path')
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
  <svg class='element-item textpath' data-id="${id}">
    ${this.toDefString}
      <text ${OBJECT_TO_PROPERTY({
        'class': 'svg-textpath-item'
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


  get svg () {
    var x = this.json.x.value;
    var y = this.json.y.value;
    return this.toSVG(x, y);
  }
  toSVG (x = 0, y = 0) {
    var {textLength, lengthAdjust, startOffset} = this.json; 
    return /*html*/`
    <g transform="translate(${x}, ${y})">    
      ${this.toDefString}
      <text ${OBJECT_TO_PROPERTY({
        'class': 'svg-textpath-item',
        ...this.toSVGAttribute(),        
        style: CSS_TO_STRING(this.toSVGCSS())
      })} >
        <textPath ${OBJECT_TO_PROPERTY({
          'xlink:href' :`#${this.toPathId}`,
          textLength,
          lengthAdjust,
          startOffset
        })} >${this.json.text}</textPath>
      </text>
    </g>`
  }
}

ComponentManager.registerComponent('svg-textpath', SVGTextPathItem); 