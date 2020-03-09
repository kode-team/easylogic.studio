import PathParser from "../../parse/PathParser";
import { SVGItem } from "./SVGItem";
import { OBJECT_TO_PROPERTY, CSS_TO_STRING } from "../../../util/functions/func";
import { hasSVGProperty, hasCSSProperty} from "../../util/Resource";
import { Shape } from "../../css-property/Shape";
import { Length } from "../../unit/Length";
import icon from "../../../csseditor/ui/icon/icon";
import { ComponentManager } from "../../manager/ComponentManager";

export class SVGTextItem extends SVGItem {

  getIcon () {
    return icon.title;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-text',
      name: "New Text",   
      totalLength: 0,
      fill: 'rgba(0, 0, 0, 1)',
      text: 'Insert a text', 
      'font-weight': Length.number(100),
      textLength: Length.em(0),
      lengthAdjust: 'spacingAndGlyphs',      
      'shape-inside': '',
      'shape-subtract': '',
      'shape-margin': '',
      'shape-padding': '',
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }



  toShapeInsideCSS () {
    var str = this.json['shape-inside']
    var obj = Shape.parseStyle(str)

    switch (obj.type) {
    case 'path': 
    case 'svg': 
      str = `url(#${this.shapeInsideId})`
      break; 
    }

    return {
      'shape-inside': str,
      'inline-size': this.json.width
    }
  }  


  updatePathItem (obj) {

    // shape-inside 
    // shape-subtract 

    this.json.d = obj.d; 
    this.json.totalLength = obj.totalLength;
    this.json.path = new PathParser(obj.d);

    if(obj.segments) {
      this.json.path.resetSegment(obj.segments);
    }
  }
  
  setCache () {
    this.rect = this.clone();
  }


  convert(json) {
    json = super.convert(json);

    json.textLength = Length.parse(json.textLength);

    return json;
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      totalLength: json.totalLength,
      text: json.text, 
      textLength: `${json.textLength}`,
      lengthAdjust: json.lengthAdjust,      
      'shape-inside': json['shape-inside']
      // segments: clone(this.json.segments)
    }
  }

  getDefaultTitle() {
    return "Text";
  }

  toAnimationKeyframes (properties) {

    var svgProperties = properties.filter(it => hasSVGProperty(it.property));
    var cssProperties = properties.filter(it => hasCSSProperty(it.property));

    return [
      { selector: `[data-id="${this.json.id}"]`, properties: cssProperties  },
      { selector: `[data-id="${this.json.id}"] text`, properties: svgProperties }
    ] 
  }  


  updateFunction (currentElement, isChangeFragment = true) {

    if (isChangeFragment) {
      var $text = currentElement.$('text'); 
      $text.text(this.json.text)
      $text.setAttr({
        filter: this.toFilterValue,
        fill: this.toFillValue,
        stroke: this.toStrokeValue,
        y: this.json['font-size'] || '13px',        
        textLength: this.json.textLength,
        lengthAdjust: this.json.lengthAdjust
      })

      this.updateDefString(currentElement)
    }
  }    


  toNestedCSS() {
    
    return [
      { selector: '> text', css : {
          ...this.toShapeInsideCSS()
        }
      }
    ]
  }    
 
  toSVGCSS() {

    return {
      ...super.toSVGCSS(),
      ...this.toShapeInsideCSS(),
    };
  }

  get toShapeInside() {

    var obj = Shape.parseStyle(this.json['shape-inside']);
    var value = obj.value; 
    switch (obj.type) {
    case 'path':
      return /*html*/`<path d="${value}" id="${this.shapeInsideId}" />`
    }

    return ``
  }  

  get toDefInnerString () {
    return /*html*/`
        ${this.toFillSVG}
        ${this.toStrokeSVG}
        ${this.toShapeInside}
    `
  }

  get shapeInsideId () {
    return this.getInnerId('shape-inside')
  }    

  get html () {
    var {id, textLength, lengthAdjust} = this.json; 

    return /*html*/`
  <svg class='element-item textpath' data-id="${id}">
    ${this.toDefString}
      <text ${OBJECT_TO_PROPERTY({
        'class': 'svg-text-item',
        textLength,
        lengthAdjust,
        y: this.json['font-size'] || '13px',        
      })} >${this.json.text}</text>
  </svg>`
  }



  get svg () {
    var x = this.json.x.value;
    var y = this.json.y.value;
    return this.toSVG(x, y);
  }
  toSVG (x = 0, y = 0) { 
    var { textLength, lengthAdjust} = this.json; 
    return /*html*/`
    <g transform="translate(${x}, ${y})">    
      ${this.toDefString}
      <text ${OBJECT_TO_PROPERTY({
        'class': 'svg-text-item',
        ...this.toSVGAttribute(),        
        textLength,
        lengthAdjust,        
        y: this.json['font-size'] || '13px',
        style: CSS_TO_STRING(this.toSVGCSS())
      })} >${this.json.text}</text>
    </g>`
  }
}

ComponentManager.registerComponent('svgtext', SVGTextItem);
 