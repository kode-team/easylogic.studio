import PathParser from "@parser/PathParser";
import { SVGItem } from "./SVGItem";
import { OBJECT_TO_PROPERTY, CSS_TO_STRING } from "@core/functions/func";
import { hasSVGProperty, hasCSSProperty} from "@util/Resource";
import { Length } from "@unit/Length";
import icon from "@icon/icon";
import { ComponentManager } from "@manager/ComponentManager";
import Dom from "@core/Dom";

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

  setCache () {
    this.rect = this.clone(false);
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
        style: CSS_TO_STRING(this.toSVGCSS())
      })} >${this.json.text}</text>
    </g>`
  }
}

ComponentManager.registerComponent('svgtext', SVGTextItem);
 