import LayerRender from "./LayerRender";

export default class ImageRender extends LayerRender {
  async toCloneObject(item, renderer) {
    const project = item.project;

    const image = project.imageKeys[item.src];
    const src = image.original;

    return {
      ...(await super.toCloneObject(item, renderer)),
      src,
    };
  }
}
