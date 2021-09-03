import PathParser from "el/editor/parser/PathParser";
import { SVGItem } from "./SVGItem";
import { hasSVGProperty, hasCSSProperty, hasSVGPathProperty } from "el/editor/util/Resource";
import { Length } from "el/editor/unit/Length";
import icon from "el/editor/icon/icon";

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
 
  refreshMatrixCache() {
    super.refreshMatrixCache();

    if (this.hasChangedField('d')) {
      this.cachePath = new PathParser(this.json.d);
      this.cacheWidth = this.json.width.value;
      this.cacheHeight = this.json.height.value;      
    } else if (this.hasChangedField('width', 'height')) {
      this.json.d = this.cachePath.clone().scale(this.json.width.value/this.cacheWidth, this.json.height.value/this.cacheHeight).d;
    }
  }



  get d() {

    if (!this.json.d) {
      return null;
    }
    
    if (!this.cachePath) {
      this.cachePath = new PathParser(this.json.d);
      this.cacheWidth = this.json.width.value;
      this.cacheHeight = this.json.height.value;          
    }

    return this.cachePath.clone().scale(this.json.width.value/this.cacheWidth, this.json.height.value/this.cacheHeight).d;
  }  

  convert(json) {
    json = super.convert(json);

    json.textLength = Length.parse(json.textLength);
    json.startOffset = Length.parse(json.startOffset);

    return json;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'totalLength',
        'd',
        'text', 
        'textLength',
        'lengthAdjust',
        'startOffset'        
      )
    }
  }

  getDefaultTitle() {
    return "TextPath";
  }

  /**
   * @deprecated 
   * 
   */   
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

}