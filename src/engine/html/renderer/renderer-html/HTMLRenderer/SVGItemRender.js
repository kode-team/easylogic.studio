import { Dom } from "sapa";

import LayerRender from "./LayerRender";

import * as Color from "elf/core/color";
import { SVGFill } from "elf/editor/property-parser/SVGFill";

export default class SVGItemRender extends LayerRender {
  update(item, currentElement) {
    this.updateElementCache(item, currentElement);

    super.update(item, currentElement);
  }

  updateElementCache(item, currentElement) {
    // element 를 캐쉬 해두기
    if (item.getCache("element") !== currentElement) {
      item.addCache("element", currentElement);

      const $path = currentElement.$("path");
      item.addCache("svgElement", $path.parent().el);
      item.addCache("pathElement", $path.el);
    }
  }

  /**
   * Def 업데이트 하기
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  updateDefString(item, currentElement) {
    var $defs = currentElement.$("defs");
    if ($defs) {
      $defs.updateSVGDiff(`<defs>${this.toDefInnerString(item)}</defs>`);
    } else {
      var str = this.toDefString(item).trim();
      currentElement.prepend(Dom.createByHTML(str));
    }
  }

  /**
   *
   * @param {Item} item
   */
  toDefInnerString(item) {
    return /*html*/ `
            ${this.toFillSVG(item)}
            ${this.toStrokeSVG(item)}
        `;
  }

  fillId(item) {
    return this.getInnerId(item, "fill");
  }

  strokeId(item) {
    return this.getInnerId(item, "stroke");
  }

  cachedStroke(item) {
    return item.computed("stroke", (value) => {
      if (item.isBooleanItem) {
        return SVGFill.parseImage("transparent");
      } else {
        return SVGFill.parseImage(value || "black");
      }
    });
  }

  cachedFill(item) {
    return item.computed("fill", (value) => {
      if (item.isBooleanItem) {
        return SVGFill.parseImage("transparent");
      } else {
        return SVGFill.parseImage(value || "black");
      }
    });
  }

  toFillSVG(item) {
    const fillValue = this.cachedFill(item);
    return fillValue?.toSVGString?.(this.fillId(item), item.contentBox);
  }

  toStrokeSVG(item) {
    const strokeValue = this.cachedStroke(item);

    return strokeValue?.toSVGString?.(this.strokeId(item), item.contentBox);
  }

  toFillValue(item) {
    const fillValue = this.cachedFill(item);

    return fillValue?.toFillValue?.(this.fillId(item));
  }

  toFillOpacityValue(item) {
    return Color.parse(item.fill || "transparent").a;
  }

  toStrokeValue(item) {
    const strokeValue = this.cachedStroke(item);

    return strokeValue?.toFillValue?.(this.strokeId(item));
  }

  toFilterValue(item) {
    if (!item.svgfilter) {
      return "";
    }

    return `url(#${item.svgfilter})`;
  }

  /**
   * @override
   * @param {Item} item
   */
  toLayoutCSS() {
    return {};
  }

  /**
   *
   * @param {Item} item
   */
  toDefaultCSS(item) {
    return Object.assign({}, super.toDefaultCSS(item), {
      "stroke-width": item.strokeWidth,
      "stroke-linecap": item.strokeLinecap,
      "stroke-linejoin": item.strokeLinejoin,
      "stroke-dashoffset": item.strokeDashoffset,
      "fill-opacity": item.fillOpacity,
      "fill-rule": item.fillRule,
      "text-anchor": item.textAnchor,
      "stroke-dasharray": item.strokeDasharray?.join(" "),
    });
  }

  /**
   *
   * @param {Item} item
   */
  toSVGAttribute(item) {
    return this.toDefaultCSS(item);
  }
}
