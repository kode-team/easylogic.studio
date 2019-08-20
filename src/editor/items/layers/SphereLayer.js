import { Layer } from "../Layer";
import Color from "../../../util/Color";
import { CSS_TO_STRING, repeat } from "../../../util/functions/func";
import HueColor from "../../../util/HueColor";
import { rgb } from "../../../util/functions/formatter";

export class SphereLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'sphere',
      name: "New Sphere",
      'line-count': 5,
      'transform-style':'preserve-3d',
      transform: 'rotateX(10deg) rotateY(30deg)',
      ...obj
    });
  }

  getDefaultTitle() { 
    return "Sphere";
  }


  toCloneObject() {
    return {
      ...super.toCloneObject(),
      'line-count': this.json['line-count']
    }
  }

  toDefaultCSS(isExport = false) {
    var obj = {}

    if (this.json.x)  obj.left = this.json.x ;
    if (this.json.y)  obj.top = this.json.y ;    

    return {
      ...obj,
      ...this.toKeyListCSS(
        'position', 'right','bottom', 'width','height', 'opacity',
        'transform-origin', 'transform-style', 'perspective', 'perspective-origin',
        // 'filter',
      )
    }

  }  

  toCSS(isExport = false) {

    return {
      ...this.toVariableCSS(),
      ...this.toDefaultCSS(isExport),
      ...this.toWebkitCSS(),      
      ...this.toBoxModelCSS(),
      ...this.toTransformCSS(),      
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS()
    };
  }

  toNestedCSS() {
    var json = this.json; 

    var width = json.width; 
    var height = json.height; 
    var borderColor = '#333'
    var halfWidth = width.value/2
    var halfHeight = height.value/2

    var css = {
      ...this.toKeyListCSS(
        'filter', 'mix-blend-mode'
      ),      
      ...this.toBackgroundImageCSS(),
      ...this.toBorderCSS(),
      ...this.toBorderRadiusCSS()
    }

    var unit = 360 / this.json['line-count'];

    


    var rings = repeat(this.json['line-count']).map((_, index) => {
      var deg = unit * index;
      var color = HueColor.checkHueColor(deg / 360)
      return {
        selector: `div:nth-child(${index+1})`, cssText: `
          border-color: ${color};
          background-color: ${color};
          transform: rotateY(${deg}deg);
        `
      }
    })

    return [
      { selector: 'div', cssText: `
          position: absolute;
          left: 0px;
          top: 0px;
          bottom: 0px;
          right: 0px;
          opacity: 1;          
          pointer-events: none;
          border-radius: 50%;
          will-change: transform;
          backface-visibility: hidden;
          border: 3px dashed ${borderColor};
          ${CSS_TO_STRING(css)}
        `
      },
      ...rings
    ]
  }

  get html () {
    var {id, itemType, 'line-count': lineCount} = this.json;

    return `
      <div class='element-item ${itemType}' data-id="${id}">
        ${repeat(lineCount).map(it => {
          return `<div></div>`
        }).join('')}
      </div>
    `
  }

}
 