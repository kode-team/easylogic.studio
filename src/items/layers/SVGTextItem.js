import { SVGItem } from "./SVGItem";
import { hasSVGProperty, hasCSSProperty} from "@util/Resource";
import { Length } from "@unit/Length";
import icon from "@icon/icon";
import { ComponentManager } from "@manager/ComponentManager";

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
      ...this.attrs(
        'totalLength',
        'text', 
        'textLength',
        'lengthAdjust',      
        'shape-inside'
      )
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
}

ComponentManager.registerComponent('svgtext', SVGTextItem);
 