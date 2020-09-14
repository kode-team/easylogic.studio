import { BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "@unit/Length";
import { OBJECT_TO_PROPERTY } from "@core/functions/func";

export class ImageSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Image",
      x: ImageSVGFilter.spec.x.defaultValue,
      y: ImageSVGFilter.spec.y.defaultValue,
      width: ImageSVGFilter.spec.width.defaultValue,
      height: ImageSVGFilter.spec.height.defaultValue,
      src: ImageSVGFilter.spec.src.defaultValue,
      alignment: ImageSVGFilter.spec.alignment.defaultValue,
      scaleing: ImageSVGFilter.spec.scaleing.defaultValue
    });
  }

  convert (json) {

    json.x = Length.parse(json.x);
    json.y = Length.parse(json.y);
    json.width = Length.parse(json.width);
    json.height = Length.parse(json.height);

    return json; 
  }

  toString() {

    const {src, x, y, width, height, alignment, scaleing} = this.json;

    return `<feImage ${OBJECT_TO_PROPERTY({
      x, y, width, height, 
      'xlink:href': src,
      preserveAspectRatio:`${alignment} ${scaleing}`
    })} ${this.getDefaultAttribute()} />`;
  }
}

ImageSVGFilter.spec = {
  
  x: {
    title: "X",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },  
  y: {
    title: "Y",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },  
  width: {
    title: "width",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },  
  height: {
    title: "height",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },        
  alignment: {
    title: "alignment",
    inputType: "select",
    options: "xMinYMin,xMidYMin,xMaxYMin,xMinYMid,xMidYMid,xMaxYMid,xMinYMax,xMidYMax,xMaxYMax",
    defaultValue: "xMidYMid"
  },
  scaleing: {
    title: "scaleing",
    inputType: "select",
    options: "meet,slice",
    defaultValue: "meet"
  },
  src: {
    title: "Image",
    inputType: "ImageSelectEditor",
    defaultValue: ''
  }
};


