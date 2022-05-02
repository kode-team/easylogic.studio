import LayerRender from "./LayerRender";

export default class TemplateRender extends LayerRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("engine", "template", "params"),
    };
  }
}
