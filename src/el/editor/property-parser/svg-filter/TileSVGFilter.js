import { BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "el/editor/unit/Length";
import { OBJECT_TO_PROPERTY } from "el/base/functions/func";

export class TileSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Tile",
      x: TileSVGFilter.spec.x.defaultValue,
      y: TileSVGFilter.spec.y.defaultValue,
      width: TileSVGFilter.spec.width.defaultValue,
      height: TileSVGFilter.spec.height.defaultValue
    });
  }

  getInCount() {
    return 1; 
  }

  convert (json) {

    json.x = Length.parse(json.x);
    json.y = Length.parse(json.y);
    json.width = Length.parse(json.width);
    json.height = Length.parse(json.height);

    return json; 
  }

  toString() {

    const {x, y, width, height} = this.json;

    return `<feTile ${OBJECT_TO_PROPERTY({
      x, y, width, height
    })} ${this.getDefaultAttribute()} />`;
  }
}

TileSVGFilter.spec = {
  
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
  }
};


