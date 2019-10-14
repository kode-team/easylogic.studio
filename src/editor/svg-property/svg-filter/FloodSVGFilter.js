import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";

export class FloodSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Flood",
      x: FloodSVGFilter.spec.x.defaultValue,
      y: FloodSVGFilter.spec.y.defaultValue,
      width: FloodSVGFilter.spec.width.defaultValue,
      height: FloodSVGFilter.spec.height.defaultValue,
      color: FloodSVGFilter.spec.color.defaultValue,
      opacity: FloodSVGFilter.spec.opacity.defaultValue
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

    const {opacity, color, x, y, width, height} = this.json;

    return `<feFlood ${OBJECT_TO_PROPERTY({
      x, y, width, height
    })} flood-opacity="${opacity}" flood-color="${color}" ${this.getDefaultAttribute()} />`;
  }
}

FloodSVGFilter.spec = {
  
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
  opacity: {
    title: "opacity",
    inputType: "number-range",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(0)
  },

  color: {
    title: "color",
    inputType: "color",
    defaultValue: 'rgba(0, 0, 0, 1)'
  }
};


