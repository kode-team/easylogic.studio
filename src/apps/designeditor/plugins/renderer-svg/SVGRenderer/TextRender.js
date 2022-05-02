import SVGLayerRender from "./SVGLayerRender";

import { CSS_TO_STRING } from "elf/core/func";

export default class TextRender extends SVGLayerRender {
  /**
   *
   * @param {Item} item
   */
  toCSS(item) {
    let css = super.toCSS(item);

    css.margin = css.margin || "0px";
    css.height = "auto";

    return css;
  }

  /**
   *
   * @param {Item} item
   */
  render(item) {
    const { content, width, height } = item;
    let css = this.toCSS(item);

    return this.wrappedRender(item, () => {
      return /*html*/ `
            <foreignObject width="${width}" height="${height}">
                <p xmlns="http://www.w3.org/1999/xhtml" style="${CSS_TO_STRING(
                  css
                )}">${content}</p>
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
    var { content } = item;

    currentElement.updateDiff(content);
  }
}
