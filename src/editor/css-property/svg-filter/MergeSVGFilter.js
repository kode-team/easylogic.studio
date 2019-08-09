import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";

export class MergeSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Merge",
      sourceIn: MergeSVGFilter.spec.sourceIn.defaultValue,      
      sourceIn2: MergeSVGFilter.spec.sourceIn2.defaultValue
    });
  }

  toString() {
    var { sourceIn, sourceIn2 } = this.json; 
    return `
    <feMerge  ${this.getDefaultAttribute()} >
      <feMergeNode in="${sourceIn}" />
      <feMergeNode in="${sourceIn2}" />
    </feMerge>`;
  }
}


MergeSVGFilter.spec = {
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
  result: {
    title: 'result',
    inputType: 'text'
  }
};


