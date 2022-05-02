import SVGLayerRender from "./SVGLayerRender";

import { CSS_TO_STRING } from "elf/core/func";

export default class IFrameRender extends SVGLayerRender {
  /**
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    let $iframe = currentElement.$("iframe");

    if ($iframe) {
      $iframe.attr("src", item.url || "about:blank");
    }

    super.update(item, currentElement);
  }

  /**
   *
   * @param {*} item
   */
  render(item) {
    const { width, height, url = "about:blank" } = item;
    let css = this.toCSS(item);

    return this.wrappedRender(item, () => {
      return /*html*/ `
  <foreignObject
      width="${width}"
      height="${height}"
  >
      <iframe 
          xmlns="http://www.w3.org/1999/xhtml"
          width="100%" 
          height="100%" 
          style="border:0px;width:100%;height:100%;pointer-events:none; ${CSS_TO_STRING(
            css
          )}" 
          src="${url}"
      ></iframe>
  </foreignObject>              
          `;
    });
  }
}
