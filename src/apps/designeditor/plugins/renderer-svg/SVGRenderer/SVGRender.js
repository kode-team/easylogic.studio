import { isFunction } from "sapa";

import DomRender from "../../renderer-html/HTMLRenderer/DomRender";

import { CSS_TO_STRING } from "elf/core/func";

export default class SVGRender extends DomRender {
  toDefaultCSS(item) {
    return {
      overflow: "visible",

      "font-size": item.fontSize,
      "font-weight": item.fontWeight,
      "font-style": item.fontStyle,
      "font-family": item.fontFamily,
      "text-align": item.textAlign,
      "text-decoration": item.textDecoration,
      "text-transform": item.textTransform,
      "letter-spacing": item.letterSpacing,
      "word-spacing": item.wordSpacing,
      "line-height": item.lineHeight,
      "text-indent": item.textIndent,
      "text-shadow": item.textShadow,
      "text-overflow": item.textOverflow,
      "text-wrap": item.textWrap,
      "z-index": item.zIndex,
      opacity: item.opacity,
      "mix-blend-mode": item.mixBlendMode,
      "transform-origin": item.transformOrigin,
      "border-radius": item.borderRadius,
      filter: item.filter,
      "backdrop-filter": item.backdropFilter,
      "box-shadow": item.boxShadow,
      animation: item.animation,
      transition: item.transition,
    };
  }

  /**
   * SVG 가 CSS 로써 가질 수 있는 값들을 정의한다.
   *
   * @param {Item} item
   */
  toCSS(item) {
    const css = Object.assign(
      {},
      this.toVariableCSS(item),
      this.toDefaultCSS(item),
      this.toClipPathCSS(item),
      this.toWebkitCSS(item),
      this.toTextClipCSS(item),
      this.toTransformCSS(item),
      this.toLayoutItemCSS(item),
      this.toBorderCSS(item),
      this.toBackgroundImageCSS(item),
      this.toLayoutCSS(item)
    );

    delete css.left;
    delete css.top;
    delete css.width;
    delete css.height;
    delete css.position;

    return css;
  }

  /**
   * css 속성 중에  svg attribute 로 전환되는 리스트를 객체로 리턴
   *
   * @param {Item} item
   */
  toSVGAttribute(item) {
    return {
      ...this.toDefaultCSS(item),
      strokeWidth: item.strokeWidth,
      "fill-opacity": item.fillOpacity,
      "fill-rule": item.fillRule,
      "stroke-linecap": item.strokeLinecap,
      "stroke-linejoin": item.strokeLinejoin,
      "text-anchor": item.textAnchor,
      "stroke-dasharray": item.strokeDasharray?.join(" "),
    };
  }

  /**
   *
   * @param {Item} item
   * @param {Function} callback
   */
  wrappedRender(item, callback) {
    const { id, x, y, width, height, itemType } = item;

    return /*html*/ `

<svg class='svg-element-item ${itemType}'
    xmlns="http://www.w3.org/2000/svg"
    data-id="${id}"
    x="${x}"
    y="${y}"
    width="${width}"
    height="${height}"
    viewBox="0 0 ${width} ${height}"
    overflow="visible"
>
    ${this.toDefString(item)}
    ${isFunction(callback) && callback()}
</svg>
        `;
  }

  /**
   *
   * @param {Item} item
   * @param {SVGRenderer} renderer
   */
  render(item, renderer) {
    const { width, height, elementType } = item;
    const tagName = elementType || "div";
    let css = this.toCSS(item);

    return this.wrappedRender(item, () => {
      return /*html*/ `
<foreignObject 
    width="${width}"
    height="${height}"
    overflow="visible"
>
    <${tagName} xmlns="http://www.w3.org/1999/xhtml" style="${CSS_TO_STRING(
        css
      )};width:100%;height:100%;"></${tagName}>
</foreignObject>    
${item.layers
  .map((it) => {
    return renderer.render(it, renderer);
  })
  .join("")}
            `;
    });
  }
}
