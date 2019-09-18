import { CSS_TO_STRING, isObject } from "../../../util/functions/func";
import { Component } from "../Component";

const customKeyValue = {
  'front.color': true,
  'back.color': true,
  'left.color': true,
  'right.color': true,
  'top.color': true,
  'bottom.color': true,
}

const customSelectorName = {
  'front.color': '.front',
  'back.color': '.back',
  'left.color': '.left',
  'right.color': '.right',
  'top.color': '.top',
  'bottom.color': '.bottom',
}

const cssKeyValue = { 
  'position': true, 
  'right': true,
  'bottom': true, 
  'width': true,
  'height': true, 
  'opacity': true,
  'text-fill-color': true, 
  'text-stroke-color': true, 
  'text-stroke-width': true, 
  'background-clip': true,
  'animation': true,
  'transition': true,
  'transform': true, 
  'transform-origin': true, 
  'transform-style': true, 
  'perspective': true, 
  'perspective-origin': true,
}

const nestedCssKeyValue = {
  'filter': true,
  'mix-blend-mode': true,
  'background-image': true, 
  'border-radius': true,
  'border': true 
}

export class CubeLayer extends Component {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'cube',
      name: "New Cube",
      'transform-style':'preserve-3d',
      transform: 'rotateX(10deg) rotateY(30deg)',
      'front.color': '',
      ...obj
    }); 
  }

  getProps() {
    return [
      'Colors',
      {
        key: 'front.color', editor: 'ColorViewEditor', 
        editorOptions: {
          label: 'front', 
          params: 'front.color'
        }, 
        defaultValue: 'rgba(0, 0, 0, 1)' 
      },
      {
        key: 'back.color', 
        editor: 'ColorViewEditor', 
        editorOptions: {
          label: 'back', 
          params: 'back.color'
        }, 
        defaultValue: 'rgba(0, 0, 0, 1)' 
      },
      {
        key: 'left.color', 
        editor: 'ColorViewEditor', 
        editorOptions: {
          label: 'left', 
          params: 'left.color'
        }, 
        defaultValue: 'rgba(0, 0, 0, 1)' 
      },
      {
        key: 'right.color', 
        editor: 'ColorViewEditor', 
        editorOptions: {
          label: 'right',
          params: 'right.color'
        }, 
        defaultValue: 'rgba(0, 0, 0, 1)' 
      },
      {
        key: 'top.color', 
        editor: 'ColorViewEditor', 
        editorOptions: {
          label: 'top', 
          params: 'top.color'
        }, 
        defaultValue: 'rgba(0, 0, 0, 1)' 
      },  
      {
        key: 'bottom.color', 
        editor: 'ColorViewEditor', 
        editorOptions: {
          label: 'bottom', 
          params: 'front.color'
        }, 
        defaultValue: 'rgba(0, 0, 0, 1)' 
      }
    ]
  }

  setCustomKeyframes (keyframes, customProperty) {


    if ([
      'front.color', 
      'back.color', 
      'left.color', 
      'right.color', 
      'top.color', 
      'bottom.color'
    ].includes(customProperty.property)) {
      keyframes.push({ 
        selector: `[data-id="${this.json.id}"] ${customSelectorName[customProperty.property]}`,
        properties: [{
        ...customProperty,
        'property': 'background-color',  // 흠 하나씩 나열해야할 듯 
      }] } )
    }

  }

  toAnimationKeyframes (properties) {
   
    var customProperties = []
    var cssProperties = []
    var nestedProperties = []

    properties.forEach(p => {
      if (customKeyValue[p.property]) {
        customProperties.push(p);
      } else if (cssKeyValue[p.property]) {
        cssProperties.push(p);
      } else if (nestedCssKeyValue[p.property]) {
        nestedProperties.push(p);
      }
    })

    var keyframes = [] 

    if (cssProperties.length) {
      keyframes.push({ selector: `[data-id="${this.json.id}"]`, properties: cssProperties })
    }

    if (nestedProperties.length) {
      keyframes.push({ selector: `[data-id="${this.json.id}"] div`, properties: nestedProperties  })
    }

    if (customProperties.length) {
      customProperties.forEach(c => {
        this.setCustomKeyframes(keyframes, c);
      })  
    }

    return keyframes
  }    

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      'front.color': this.json['front.color'],
      'back.color': this.json['back.color'],
      'left.color': this.json['left.color'],
      'right.color': this.json['right.color'],
      'top.color': this.json['top.color'],
      'bottom.color': this.json['bottom.color'],
    }
  }

  enableHasChildren() {
    return true; 
  }


  getDefaultTitle() {
    return "Cube";
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
        'filter', 'mix-blend-mode', 'border-radius'
      ),      
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
          background-color: ${json['background-color']};
          border: 1px solid ${borderColor};
          ${CSS_TO_STRING(css)}
        `
      },
      {
        selector: '.front', cssText: `
          transform:rotateY(0deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};     
          ${json['front.color'] ? `background-color: ${json['front.color']}`: ''}
        `
      },
      {
        selector: '.back', cssText: `
          transform: rotateY(180deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};            
          ${json['back.color'] ? `background-color: ${json['back.color']}`: ''}                  
        `
      },
      {
        selector: '.left', cssText:  `
          transform: rotateY(-90deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};    
          ${json['left.color'] ? `background-color: ${json['left.color']}`: ''}                          
        `
      },
      {
        selector: '.right', cssText: `
          transform: rotateY(90deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};      
          ${json['right.color'] ? `background-color: ${json['right.color']}`: ''}                        
        `
      },
      {
        selector: '.top', cssText: `
          transform: rotateX(90deg) translateZ(${halfHeight}px);
          top: ${halfHeight - halfWidth}px;
          width: ${width};
          height: ${width};
          ${json['top.color'] ? `background-color: ${json['top.color']}`: ''}          
        `
      },
      {
        selector: '.bottom', cssText: `
          transform: rotateX(-90deg) translateZ(${halfHeight}px);
          top: ${halfHeight - halfWidth}px;          
          width: ${width};
          height: ${width};    
          ${json['bottom.color'] ? `background-color: ${json['bottom.color']}`: ''}                
        `
      }
    ]
  }

  get html () {
    var {id, itemType} = this.json;

    return /*html*/`<div class='element-item ${itemType}' data-id="${id}"><div class='front'></div><div class='back'></div><div class='left'></div><div class='right'></div><div class='top'></div><div class='bottom'></div></div>`
  }

}
 