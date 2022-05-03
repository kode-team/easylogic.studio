import SVGItemRender from "./SVGItemRender";

export default class SVGTextRender extends SVGItemRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        "totalLength",
        "text",
        "textLength",
        "lengthAdjust",
        "shape-inside"
      ),
    };
  }
}
