import SVGItemRender from "./SVGItemRender";

import { CSS_TO_STRING, OBJECT_TO_PROPERTY } from "elf/core/func";

export default class SVGTextRender extends SVGItemRender {
  /**
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    var $text = currentElement.$("text");

    if ($text) {
      $text.text(item.text);
      $text.setAttr({
        filter: this.toFilterValue(item),
        fill: this.toFillValue(item),
        stroke: this.toStrokeValue(item),
        textLength: item.textLength,
        lengthAdjust: item.lengthAdjust,
      });
    }

    this.updateDefString(item, currentElement);
  }

  shapeInsideId(item) {
    return this.getInnerId(item, "shape-inside");
  }

  render(item) {
    var { textLength, lengthAdjust } = item;

    return this.wrappedRender(item, () => {
      return /*html*/ `
        <text ${OBJECT_TO_PROPERTY({
          class: "svg-text-item",
          textLength,
          lengthAdjust,
          filter: this.toFilterValue(item),
          fill: this.toFillValue(item),
          stroke: this.toStrokeValue(item),
          ...this.toSVGAttribute(item),
          style: CSS_TO_STRING(this.toCSS(item)),
        })} >${item.text}</text>
      `;
    });
  }
}
