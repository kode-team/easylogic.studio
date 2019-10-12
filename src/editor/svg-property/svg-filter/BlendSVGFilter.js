import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { blend_list } from "../../util/Resource";

export class BlendSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Blend",
      sourceIn: BlendSVGFilter.spec.sourceIn.defaultValue,
      sourceIn2: BlendSVGFilter.spec.sourceIn2.defaultValue,
      mode: BlendSVGFilter.spec.mode.defaultValue
    });
  }

  toString() {
    var { sourceIn, sourceIn2, mode } = this.json; 

    var mode = mode ? `mode="${mode}"` : '';  

    return /*html*/`<feBlend ${OBJECT_TO_PROPERTY({
      in: sourceIn,
      in2: sourceIn2,
      mode
    })} ${this.getDefaultAttribute()} />`;
  }
}

BlendSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },
  sourceIn2: {
    title: "in2",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },
  scale: {
    title: 'mode',
    inputType: 'select',
    options: blend_list,
    defaultValue: 'normal'
  },
  result: {
    title: 'result',
    inputType: 'text'
  }
};
