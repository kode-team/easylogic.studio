import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { blend_list } from "../../util/Resource";
 
export class BlendSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Blend",
      mode: BlendSVGFilter.spec.mode.defaultValue
    });
  }

  getInCount() { return 2 }

  toString() {
    var { mode } = this.json; 

    return /*html*/`<feBlend ${OBJECT_TO_PROPERTY({
      mode
    })} ${this.getDefaultAttribute()} />`;
  }
}

BlendSVGFilter.spec = {
  mode: {
    title: 'mode',
    inputType: 'select',
    options: blend_list,
    defaultValue: 'normal'
  }
};
