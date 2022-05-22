import SVGItemRender from "./SVGItemRender";

import { CSS_TO_STRING, OBJECT_TO_PROPERTY } from "elf/core/func";

export default class SVGTextPathRender extends SVGItemRender {
  /**
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    var $path = currentElement.$("path");

    if ($path) {
      $path.attr("d", item.d);
    }

    var $textPath = currentElement.$("textPath");
    if ($textPath) {
      $textPath.text(item.text);
      $textPath.setAttr({
        filter: this.toFilterValue(item),
        fill: this.toFillValue(item),
        stroke: this.toStrokeValue(item),
        textLength: item.textLength,
        lengthAdjust: item.lengthAdjust,
        startOffset: item.startOffset,
      });
    }

    this.updateDefString(item, currentElement);

    item.totalLength = $path.totalLength;
  }

  toDefInnerString(item) {
    return /*html*/ `
      ${this.toPathSVG(item)}
      ${this.toFillSVG(item)}
      ${this.toStrokeSVG(item)}
    `;
  }

  toPathId(item) {
    return this.getInnerId(item, "path");
  }

  toPathSVG(item) {
    return /*html*/ `
      <path 
        class="svg-path-item"
        id="${this.toPathId(item)}"
        d="${item.d}"
        fill="none"
      />
    `;
  }

  render(item) {
    return this.wrappedRender(item, () => {
      const { textLength, lengthAdjust, startOffset } = item;

      return /*html*/ `
        <textPath ${OBJECT_TO_PROPERTY({
          "xlink:href": `#${this.toPathId(item)}`,
          textLength,
          lengthAdjust,
          startOffset,
          filter: this.toFilterValue(item),
          fill: this.toFillValue(item),
          stroke: this.toStrokeValue(item),
          ...this.toSVGAttribute(item),
          style: CSS_TO_STRING(this.toCSS(item)),
        })} >${item.text}</textPath>
      `;
    });
  }
}
