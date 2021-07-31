import { CSS_TO_STRING, OBJECT_TO_PROPERTY, repeat } from "el/sapa/functions/func";
import { getXYInCircle, getDist } from "el/utils/math";
import { Length } from "el/editor/unit/Length";
import icon from "el/editor/icon/icon";
import { Component } from "el/editor/items/Component";

const customKeyValue = {
  'count': true, 
  'rate': true, 
  'face': true 
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
  'background-color': true, 
  'border-radius': true,
  'border': true 
}

export class CylinderLayer extends Component {

  static getIcon () {
    return icon.cylinder;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'cylinder',
      name: "New Cylinder",
      'transform-style':'preserve-3d',
      'backface-visibility': 'visible',
      transform: 'rotateX(10deg) rotateY(30deg)',
      count: Length.number(40),
      rate: Length.number(1),
      border: 'border-top: 1px solid black;border-bottom: 1px solid black;',
      ...obj
    }); 
  }

  getProps() {
    var count = this.json.count.value; 
    var rate = this.json.rate.value; 


    return [
      'Side',
      {
        key: `count`, editor: 'NumberRangeEditor', 
        editorOptions: {
          label: `Count`,
          min: 3,
          max: 100,
          step: 1 
        }, 
        refresh: true, 
        defaultValue: count 
      },
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
      'Color',
      ...repeat(count).map((it, index) => {
        return {
          key: `face.${index}.color`, editor: 'ColorViewEditor', 
          editorOptions: {
            label: `face ${index}`,
            params: `face.${index}.color`
          }, 
          defaultValue: 'rgba(0, 0, 0, 1)' 
        }
      }),
      'Background',
      ...repeat(count).map((it, index) => {
        return {
          key: `face.${index}.background`, editor: 'BackgroundImageEditor', 
          editorOptions: {
            title: `face ${index}`,
          }, 
          defaultValue: '' 
        }
      })  
    ]
  }

  setCustomKeyframes (keyframes, customProperty) {


    if (customProperty.property === 'rate') {

      var {width} = this.json;

      var count = this.json.count.value; 
      var w = width.value;
      var r = w/2
      var angle = 360 / count; 

      var faceList = repeat(count).map((it, index) => {

        var rotateY = index * angle; 
  
        return { 
          selector: `[data-id="${this.json.id}"] .face[data-index="${index}"]`,
          properties: [{
            keyframes: customProperty.keyframes.map(({time, value, timing}) => {            
              return {time, value: `rotateY(${rotateY}deg) translateZ(${r * value}px)`, timing} 
            }), 
            'property': 'transform',  // 흠 하나씩 나열해야할 듯 
          }] 
        }

      })

      keyframes.push.apply(keyframes, faceList)      
    }


    if (customProperty.property.includes('.color')) {

      var [_, index, _] = customProperty.property.split('.')

      keyframes.push({ 
        selector: `[data-id="${this.json.id}"] .face[data-index="${index}"]`,
        properties: [{
        ...customProperty,
        'property': 'background-color',  // 흠 하나씩 나열해야할 듯 
      }] } )
    }

    if (customProperty.property.includes('.background')) {

      var [_, index, _] = customProperty.property.split('.')

      keyframes.push({ 
        selector: `[data-id="${this.json.id}"] .face[data-index="${index}"]`,
        properties: [{
        ...customProperty,
        'property': 'background-image',  // 흠 하나씩 나열해야할 듯 
      }] } )
    }    

  }

  /**
   * @deprecated 
   * 
   */   
  toAnimationKeyframes (properties) {
   
    var customProperties = []
    var cssProperties = []
    var nestedProperties = []

    properties.forEach(p => {

      if (p.property.includes('face') || customKeyValue[p.property] ) {
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

  convert (json) {
    json = super.convert(json);

    json.count = Length.parse(json.count);
    json.rate = Length.parse(json.rate);
    return json; 
  }

  toCloneObject() {

    var obj = {}
    var count =  this.json.count.value;

    repeat(count).forEach((it, index) => {
      obj[`face.${index}.color`] = this.json[`face.${index}.color`]
      obj[`face.${index}.background`] = this.json[`face.${index}.background`]
    })

    return {
      ...super.toCloneObject(),
      count:  this.json.count.clone(), 
      rate:  this.json.rate.clone(), 
      ...obj   
    }
  }

  enableHasChildren() {
    return false; 
  }


  getDefaultTitle() {
    return "Cylinder";
  }

  getIcon() {
    return icon.cylinder;
  }  


  toDefaultCSS() {
    var obj = {}

    if (this.json.x)  obj.left = this.json.x ;
    if (this.json.y)  obj.top = this.json.y ;    

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
      ...this.toTransitionCSS()
    };
  }

  toNestedCSS() {
    var json = this.json; 

    var count = json.count.value;
    var width = json.width; 
    var backfaceVisibility = json['backface-visibility']
    var rate = json.rate.value; 
    var {angle, r, faceWidth} = this.cylinderInfo;

    var css = {
      ...this.toKeyListCSS(
        'filter', 'mix-blend-mode', 'border-radius',  'opacity', 'background-color',
      ),      
      ...this.toBackgroundImageCSS(),
      ...this.toBorderCSS(),
      ...this.toClipPathCSS()
    }

    var faceList = repeat(count).map((it, index) => {

      var rotateY = index * angle; 
      var colorKey  = `face.${index}.color`
      var backgroundKey  = `face.${index}.background`

      return  {
        selector: `.face[data-index="${index}"]`, cssText: `
          transform:rotateY(${rotateY}deg) translateZ(${r * rate}px);
          ${json[colorKey] ? `background-color: ${json[colorKey]};` : ''}
          ${json[backgroundKey] ? `${json[backgroundKey]};` : '' }
        `.trim()
      }
    })


    return [
      { selector: '.face', cssText: `
          position: absolute;
          left: ${width.value/2 - faceWidth/2}px;
          top: 0px;
          bottom: 0px;
          right: 0px;
          width: ${faceWidth}px;
          backface-visibility: ${backfaceVisibility};
          opacity: 1;
          pointer-events: none;
          ${CSS_TO_STRING(css)}
        `.trim()
      },
      ...faceList
      
    ]
  }

  get cylinderInfo () {
    var {width} = this.json;

    var w = width.value;
    var h = w; 
    var r = w/2
    var yr = h/2;
    
    var center = {x: r, y: yr }
    var polygon = [] 
    var count = this.json.count.value; 
    if (count  < 3) count = 3; 

    var angle = 360 / count; 
    
    for(var  i = 0; i < 360; i+=angle) {
      polygon.push(getXYInCircle(i, r, center.x, center.y))
    }

    var faceWidth = getDist(polygon[0].x,polygon[0].y,polygon[1].x,polygon[1].y)
    var centerR = {
      x: (polygon[0].x + polygon[1].x)/2,
      y: (polygon[0].y + polygon[1].y)/2
    }
    var r = getDist(centerR.x, centerR.y, center.x, center.y)

    return {
      polygon,
      faceWidth,
      angle,
      r
    }
  }

  updateFunction (currentElement) {

    super.updateFunction(currentElement);


    var count = +currentElement.attr('data-count');
    if (count !== this.json.count.value) {
      currentElement.$$('.face').forEach(it => it.remove())

      var string = repeat(this.json.count.value).map((it, index) => {
        return /*html*/`<div class='face' data-index="${index}"></div>`
      }).join('')

      currentElement.appendHTML(string);
      currentElement.attr('data-count', this.json.count);
    }

  }    

  get html () {
    var {id, itemType} = this.json;
    var count = this.json.count.value; 

    return /*html*/`
      <div class='element-item ${itemType}' data-id="${id}" data-count="${count}">
        ${this.toDefString}
        ${repeat(count).map((it, index) => {
          return /*html*/`<div class='face' data-index="${index}"></div>`
        }).join('')}
      </div>`
  }


  get svg () {
    var {width, height, x, y} = this.json;
    x = x.value;
    y = y.value;
    var css = this.toCSS();
    var nestedCSS = this.toNestedCSS();
    var count = this.json.count.value; 

    var common = nestedCSS.find(it => it.selector === '.face') || {cssText: ''};
    common = common.cssText.replace(/\n/g, '') 

    var cssTextList = repeat(count).map((it, index) => {
      return nestedCSS[index+1].cssText.replace(/\n/g, '');
    })

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
            ${repeat(count).map((it, index) => {
              return /*html*/`<div class='face' data-index="${index}" style='${common};${cssTextList[index]};'></div>`
            }).join('')}
          </div>
        </div>
      </foreignObject>    
    </g>
`
  }    

} 