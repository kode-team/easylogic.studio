import SVGRender from "./SVGRender";

export default class ProjectRender extends SVGRender {
  /**
   *
   * @param {Item} item
   * @param {HTMLRenderer} renderer
   */
  render(item, renderer) {
    return item.artboards.map((it) => {
      return renderer.render(it, renderer);
    });
  }
}
