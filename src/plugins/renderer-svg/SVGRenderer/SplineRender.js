import SVGItemRender from "./SVGItemRender";

import { CSS_TO_STRING, OBJECT_TO_PROPERTY } from "elf/core/func";

export default class SplineRender extends SVGItemRender {
  /**
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    if (!currentElement) return;

    var $path = currentElement.$("path");

    if ($path) {
      $path.setAttr({
        d: item.d,
        filter: this.toFilterValue(item),
        fill: this.toFillValue(item),
        stroke: this.toStrokeValue(item),
      });
    }

    this.updateDefString(item, currentElement);
  }

  render(item) {
    var { d } = item;

    return this.wrappedRender(item, () => {
      return /*html*/ `
<path ${OBJECT_TO_PROPERTY({
        class: "spline-item",
        d,
        filter: this.toFilterValue(item),
        fill: this.toFillValue(item),
        stroke: this.toStrokeValue(item),
        ...this.toSVGAttribute(item),
        style: CSS_TO_STRING(this.toCSS(item)),
      })} />
    `;
    });
  }
}
