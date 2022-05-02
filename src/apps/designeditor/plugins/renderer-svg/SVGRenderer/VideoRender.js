import SVGLayerRender from "./SVGLayerRender";

import { CSS_TO_STRING } from "elf/core/func";

export default class VideoRender extends SVGLayerRender {
  /**
   *
   * @param {Project} item
   */
  getUrl(item) {
    var { src } = item;
    var project = item.project;

    return project.getVideoValueById(src);
  }

  /**
   *
   * @param {Item} item
   * @param {SVGRenderer} renderer
   */
  render(item) {
    var {
      width,
      height,
      controls,
      muted,
      poster,
      loop,
      crossorigin,
      autoplay,
    } = item;
    let css = this.toCSS(item);

    return this.wrappedRender(item, () => {
      return /*html*/ `
            <foreignObject 
                width="${width}"
                height="${height}"
                overflow="visible"
            >
                <video 
                    xmlns="http://www.w3.org/1999/xhtml"
                    controls="${controls}"
                    src="${this.getUrl(item)}"
                    muted="${muted}"
                    poster="${poster}"
                    loop="${loop}"
                    crossorigin="${crossorigin}"
                    autoplay="${autoplay}"
                    style="${CSS_TO_STRING(
                      css
                    )};width:100%;height:100%;"></video>
            </foreignObject>    
            `;
    });
  }
}
