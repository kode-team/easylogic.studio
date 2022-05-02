import ItemRender from "./ItemRender";

export default class AssetRender extends ItemRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        "colors",
        "gradients",
        "svgfilters",
        "svgimages",
        "images",
        "keyframes"
      ),
    };
  }
}
