import AssetRender from "./AssetRender";

export default class TimelineRender extends AssetRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("timeline"),
    };
  }
}
