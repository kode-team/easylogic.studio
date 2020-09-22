import Dom from "@core/Dom";
import { OBJECT_TO_PROPERTY } from "@core/functions/func";
import { Item } from "@items/Item";
import SVGItemRender from "./SVGItemRender";

export default class SVGTextRender extends SVGItemRender {
    
  /**
   * 
   * @param {Item} item
   * @param {Dom} currentElement 
   */
  update (item, currentElement) {
    var $text = currentElement.$('text'); 

    if ($text) {
      $text.text(item.text)
      $text.setAttr({
        filter: this.toFilterValue(item),
        fill: this.toFillValue(item),
        stroke: this.toStrokeValue(item),   
        textLength: item.textLength,
        lengthAdjust: item.lengthAdjust
      })
  
    }

    this.updateDefString(item, currentElement)

  }    

  shapeInsideId (item) {
    return this.getInnerId(item, 'shape-inside')
  }    

  render (item) {
    var {id, textLength, lengthAdjust} = item; 

    return /*html*/`
  <svg class='element-item textpath' data-id="${id}">
    ${this.toDefString(item)}
      <text ${OBJECT_TO_PROPERTY({
        'class': 'svg-text-item',
        textLength,
        lengthAdjust,
      })} >${item.text}</text>
  </svg>`
  }



}