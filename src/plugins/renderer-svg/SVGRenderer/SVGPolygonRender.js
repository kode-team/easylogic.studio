import { CSS_TO_STRING, OBJECT_TO_PROPERTY } from "elf/utils/func";
import SVGItemRender from "./SVGItemRender";

export default class SVGPolygonRender extends SVGItemRender {
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
        class: "polygon-item",
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
