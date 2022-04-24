import SVGItemRender from "./SVGItemRender";

export default class SVGTextPathRender extends SVGItemRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        "totalLength",
        "d",
        "text",
        "textLength",
        "lengthAdjust",
        "startOffset"
      ),
    };
  }
}
