import Dom from "el/base/Dom";
import { Item } from "el/editor/items/Item";
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

      if (item.hasChangedField('text')) {
        $textPath.text(item.text)
      }

      if (item.hasChangedField('textLength', 'lengthAdjust', 'startOffset')) {
        $textPath.setAttrNS({
          textLength: item.textLength,
          lengthAdjust: item.lengthAdjust,
          startOffset: item.startOffset
        })  
      }

      if (item.hasChangedField('fill')) {
        $textPath.setAttrNS({
          fill: this.toFillValue(item),
        })
      }

      if (item.hasChangedField('stroke')) {
        $textPath.setAttrNS({
          stroke: this.toStrokeValue(item),
        })
      }      

      if (item.hasChangedField('filter')) {
        $textPath.setAttrNS({
          filter: this.toFilterValue(item),
        })
      }            
  
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
      <text class="svg-text-item" textLength="${textLength}" lengthAdjust="${lengthAdjust}">${item.text}</text>
  </svg>`
  }



}