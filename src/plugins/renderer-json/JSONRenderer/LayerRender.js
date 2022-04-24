import DomRender from "./DomRender";

export default class LayerRender extends DomRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("tagName"),
    };
  }
}
