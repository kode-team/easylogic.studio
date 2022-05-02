import SVGItemRender from "./SVGItemRender";

export default class SplineRender extends SVGItemRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("points", "boundary"),
    };
  }
}
