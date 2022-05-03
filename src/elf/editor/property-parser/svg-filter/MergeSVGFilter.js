import { BaseSVGFilter } from "./BaseSVGFilter";

export class MergeSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Merge",
    });
  }

  getInCount() {
    return 3;
  }

  getDefaultAttribute() {
    var list = [];

    if (this.json.connected.length) {
      list.push(`result="${this.json.id}result"`);
    }

    return list.join(" ");
  }

  toString() {
    var { in: inList } = this.json;
    return /*html*/ `
    <feMerge  ${this.getDefaultAttribute()} >
      ${inList
        .map((it) => {
          return `<feMergeNode ${this.getSourceInAttribute([it])} />`;
        })
        .join("")}
    </feMerge>`;
  }
}

MergeSVGFilter.spec = {};
