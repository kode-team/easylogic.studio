import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";

export class ComponentTransferSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "ComponentTransfer",
      sourceIn: ComponentTransferSVGFilter.spec.sourceIn.defaultValue,      
      r: ComponentTransferSVGFilter.spec.r.defaultValue,
      g: ComponentTransferSVGFilter.spec.g.defaultValue,
      b: ComponentTransferSVGFilter.spec.b.defaultValue,
      a: ComponentTransferSVGFilter.spec.a.defaultValue,
    });
  }

  parse (value) {
    var [type, ...values] = value.split(' ')

    if (type === 'table' || type === 'discrete') {
      return {type, tableValues: values.join(' ')}
    } if (type === 'linear') {
      var [slop, intercept] = values; 
      return {type, slop, intercept}
    } else if (type === 'gamma') {
      var [amplitude, exponent, offset] = values; 
      return {type, amplitude, exponent, offset}
    }

    return {type}
}

  toString() {
    var { sourceIn, r, g, b, a } = this.json;
    
    r = this.parse(r);
    g = this.parse(g);
    b = this.parse(b);
    a = this.parse(a);

    return /*html*/`<feComponentTransfer in="${sourceIn}" ${this.getDefaultAttribute()} >
      ${r && `<feFuncR ${OBJECT_TO_PROPERTY(r)} />`}
      ${g && `<feFuncG ${OBJECT_TO_PROPERTY(g)} />`}
      ${b && `<feFuncB ${OBJECT_TO_PROPERTY(b)} />`}
      ${a && `<feFuncA ${OBJECT_TO_PROPERTY(a)} />`}
    </feComponentTransfe>`;
  }
}


ComponentTransferSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },  
  r: {
    title: "R",
    inputType: "FuncFilter",
    defaultValue: "identity"
  },  
  g: {
    title: "G",
    inputType: "FuncFilter",
    defaultValue: "identity"
  },  
  b: {
    title: "B",
    inputType: "FuncFilter",
    defaultValue: "identity"
  },  
  a: {
    title: "A",
    inputType: "FuncFilter",
    defaultValue: "identity"
  },        
  result: {
    title: 'result',
    inputType: 'text'
  }
};


