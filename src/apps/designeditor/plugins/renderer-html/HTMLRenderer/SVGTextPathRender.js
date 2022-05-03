import SVGItemRender from "./SVGItemRender";

export default class SVGTextPathRender extends SVGItemRender {
  /**
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    var $path = currentElement.$("path.svg-path-item");

    if ($path) {
      if (item.hasChangedField("width", "height", "d")) {
        $path.attr("d", item.d);
      }
    }

    var $guidePath = currentElement.$("path.guide");
    if ($guidePath) {
      if (item.hasChangedField("width", "height", "d")) {
        $guidePath.attr("d", item.d);
      }
    }

    var $textPath = currentElement.$("textPath");
    if ($textPath) {
      if (item.hasChangedField("text")) {
        $textPath.text(item.text);
      }

      if (item.hasChangedField("textLength", "lengthAdjust", "startOffset")) {
        $textPath.setAttrNS({
          textLength: item.textLength,
          lengthAdjust: item.lengthAdjust,
          startOffset: item.startOffset,
        });
      }

      if (item.hasChangedField("fill")) {
        $textPath.setAttrNS({
          fill: this.toFillValue(item),
        });
      }

      if (item.hasChangedField("stroke")) {
        $textPath.setAttrNS({
          stroke: this.toStrokeValue(item),
        });
      }

      if (item.hasChangedField("filter")) {
        $textPath.setAttrNS({
          filter: this.toFilterValue(item),
        });
      }
    }

    super.update(item, currentElement);

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
    <path class="svg-path-item" id="${this.toPathId(item)}" d="${
      item.d
    }" fill="none" />
    `;
  }

  render(item) {
    var { id, textLength, lengthAdjust, startOffset } = item;
    const pathId = `#${this.toPathId(item)}`;
    return /*html*/ `
      <svg class='element-item textpath' data-id="${id}">
        ${this.toDefString(item)}
        <text class="svg-textpath-item">
          <textPath 
            xlink:href="${pathId}"
            textLength="${textLength}"
            lengthAdjust="${lengthAdjust}"
            startOffset="${startOffset}"
          >${item.text}</textPath>
          <use href="${pathId}" stroke-width="1" stroke="black" />
        </text>
        <path class="guide" d="${
          item.d
        }" stroke="rgba(0, 0, 0, 0.5)" fill="none"/>
      </svg>
    `;
  }
}
