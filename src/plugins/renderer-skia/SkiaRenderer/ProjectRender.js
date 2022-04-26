import DomRender from "./DomRender";

export default class ProjectRender extends DomRender {
  /**
   *
   *
   * @param {Item} item
   * @param {SkiaRenderer} renderer
   */
  renderItem(item, renderer, canvas) {
    return item.layers.forEach((it) => {
      renderer.renderItem(it, renderer, canvas);
    });
  }
}
