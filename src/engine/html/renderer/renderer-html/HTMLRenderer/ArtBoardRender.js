import DomRender from "./DomRender";

export default class ArtBoardRender extends DomRender {
  /**
   * Artboard 템플릿 설정
   *
   * @param {Item} item
   * @override
   */
  render(item) {
    var { id } = item;

    return /*html*/ `<div class="element-item artboard" data-id="${id}">${this.toDefString(
      item
    )}${item.layers
      .map((it) => {
        return this.renderer.render(it);
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
