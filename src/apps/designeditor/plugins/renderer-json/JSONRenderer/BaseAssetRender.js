import ItemRender from "./ItemRender";

export default class BaseAssetRender extends ItemRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("svgfilters", "keyframes"),
    };
  }
}
