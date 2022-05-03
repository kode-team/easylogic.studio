import SVGLayerRender from "./SVGLayerRender";

import { CSS_TO_STRING } from "elf/core/func";

export default class ImageRender extends SVGLayerRender {
  /**
   *
   * resource url 얻어오기
   *
   * @param {Item} item
   */
  getUrl(item) {
    var { src } = item;
    var project = item.project;

    return project.getImageValueById(src);
  }

  /**
   *
   * @param {*} item
   */
  render(item) {
    const { width, height } = item;
    let css = this.toCSS(item);

    return this.wrappedRender(item, () => {
      return /*html*/ `
            <foreignObject
                width="${width}"
                height="${height}"
            >
                <div xmlns="http://www.w3.org/1999/xhtml">
                    <img src='${this.getUrl(
                      item
                    )}' style="width:100%;height:100%; ${CSS_TO_STRING(
        css
      )}"  />
                </div>
            </foreignObject>              
          `;
    });
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
