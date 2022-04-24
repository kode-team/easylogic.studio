import LayerRender from "./LayerRender";

export default class SVGItemRender extends LayerRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        "overflow",
        "stroke",
        "stroke-width",
        "svgfilter",
        "fill",
        "fill-rule",
        "fill-opacity",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-dashoffset",
        "stroke-dasharray",
        "text-anchor"
      ),
    };
  }
}
