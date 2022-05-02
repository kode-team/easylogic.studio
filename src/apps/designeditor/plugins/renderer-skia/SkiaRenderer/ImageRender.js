import LayerRender from "./LayerRender";

export default class ImageRender extends LayerRender {
  /**
   * 중첩 CSS 정의
   *
   * @param {Item} item
   */
  toNestedCSS() {
    return [
      {
        selector: "img",
        cssText: `
                width: 100%;
                height: 100%;
                pointer-events: none;
                `.trim(),
      },
    ];
  }

  /**
   *
   * @param {Item} item
   */
  getUrl(item) {
    var { src } = item;
    var project = item.project;

    return project.getImageValueById(src) || src;
  }

  /**
   *
   * @param {*} item
   */
  render(item) {
    var { id } = item;

    return /*html*/ `
          <div class='element-item image' data-id="${id}">
            ${this.toDefString(item)}
            <img src='${this.getUrl(item)}' />
          </div>`;
  }

  /**
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    const $image = currentElement.$("img");
    if ($image) {
      $image.attr("src", this.getUrl(item));
    }

    super.update(item, currentElement);
  }
}
