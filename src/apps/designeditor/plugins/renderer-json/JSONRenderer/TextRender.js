import LayerRender from "./LayerRender";

export default class TextRender extends LayerRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("content"),
    };
  }
}
