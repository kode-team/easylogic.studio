import { CSS_TO_STRING, isObject, OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { Component } from "../Component";

const customKeyValue = {
  'front.color': true,
  'back.color': true,
  'left.color': true,
  'right.color': true,
  'top.color': true,
  'bottom.background': true,
  'front.background': true,
  'back.background': true,
  'left.background': true,
  'right.background': true,
  'top.background': true,
  'bottom.background': true,  
}

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
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'cube',
      name: "New Cube",
      'transform-style':'preserve-3d',
      transform: 'rotateX(10deg) rotateY(30deg)',
      'front.color': '',
      'front.background': '',
      ...obj
    }); 
  }

  getProps() {
    return [
      'Color',
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
      },
      'Background',
      {
        key: 'front.background', 
        editor: 'BackgroundImageEditor', 
        editorOptions: {
          'title': 'front'
        }, 
        defaultValue: ''
      },
      {
        key: 'back.background', 
        editor: 'BackgroundImageEditor', 
        editorOptions: {
          'title': 'back'
        },          
        defaultValue: ''
      },
      {
        key: 'left.background', 
        editor: 'BackgroundImageEditor', 
        editorOptions: {
          'title': 'left'
        },      
        defaultValue: ''
      },
      {
        key: 'right.background', 
        editor: 'BackgroundImageEditor', 
        editorOptions: {
          'title': 'right'
        },         
        defaultValue: ''
      },
      {
        key: 'top.background', 
        editor: 'BackgroundImageEditor', 
        editorOptions: {
          'title': 'top'
        }, 
        defaultValue: ''
      },  
      {
        key: 'bottom.background', 
        editor: 'BackgroundImageEditor',        
        editorOptions: {
          'title': 'bottom'
        }, 
        defaultValue: ''
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

    if ([
      'front.background', 
      'back.background', 
      'left.background', 
      'right.background', 
      'top.background', 
      'bottom.background'
    ].includes(customProperty.property)) {
      keyframes.push({ 
        selector: `[data-id="${this.json.id}"] ${customSelectorName[customProperty.property]}`,
        properties: [{
        ...customProperty,
        'property': 'background-image',  // 흠 하나씩 나열해야할 듯 
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
      'front.background': this.json['front.background'],
      'back.background': this.json['back.background'],
      'left.background': this.json['left.background'],
      'right.background': this.json['right.background'],
      'top.background': this.json['top.background'],
      'bottom.background': this.json['bottom.background'],      
    }
  }

  enableHasChildren() {
    return false; 
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
        'transform-origin', 'transform', 'transform-style', 'perspective', 'perspective-origin',
        // 'filter',
      )
    }

  }  

  toCSS(isExport = false) {

    return {
      ...this.toVariableCSS(),
      ...this.toDefaultCSS(isExport),
      ...this.toClipPathCSS(),
      ...this.toWebkitCSS(),      
      ...this.toBoxModelCSS(),
      // ...this.toTransformCSS(),      
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
        `.trim()
      },
      {
        selector: '.front', cssText: `
          transform:rotateY(0deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};     
          ${json['front.color'] ? `background-color: ${json['front.color']};`: ''}
          ${json['front.background'] ? `${json['front.background']};`: ''}

        `.trim()
      },
      {
        selector: '.back', cssText: `
          transform: rotateY(180deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};            
          ${json['back.color'] ? `background-color: ${json['back.color']};`: ''}                  
          ${json['back.background'] ? `${json['back.background']};`: ''}
        `.trim()
      },
      {
        selector: '.left', cssText:  `
          transform: rotateY(-90deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};    
          ${json['left.color'] ? `background-color: ${json['left.color']};`: ''}                          
          ${json['left.background'] ? `${json['left.background']};`: ''}
        `.trim()
      },
      {
        selector: '.right', cssText: `
          transform: rotateY(90deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};      
          ${json['right.color'] ? `background-color: ${json['right.color']};`: ''}                        
          ${json['right.background'] ? `${json['right.background']};`: ''}          
        `.trim()
      },
      {
        selector: '.top', cssText: `
          transform: rotateX(90deg) translateZ(${halfHeight}px);
          top: ${halfHeight - halfWidth}px;
          width: ${width};
          height: ${width};
          ${json['top.color'] ? `background-color: ${json['top.color']};`: ''}      
          ${json['top.background'] ? `${json['top.background']};`: ''}              
        `.trim()
      },
      {
        selector: '.bottom', cssText: `
          transform: rotateX(-90deg) translateZ(${halfHeight}px);
          top: ${halfHeight - halfWidth}px;          
          width: ${width};
          height: ${width};    
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
        <div class='front'></div>
        <div class='back'></div>
        <div class='left'></div>
        <div class='right'></div>
        <div class='top'></div>
        <div class='bottom'></div>
      </div>`
  }


  get svg () {
    var {width, height, x, y, src} = this.json;
    x = x.value;
    y = y.value;
    var css = this.toCSS();
    var nestedCSS = this.toNestedCSS();

    var common = nestedCSS.find(it => it.selector === 'div') || '';
    var front = nestedCSS.find(it => it.selector === '.front') || '';
    var back = nestedCSS.find(it => it.selector === '.back') || '';
    var right = nestedCSS.find(it => it.selector === '.right') || '';
    var left = nestedCSS.find(it => it.selector === '.left') || '';
    var top = nestedCSS.find(it => it.selector === '.top') || '';
    var bottom = nestedCSS.find(it => it.selector === '.bottom') || '';

    common = common && common.cssText.replace(/\n/g, '');
    front = front && front.cssText.replace(/\n/g, '');
    back = back && back.cssText.replace(/\n/g, '');
    right = right && right.cssText.replace(/\n/g, '');
    left = left && left.cssText.replace(/\n/g, '');
    top = top && top.cssText.replace(/\n/g, '');
    bottom = bottom && bottom.cssText.replace(/\n/g, '');

    delete css.left;
    delete css.top;
    if (css.position === 'absolute') {
      delete css.position; 
    }

    return /*html*/`
    <g transform="translate(${x}, ${y})">
    ${this.toDefString}
      <foreignObject ${OBJECT_TO_PROPERTY({ 
        width: width.value,
        height: height.value,
        overflow: 'visible'
      })}>
        <div xmlns="http://www.w3.org/1999/xhtml">
          <div style="${CSS_TO_STRING(css)}">
            <div class='front' style="${common};${front}"></div>
            <div class='back' style="${common};${back}"></div>
            <div class='left' style="${common};${left}"></div>
            <div class='right' style="${common};${right}"></div>
            <div class='top' style="${common};${top}"></div>
            <div class='bottom' style="${common};${bottom}"></div>
          </div>
        </div>
      </foreignObject>    
    </g>
`
  }    

}
 