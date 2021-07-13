import { CSS_TO_STRING } from "el/base/functions/func";
import LayerRender from "./LayerRender";


const faceKeys = [
    'front', 'back', 'left', 'right', 'top','bottom'
]
  
export default class CubeRender extends LayerRender {
    
  /**
   * 
   * @param {Item} item 
   */ 
  toDefaultCSS(item) {
    let obj = {}

    if (item.x)  obj.left = item.x ;
    if (item.y)  obj.top = item.y ;    

    obj.visibility = (item.visible) ? 'visible' : 'hidden';    

    return {
      ...obj,
      ...this.toKeyListCSS(item, [
        'position', 
        'right', 
        'bottom', 
        'width',
        'height', 
        'transform-origin', 
        'transform', 
        'transform-style', 
        'perspective', 
        'perspective-origin',
        'animation',  
        'transition',
        // 'filter',
      ])
    }

  }   


  /**
   * 
   * @param {Item} item 
   */
  toCSS(item) {

    return {
      ...this.toVariableCSS(item),
      ...this.toDefaultCSS(item),
      ...this.toWebkitCSS(item),      
      ...this.toBoxModelCSS(item),
      ...this.toLayoutItemCSS(item),
    };
  }


  /**
   * 
   * @param {Item} item 
   */
  toNestedCSS(item) {

    var rate = item.rate.value; 
    var width = item.width; 
    var height = item.height; 
    var halfWidth = width.value/2
    var halfHeight = height.value/2
    var backfaceVisibility = item['backface-visibility']
    var css = {
      ...this.toKeyListCSS(item, [
        'filter', 
        'mix-blend-mode', 
        'border-radius', 
        'background-color', 
        'opacity', 
        'color'
      ]),      
      ...this.toClipPathCSS(item),
      ...this.toBackgroundImageCSS(item),
      ...this.toBorderCSS(item)
    }

    return [
      { selector: 'div', cssText: `
          position: absolute;
          left: 0px;
          top: 0px;
          bottom: 0px;
          right: 0px;
          opacity: 1;
          pointer-events: none;
          ${CSS_TO_STRING(css)}
        `.trim()
      },
      {
        selector: '.front', cssText: `
          transform:rotateY(0deg) translateZ(${halfWidth * rate}px);
          width: ${width};
          height: ${height};     
          backface-visibility: ${backfaceVisibility};          
          ${item['front.color'] ? `background-color: ${item['front.color']};`: ''}
          ${item['front.background'] ? `${item['front.background']};`: ''}

        `.trim()
      },
      {
        selector: '.back', cssText: `
          transform: rotateY(180deg) translateZ(${halfWidth * rate}px);
          width: ${width};
          height: ${height};        
          backface-visibility: ${backfaceVisibility};              
          ${item['back.color'] ? `background-color: ${item['back.color']};`: ''}                  
          ${item['back.background'] ? `${item['back.background']};`: ''}
        `.trim()
      },
      {
        selector: '.left', cssText:  `
          transform: rotateY(-90deg) translateZ(${halfWidth * rate}px);
          width: ${width};
          height: ${height};    
          backface-visibility: ${backfaceVisibility};          
          ${item['left.color'] ? `background-color: ${item['left.color']};`: ''}                          
          ${item['left.background'] ? `${item['left.background']};`: ''}
        `.trim()
      },
      {
        selector: '.right', cssText: `
          transform: rotateY(90deg) translateZ(${halfWidth * rate}px);
          width: ${width};
          height: ${height};      
          backface-visibility: ${backfaceVisibility};          
          ${item['right.color'] ? `background-color: ${item['right.color']};`: ''}                        
          ${item['right.background'] ? `${item['right.background']};`: ''}          
        `.trim()
      },
      {
        selector: '.top', cssText: `
          transform: rotateX(90deg) translateZ(${halfHeight * rate}px);
          top: ${halfHeight - halfWidth}px;
          width: ${width};
          height: ${width};
          backface-visibility: ${backfaceVisibility};          
          ${item['top.color'] ? `background-color: ${item['top.color']};`: ''}      
          ${item['top.background'] ? `${item['top.background']};`: ''}              
        `.trim()
      },
      {
        selector: '.bottom', cssText: `
          transform: rotateX(-90deg) translateZ(${halfHeight * rate}px);
          top: ${halfHeight - halfWidth}px;          
          width: ${width};
          height: ${width};    
          backface-visibility: ${backfaceVisibility};          
          ${item['bottom.color'] ? `background-color: ${item['bottom.color']};`: ''}
          ${item['bottom.background'] ? `${item['bottom.background']};`: ''}                          
        `.trim()
      }
    ]
  }

  /**
   * 
   * @param {Item} item 
   */
  render (item) {
    var {id} = item;

    return /*html*/`
      <div class='element-item cube' data-id="${id}">
        ${this.toDefString(item)}
        ${faceKeys.map(key => {
          return /*html*/`<div class='${key}'></div>`
        }).join('')}
      </div>`
  }


}