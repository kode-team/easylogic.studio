import { Length } from "el/editor/unit/Length";
import icon from "el/editor/icon/icon";
import { CSS_TO_STRING, OBJECT_TO_PROPERTY } from "el/utils/func";
import { Component } from "el/editor/model/Component";

const faceKeys = [
  'front', 'back', 'left', 'right', 'top','bottom'
]

const customSelectorName = {
  'front.color': '.front',
  'back.color': '.back',
  'left.color': '.left',
  'right.color': '.right',
  'top.color': '.top',
  'bottom.color': '.bottom',
  'front.background': '.front',
  'back.background': '.back',
  'left.background': '.left',
  'right.background': '.right',
  'top.background': '.top',
  'bottom.background': '.bottom',  
}

const cssKeyValue = { 
  'position': true, 
  'left': true,
  'top': true,
  'right': true,
  'bottom': true, 
  'width': true,
  'height': true, 
  'opacity': true,
  'text-fill-color': true, 
  'text-stroke-color': true, 
  'text-stroke-width': true, 
  'background-clip': true,
  'clip-path': true, 
  'animation': true,
  'transition': true,
  'transform': true, 
  'transform-origin': true, 
  'transform-style': true, 
  'perspective': true, 
  'perspective-origin': true,
  'offset-path': true,
}

const nestedCssKeyValue = {
  'filter': true,
  'mix-blend-mode': true,
  'background-image': true, 
  'border-radius': true,
  'border': true 
}

export class CubeLayer extends Component {

  static getIcon () {
    return icon.cube;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'cube',
      name: "New Cube",
      'transform-style':'preserve-3d',
      'backface-visibility': 'visible',      
      rate: Length.number(1),      
      border: 'border:1px solid black',
      ...obj
    }); 
  }

  getProps() {
    var rate = this.json.rate.value; 
    return [
      {
        key: `rate`, editor: 'NumberRangeEditor', 
        editorOptions: {
          label: `radius`,
          min: 0,
          max: 10,
          step: 0.1 
        }, 
        refresh: true, 
        defaultValue: rate 
      },   
      {
        key: `backface-visibility`, editor: 'SelectIconEditor', 
        editorOptions: {
          label: 'visibility',
          options: 'visible,hidden'
        }, 
        refresh: true, 
        defaultValue: this.json['backface-visibility'] 
      },                  
      'Background Color',
      ...faceKeys.map(key => {
        return       {
          key: `${key}.color`, editor: 'ColorViewEditor', 
          editorOptions: {
            label: key,
            params: `${key}.color`
          }, 
          defaultValue: 'rgba(0, 0, 0, 1)' 
        }
      }),      
      'Background Image',
      ...faceKeys.map(key => {
        return       {
          key: `${key}.background`, 
          editor: 'BackgroundImageEditor', 
          editorOptions: {
            title: key,
          }, 
          defaultValue: '' 
        }
      })  
    ]
  }

  setCustomKeyframes (keyframes, customProperty) {


    if (customProperty.property.includes('.color')) {
      keyframes.push({ 
        selector: `[data-id="${this.json.id}"] ${customSelectorName[customProperty.property]}`,
        properties: [{
        ...customProperty,
        'property': 'background-color',
      }] } )
    }

    if (customProperty.property.includes('.background')) {
      keyframes.push({ 
        selector: `[data-id="${this.json.id}"] ${customSelectorName[customProperty.property]}`,
        properties: [{
        ...customProperty,
        'property': 'background-image', 
      }] } )
    }    

  }

  convert (json) {
    json = super.convert(json);

    json.rate = Length.parse(json.rate);
    return json; 
  }  

  toCloneObject() {

    var obj = {}
    faceKeys.forEach(key => {
      obj[`${key}.color`] = this.json[`${key}.color`]
      obj[`${key}.background`] = this.json[`${key}.background`]
    })

    return {
      ...super.toCloneObject(),
      rate: this.json.rate.clone(),
      ...obj
    }
  }

  enableHasChildren() {
    return false; 
  }


  getDefaultTitle() {
    return "Cube";
  }

  getIcon() {
    return icon.cube;
  }


  toDefaultCSS() {
    var obj = {}

    if (this.json.x)  obj.left = this.json.x ;
    if (this.json.y)  obj.top = this.json.y ;    

    obj.visibility = (this.json.visible) ? 'visible' : 'hidden';    

    return {
      ...obj,
      ...this.toKeyListCSS(
        'position', 'right','bottom', 'width','height', 
        'transform-origin', 'transform', 'transform-style', 'perspective', 'perspective-origin',
        // 'filter',
      )
    }

  }  

  toCSS() {

    return {
      ...this.toVariableCSS(),
      ...this.toDefaultCSS(),
      ...this.toWebkitCSS(),      
      ...this.toBoxModelCSS(),
      // ...this.toTransformCSS(),      
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS(),
      ...this.toLayoutItemCSS(),
    };
  }

  toNestedCSS() {
    var json = this.json; 

    var rate = json.rate.value; 
    var width = json.width; 
    var height = json.height; 
    var halfWidth = width.value/2
    var halfHeight = height.value/2
    var backfaceVisibility = json['backface-visibility']
    var css = {
      ...this.toKeyListCSS(
        'filter', 'mix-blend-mode', 'border-radius', 'background-color', 'opacity', 'color'
      ),      
      ...this.toClipPathCSS(),
      ...this.toBackgroundImageCSS(),
      ...this.toBorderCSS()
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
          ${json['front.color'] ? `background-color: ${json['front.color']};`: ''}
          ${json['front.background'] ? `${json['front.background']};`: ''}

        `.trim()
      },
      {
        selector: '.back', cssText: `
          transform: rotateY(180deg) translateZ(${halfWidth * rate}px);
          width: ${width};
          height: ${height};        
          backface-visibility: ${backfaceVisibility};              
          ${json['back.color'] ? `background-color: ${json['back.color']};`: ''}                  
          ${json['back.background'] ? `${json['back.background']};`: ''}
        `.trim()
      },
      {
        selector: '.left', cssText:  `
          transform: rotateY(-90deg) translateZ(${halfWidth * rate}px);
          width: ${width};
          height: ${height};    
          backface-visibility: ${backfaceVisibility};          
          ${json['left.color'] ? `background-color: ${json['left.color']};`: ''}                          
          ${json['left.background'] ? `${json['left.background']};`: ''}
        `.trim()
      },
      {
        selector: '.right', cssText: `
          transform: rotateY(90deg) translateZ(${halfWidth * rate}px);
          width: ${width};
          height: ${height};      
          backface-visibility: ${backfaceVisibility};          
          ${json['right.color'] ? `background-color: ${json['right.color']};`: ''}                        
          ${json['right.background'] ? `${json['right.background']};`: ''}          
        `.trim()
      },
      {
        selector: '.top', cssText: `
          transform: rotateX(90deg) translateZ(${halfHeight * rate}px);
          top: ${halfHeight - halfWidth}px;
          width: ${width};
          height: ${width};
          backface-visibility: ${backfaceVisibility};          
          ${json['top.color'] ? `background-color: ${json['top.color']};`: ''}      
          ${json['top.background'] ? `${json['top.background']};`: ''}              
        `.trim()
      },
      {
        selector: '.bottom', cssText: `
          transform: rotateX(-90deg) translateZ(${halfHeight * rate}px);
          top: ${halfHeight - halfWidth}px;          
          width: ${width};
          height: ${width};    
          backface-visibility: ${backfaceVisibility};          
          ${json['bottom.color'] ? `background-color: ${json['bottom.color']};`: ''}
          ${json['bottom.background'] ? `${json['bottom.background']};`: ''}                          
        `.trim()
      }
    ]
  }

  get html () {
    var {id, itemType} = this.json;

    return /*html*/`
      <div class='element-item ${itemType}' data-id="${id}">
        ${this.toDefString}
        ${faceKeys.map(key => {
          return /*html*/`<div class='${key}'></div>`
        }).join('')}
      </div>`
  }


  get svg () {
    var x = this.json.x.value; 
    var y = this.json.y.value; 
    return this.toSVG(x, y)
  }    


  toSVG (x, y, isRoot = false) {
    var {width, height} = this.json;

    var css = this.toCSS();
    var nestedCSS = this.toNestedCSS();

    var keyCSS = {} 

    var common = nestedCSS.find(it => it.selector === 'div') || {cssText:''};
    common = common.cssText.replace(/\n/g, '');

    faceKeys.forEach(key => {
      keyCSS[key] = nestedCSS.find(it => it.selector === '.' + key) || {cssText:''};  
      keyCSS[key] = keyCSS[key].cssText.replace(/\n/g, '');
    })

    if (isRoot) {
      
      delete css.left;
      delete css.top;      
      if (css.position === 'absolute') {
        delete css.position; 
      }

      return this.wrapperRootSVG(x, y, width, height, /*html*/`
        <foreignObject ${OBJECT_TO_PROPERTY({ 
          width: width.value,
          height: height.value,
          overflow: 'visible'
        })}>
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div style="${CSS_TO_STRING(css)}">
            ${faceKeys.map(key => {
              return `<div style="${common};${keyCSS[key]}"></div>`
            }).join('')}          
          </div>   
          </div>
        </foreignObject>          

      `)

    } else {

      return /*html*/`
        ${this.toDefString}
        <foreignObject ${OBJECT_TO_PROPERTY({ 
          width: width.value,
          height: height.value,
          overflow: 'visible'
        })}>
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div style="${CSS_TO_STRING(css)}">
              ${faceKeys.map(key => {
                return `<div style="${common};${keyCSS[key]}"></div>`
              }).join('')}          
            </div>   
          </div>
        </foreignObject>          
      `
    }

  }     

} 