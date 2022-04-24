import LayerRender from "./LayerRender";

export default class VideoRender extends LayerRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("src"),
    };
  }
}
