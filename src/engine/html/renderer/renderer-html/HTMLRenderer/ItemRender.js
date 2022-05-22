export default class ItemRender {
  constructor(renderer) {
    this.renderer = renderer;
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  /**
   * id 기반 문자열 id 생성
   *
   * @param {Item} item
   * @param {string} postfix
   */
  getInnerId(item, postfix = "") {
    return item.id + postfix;
  }

  uniqueId(item) {
    return this.renderer.id + "-" + item.id;
  }
}
