import Dom from "el/sapa/functions/Dom";
import { Item } from "el/editor/items/Item";
import SVGItemRender from "./SVGItemRender";

export default class SVGStarRender extends SVGItemRender {
    
  /**
   * @param {Item} item
   * @param {Dom} currentElement 
   */
  update (item, currentElement) {

    if (!currentElement) return; 

    var $path = currentElement.$('path');

    if ($path) {
      if (item.hasChangedField('width', 'height', 'count', 'radius')) {
        $path.setAttrNS({
          'd':  item.d,
        })  
      } 
      if (item.hasChangedField('fill')){
        $path.setAttrNS({
          'fill': this.toFillValue(item),
        })  

      } 
      
      if (item.hasChangedField('stroke')){
        $path.setAttrNS({
          'stroke': this.toStrokeValue(item)
        })  
        
      } 
      
      if (item.hasChangedField('filter')){
        $path.setAttrNS({
          'filter': this.toFilterValue(item),
        })          
      }

      if (item.hasChangedField('fill-rule')){
        $path.setAttrNS({
          'fill-rule': item['fill-rule'] || 'nonezero',
        })          
      }

      if (item.hasChangedField('stroke-linejoin')){
        $path.setAttrNS({
          'stroke-linejoin': item['stroke-linejoin'],
        })          
      }

      if (item.hasChangedField('stroke-linecap')){
        $path.setAttrNS({
          'stroke-linecap': item['stroke-linecap'],
        })          
      }
    }

    super.update(item, currentElement)

  }    


  render (item) {
    var {id, name, itemType} = item;
  
    return /*html*/`    
<div class="element-item ${itemType}" data-id="${id}" data-title="${name}">
  ${this.toDefString(item)}
  <svg xmlns="http://www.w3.org/2000/svg" class="view-path-item" width="100%" height="100%" overflow="visible">
    <path 
      class="svg-path-item"
      d="${item.d}"
      fill-rule="${item['fill-rule']}"
      filter="${this.toFilterValue(item)}"
      fill="${this.toFillValue(item)}"
      stroke="${this.toStrokeValue(item)}"
      stroke-linejoin="${item['stroke-linejoin']}"
      stroke-linecap="${item['stroke-linecap']}"
    />
  </svg>
</div>
    `
  }

}