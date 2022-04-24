import SVGPathRender from "./SVGPathRender";

export default class SplineRender extends SVGPathRender {
  /**
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    if (!currentElement) return;

    var $path = currentElement.$("path");

    if ($path) {
      if (item.hasChangedField("points", "boundary")) {
        $path.setAttrNS({
          d: item.d,
        });
      }
    }

    super.update(item, currentElement);
  }
}
