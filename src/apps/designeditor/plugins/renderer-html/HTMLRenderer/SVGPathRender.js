import SVGItemRender from "./SVGItemRender";

export default class SVGPathRender extends SVGItemRender {
  /**
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    if (!currentElement) return;

    const $path = currentElement.$("path");

    if ($path) {
      if (item.hasChangedField("width", "height", "d")) {
        $path.setAttrNS({
          d: item.d,
        });
      }
      if (item.hasChangedField("fill")) {
        $path.setAttrNS({
          fill: this.toFillValue(item),
        });
      }

      if (item.hasChangedField("stroke")) {
        $path.setAttrNS({
          stroke: this.toStrokeValue(item),
        });
      }

      if (item.hasChangedField("filter")) {
        $path.setAttrNS({
          filter: this.toFilterValue(item),
        });
      }

      if (item.hasChangedField("fill-rule")) {
        $path.setAttrNS({
          "fill-rule": item.fillRule || "nonezero",
        });
      }

      if (item.hasChangedField("stroke-linejoin")) {
        $path.setAttrNS({
          "stroke-linejoin": item.strokeLinejoin,
        });
      }

      if (item.hasChangedField("stroke-linecap")) {
        $path.setAttrNS({
          "stroke-linecap": item.strokeLinecap,
        });
      }

      if (item.hasChangedField("stroke-dasharray")) {
        $path.setAttrNS({
          "stroke-dasharray": item.strokeDasharray.join(" "),
        });
      }
    }

    super.update(item, currentElement);
  }

  render(item) {
    var { id, name, itemType } = item;

    return /*html*/ `    
<div class="element-item ${itemType}" data-id="${id}" data-title="${name}">
  ${this.toDefString(item)}
  <svg xmlns="http://www.w3.org/2000/svg" class="view-path-item" width="100%" height="100%" overflow="visible">
    <path 
      class="svg-path-item"
      d="${item.d}"
      fill-rule="${item.fillRule}"
      filter="${this.toFilterValue(item)}"
      fill="${this.toFillValue(item)}"
      stroke="${this.toStrokeValue(item)}"
      stroke-linejoin="${item.strokeLinejoin}"
      stroke-linecap="${item.strokeLinecap}"
      stroke-dasharray="${item.strokeDasharray.join(" ")}"
    />
  </svg>
</div>
    `;
  }
}
