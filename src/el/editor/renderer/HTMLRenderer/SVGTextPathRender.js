import Dom from "el/base/Dom";
import { Item } from "el/editor/items/Item";
import SVGItemRender from "./SVGItemRender";

export default class SVGTextPathRender extends SVGItemRender {
    

  /**
   * 
   * @param {Item} item 
   * @param {Dom} currentElement 
   */
  update (item, currentElement) {

    var $path = currentElement.$('path.svg-path-item');

    if ($path) {
      $path.attr('d', item.d);
    }

    var $guidePath = currentElement.$('path.guide');
    if ($guidePath) {
      $guidePath.attr('d', item.d);
    }

    var $textPath = currentElement.$('textPath'); 
    if ($textPath) {
      $textPath.text(item.text)
      $textPath.setAttrNS({
        filter: this.toFilterValue(item),
        fill: this.toFillValue(item),
        stroke: this.toStrokeValue(item),
        textLength: item.textLength,
        lengthAdjust: item.lengthAdjust,
        startOffset: item.startOffset
      })
  
    }

    this.updateDefString(item, currentElement)

    item.totalLength = $path.totalLength
  }    

  toDefInnerString (item) {
    return /*html*/`
        ${this.toPathSVG(item)}
        ${this.toFillSVG(item)}
        ${this.toStrokeSVG(item)}
    `
  }

  toPathId (item) {
    return this.getInnerId(item, 'path')
  }

  toPathSVG (item) {
    return /*html*/`
    <path class="svg-path-item" id="${this.toPathId(item)}" d="${item.d}" fill="none" />
    `
  }

  render (item) {
    var {id, textLength, lengthAdjust, startOffset} = item; 
    const pathId = `#${this.toPathId(item)}`
    return /*html*/`
      <svg class='element-item textpath' data-id="${id}">
        ${this.toDefString(item)}
        <text class="svg-textpath-item">
          <textPath 
            xlink:href="${pathId}"
            textLength="${textLength}"
            lengthAdjust="${lengthAdjust}"
            startOffset="${startOffset}"
          >${item.text}</textPath>
          <use href="${pathId}" stroke-width="1" stroke="black" />
        </text>
        <path class="guide" d="${item.d}" fill="none"/>
      </svg>
    `
  }



}