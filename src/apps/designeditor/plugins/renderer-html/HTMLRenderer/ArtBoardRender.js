import DomRender from "./DomRender";

export default class ArtBoardRender extends DomRender {
  /**
   * Artboard 템플릿 설정
   *
   * @param {Item} item
   * @param {Renderer} renderer
   * @override
   */
  render(item, renderer) {
    var { id } = item;

    return /*html*/ `<div class="element-item artboard" data-id="${id}">${this.toDefString(
      item
    )}${item.layers
      .map((it) => {
        return renderer.render(it, renderer);
      })
      .join("")}</div>`;
  }

  /**
   *
   * artboard 는 border 를 표현하지 않는다.
   *
   * @param {Item} item
   */
  toBorderCSS() {
    return {};
  }
}
