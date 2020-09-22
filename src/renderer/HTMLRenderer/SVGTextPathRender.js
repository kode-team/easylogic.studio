import Dom from "@core/Dom";
import { OBJECT_TO_PROPERTY } from "@core/functions/func";
import { Item } from "@items/Item";
import SVGItemRender from "./SVGItemRender";

export default class SVGTextPathRender extends SVGItemRender {
    

  /**
   * 
   * @param {Item} item 
   * @param {Dom} currentElement 
   */
  update (item, currentElement) {

    var $path = currentElement.$('path');

    if ($path) {
      $path.attr('d', item.d);
    }

    var $textPath = currentElement.$('textPath'); 
    if ($textPath) {
      $textPath.text(item.text)
      $textPath.setAttr({
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
    <path ${OBJECT_TO_PROPERTY({
      'class': 'svg-path-item',
      id: this.toPathId(item),
      d: item.d,
      fill: 'none'
    })} />
    `
  }

  render (item) {
    console.log(item);
    var {id, textLength, lengthAdjust, startOffset} = item; 

    return /*html*/`
  <svg class='element-item textpath' data-id="${id}">
    ${this.toDefString(item)}
      <text ${OBJECT_TO_PROPERTY({
        'class': 'svg-textpath-item'
      })} >
        <textPath ${OBJECT_TO_PROPERTY({
          'xlink:href' :`#${this.toPathId(item)}`,
          textLength,
          lengthAdjust,
          startOffset
        })} >${item.text}</textPath>
    </text>
  </svg>`
  }



}