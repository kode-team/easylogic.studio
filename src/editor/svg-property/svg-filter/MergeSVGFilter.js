import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";

export class MergeSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Merge"
    });
  }

  getInCount() { return 3 }  


  toString() {
    var { in: inList } = this.json; 
    return /*html*/`
    <feMerge  ${this.getDefaultAttribute()} >
      ${inList.map(it => {
        return `<feMergeNode ${this.getSourceInAttribute([it])} />`
      }).join('')}
    </feMerge>`;
  }
}


MergeSVGFilter.spec = {

};


