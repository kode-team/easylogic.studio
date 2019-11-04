
import { Length } from "../unit/Length";
import { Display } from "../css-property/Display";
import { GroupItem } from "./GroupItem";
import {
  keyEach,
  combineKeyArray,
  isUndefined,
  isNotUndefined,
  CSS_TO_STRING,
  STRING_TO_CSS,
  clone,
  OBJECT_TO_PROPERTY,
  OBJECT_TO_CLASS
} from "../../util/functions/func";
import { Animation } from "../css-property/Animation";
import { Transition } from "../css-property/Transition";
import { Selector } from "../css-property/Selector";

import { ClipPath } from "../css-property/ClipPath";
import Dom from "../../util/Dom";

export class DomItem extends GroupItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      'position': 'absolute',
      'x': Length.px(0),
      'y': Length.px(0),
      'right': '',
      'bottom': '',
      'width': Length.px(300),
      'height': Length.px(300),
      'rootVariable': '',
      'variable': '',
      'transform': '',
      'filter': '',
      'backdrop-filter': '',
      'background-color': '',      
      'background-clip': '',
      'background-image': '',      
      'border': '',
      'border-radius': '',      
      'box-shadow': '',
      'text-shadow': '',
      'text-clip': '',      
      'clip-path': '',
      'color': "black",
      'font-size': Length.px(13),
      'font-stretch': '',
      'line-height': '',
      'text-align': '',
      'text-transform': '',
      'text-decoration': '',
      'letter-spacing': '', 
      'word-spacing': '', 
      'text-indent': '',      
      'perspective-origin': '',
      'transform-origin': '',
      'transform-style': '',
      'perspective': '',
      'mix-blend-mode': '',
      'opacity': '',
      'rotate': '',    
      'text-fill-color': '',
      'text-stroke-color': '',
      'text-stroke-width': '',  
      'offset-path': '',
      'offset-distance': '',
      // border: {},
      outline: {},
      // borderRadius: {},
      // borderImage: new BorderImage(),
      // applyBorderImage: false,
      animations: [],
      transitions: [],
      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      // keyframes: [],
      selectors: [],
      svg: [],
      // display: Display.parse({ display: "block" }),      
      ...obj
    });
  }

  toCloneObject() {

    var json = this.json; 

    return {
      ...super.toCloneObject(),
      'position': json.position,
      'right': json.right + '',
      'bottom': json.bottom + '',
      'rootVariable': json.rootVariable,
      'variable': json.variable,
      'transform': json.transform,
      'filter': json.filter,
      'backdrop-filter': json['backdrop-filter'],
      'background-color': json['background-color'],      
      'background-image': json['background-image'],      
      'text-clip': json['text-clip'],
      'border-radius': json['border-radius'],      
      'border': json['border'],
      'box-shadow': json['box-shadow'],
      'text-shadow': json['text-shadow'],
      'clip-path': json['clip-path'],
      'color': json.color,
      'font-size': json['font-size'] + "",
      'font-stretch': json['font-stretch'] + "",
      'line-height': json['line-height'] + "",
      'text-align': json['text-align'] + "",
      'text-transform': json['text-transform'] + "",
      'text-decoration': json['text-decoration'] + "",
      'letter-spacing': json['letter-spacing'] + "",
      'word-spacing': json['word-spacing'] + "",
      'text-indent': json['text-indent'] + "",      
      'perspective-origin': json['perspective-origin'],
      'transform-origin': json['transform-origin'],
      'transform-style': json['transform-style'],      
      'perspective': json.perspective + "",
      'mix-blend-mode': json['mix-blend-mode'],
      'opacity': json.opacity + "",
      'rotate': json.rotate + "",
      outline: clone(json.outline),

      animations: json.animations.map(animation => animation.clone()),
      transitions: json.transitions.map(transition => transition.clone()),
      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      // keyframes: json.keyframes.map(keyframe => keyframe.clone()),
      selectors: json.selectors.map(selector => selector.clone()),
      svg: json.svg.map(svg => svg.clone())
    }
  }

  convert(json) {
    json = super.convert(json);

    return json;
  }

  addAnimation(animation) {
    this.json.animations.push(animation);
    return animation;
  }  

  addTransition(transition) {
    this.json.transitions.push(transition);
    return transition;
  }    

  addSelector(selector) {
    this.json.selectors.push(selector);
    return selector;
  }      

  createAnimation(data = {}) {
    return this.addAnimation(
      new Animation({
        checked: true,
        ...data
      })
    );
  }  
  

  createSelector(data = {}) {
    return this.addSelector(
      new Selector({
        checked: true,
        ...data
      })
    );
  }    

  createTransition(data = {}) {
    return this.addTransition(
      new Transition({
        checked: true,
        ...data
      })
    );
  }  

  removePropertyList(arr, removeIndex) {
    arr.splice(removeIndex, 1);
  }

  removeAnimation(removeIndex) {
    this.removePropertyList(this.json.animations, removeIndex);
  }  

  
  removeSelector(removeIndex) {
    this.removePropertyList(this.json.selectors, removeIndex);
  }    

  removeTransition(removeIndex) {
    this.removePropertyList(this.json.transitions, removeIndex);
  }  

  enableHasChildren() {
    return true; 
  }

  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  
  sortAnimation(startIndex, targetIndex) {
    this.sortItem(this.json.animations, startIndex, targetIndex);
  }  

  sortTransition(startIndex, targetIndex) {
    this.sortItem(this.json.transitions, startIndex, targetIndex);
  }  

  
  updateAnimation(index, data = {}) {
    this.json.animations[+index].reset(data);
  }  

  updateTransition(index, data = {}) {
    this.json.transitions[+index].reset(data);
  }    


  updateSelector(index, data = {}) {
    this.json.selectors[+index].reset(data);
  }        

  setSize(data) {
    this.reset(data);
  }

  // 현재 선택된 border 의 속성을 지정한다.
  // type 에 따라 다른데
  // type is all 일 때, 나머지 속성 필드 값은 모두 지운다.
  // type is not all 일 때는 해당 속성만 설정하고 all 값이 존재하면 지운다.
  setBorder(type, data = undefined) {
    var border = this.json.border;
    if (type === "all") {
      if (data) {
        this.json.border = { all: data };
      } else {
        ["top", "right", "bottom", "left"].forEach(type => {
          delete this.json.border[type];
        });
      }
    } else {
      if (border.all && isUndefined(data)) {
        var newObject = { ...border.all };
        border.top = { ...newObject };
        border.bottom = { ...newObject };
        border.left = { ...newObject };
        border.right = { ...newObject };
      }

      if (border.all) {
        delete border.all;
      }

      if (data) {
        this.json.border[type] = data;
      }
    }
  }

  getBorder (type) {
    return this.json.border[type] || {}
  }

  setOutline (obj) {
    this.json.outline = { 
      ...this.json.outline, 
      ...obj 
    }
  }

  setBorderRadius(type, data) {
    this.json.borderRadius = data;
  }

  traverse(item, results, hasLayoutItem) {
    // var parentItemType = item.parent().itemType;
    if (item.isAttribute()) return;
    // if (parentItemType == 'layer') return;
    if (!hasLayoutItem && item.isLayoutItem() && !item.isRootItem()) return;

    results.push(item);

    item.children.forEach(child => {
      this.traverse(child, results);
    });
  }

  tree(hasLayoutItem) {
    var results = [];

    this.children.forEach(item => {
      this.traverse(item, results, hasLayoutItem);
    });

    return results;
  }

  toPropertyCSS(list, isExport = false) {
    var results = {};
    list.forEach(item => {
      keyEach(item.toCSS(isExport), (key, value) => {
        if (!results[key]) results[key] = [];
        results[key].push(value);
      });
    });

    return combineKeyArray(results);
  }

  toStringPropertyCSS (field) {
    return STRING_TO_CSS(this.json[field]);
  }

  toBackgroundImageCSS(isExport = false) {
    return this.toStringPropertyCSS('background-image')
  }

  toBorderCSS() {
    return this.toStringPropertyCSS('border')
  }

  toOutlineCSS () {
    var outline = this.json.outline;

    if (!outline) return {} ;

    if (Object.keys(outline).length === 0) {
      return {}
    }

    return {
      outline: `${outline.color} ${outline.style} ${outline.width}`
    }
  }

  toKeyCSS (key) {
    if (!this.json[key]) return {} 
    return {
      [key] : this.json[key]
    };
  }
  
  // export animation keyframe
  toAnimationKeyframes (properties) {
    return [
      { selector: `[data-id="${this.json.id}"]`, properties }
    ] 
  }

  toAnimationCSS() {
    return this.toPropertyCSS(this.json.animations);
  }

  toTransitionCSS() {
    return this.toPropertyCSS(this.json.transitions);
  }  

  toString() {
    return CSS_TO_STRING(this.toCSS());
  }

  toExport() {
    return CSS_TO_STRING(this.toCSS(true));
  }

  toExportSVGCode () {
    return ''; 
  }

  toBoxModelCSS() {
    var json = this.json;
    var obj = {};

    if (json['margin-top']) obj["margin-top"] = json['margin-top'];
    if (json['margin-bottom']) obj["margin-bottom"] = json['margin-bottom'];
    if (json['margin-left']) obj["margin-left"] = json['margin-left'];
    if (json['margin-right']) obj["margin-right"] = json['margin-right'];


    if (json['padding-top']) obj["padding-top"] = json['padding-top'];
    if (json['padding-bottom']) obj["padding-bottom"] = json['padding-bottom'];
    if (json['padding-left']) obj["padding-left"] = json['padding-left'];
    if (json['padding-right']) obj["padding-right"] = json['padding-right'];


    return obj;
  }

  toKeyListCSS (...args) {
    var json = this.json;
    var obj = {};

    args.forEach( it => {
      if (isNotUndefined(json[it]) && json[it] !== '') {
        obj[it] = json[it] + ''
      }
    })

    return obj;
  }

  toFontCSS() {
    return this.toKeyListCSS(
    
    )
  }

  toDefaultCSS(isExport = false) {

    var obj = {}

    if (this.isAbsolute) {
      if (this.json.x)  obj.left = this.json.x ;
      if (this.json.y)  obj.top = this.json.y ;
    }

    obj.visibility = (this.json.visible) ? 'visible' : 'hidden';

    return {
      ...obj,
      ...this.toKeyListCSS(
        
        'position', 'right','bottom', 'width','height', 'overflow',

        'background-color', 'color',  'opacity', 'mix-blend-mode',

        'transform-origin', 'transform', 'transform-style', 'perspective', 'perspective-origin',

        'font-size', 'font-stretch', 'line-height', 'font-weight', 'font-family', 'font-style',
        'text-align', 'text-transform', 'text-decoration',
        'letter-spacing', 'word-spacing', 'text-indent',

        'border-radius',

        'filter', 'backdrop-filter', 'box-shadow', 'text-shadow',

        'offset-path'
      )
    }

  }

  toDefaultSVGCSS(isExport = false) {

    var obj = {
      overflow: 'visible',
    }

    return {
      ...obj,
      ...this.toKeyListCSS(

        'transform', 

        'font-size', 'font-stretch', 'line-height', 'font-weight', 'font-family', 'font-style',
        'text-align', 'text-transform', 'text-decoration',
        'letter-spacing', 'word-spacing', 'text-indent'
      )
    }

  }

  // toTransformCSS() {
  //   return this.toKeyListCSS('transform')
  // }

  toVariableCSS () {
    var obj = {}
    this.json.variable.split(';').filter(it => it.trim()).forEach(it => {
      var [key, value] = it.split(':')

      obj[`--${key}`] = value; 
    })
    return obj;
  }

  toRootVariableCSS () {
    var obj = {}
    this.json.rootVariable.split(';').filter(it => it.trim()).forEach(it => {
      var [key, value] = it.split(':')

      obj[`--${key}`] = value; 
    })

    return obj;
  }

  toRootVariableString () {
    return CSS_TO_STRING(this.toRootVariableCSS())
  }

  // convert to only webket css property 
  toWebkitCSS() {
    var obj = this.toKeyListCSS(
      'text-fill-color', 
      'text-stroke-color', 
      'text-stroke-width', 
      'background-clip'
    )

    var results = {}
    keyEach(obj, (key, value) => {
      results[`-webkit-${key}`] = value; 
    })

    return results;
  }


  // convert to only webket css property 
  toTextClipCSS() {

    var results = {} 

    if (this.json['text-clip'] === 'text') {
      results['-webkit-background-clip'] = 'text'
      results['-webkit-text-fill-color'] = 'transparent';   
      results['color'] = 'transparent';
    }

    return results;
  }  

  toClipPathCSS () {
    var str = this.json['clip-path']
    var obj = ClipPath.parseStyle(str)

    switch (obj.type) {
    case 'path': 
    case 'svg': 
      str = `url(#${this.clipPathId})`
      break; 
    }

    return {
      'clip-path': str
    }
  }

  toCSS(isExport = false) {

    return {
      ...this.toVariableCSS(),
      ...this.toDefaultCSS(isExport),
      ...this.toClipPathCSS(),
      ...this.toWebkitCSS(), 
      ...this.toTextClipCSS(),      
      ...this.toBoxModelCSS(),
      ...this.toBorderCSS(),
      ...this.toOutlineCSS(),      
      // ...this.toTransformCSS(),      
      // ...this.toBorderImageCSS(),
      ...this.toBackgroundImageCSS(isExport),
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS()
    };
  }

  toSVGCSS(isExport = false) {

    return {
      ...this.toVariableCSS(),
      ...this.toDefaultSVGCSS(isExport),
      ...this.toClipPathCSS(),
      ...this.toWebkitCSS(), 
      ...this.toTextClipCSS(),      
      ...this.toBoxModelCSS(),
      ...this.toBorderCSS(),
      ...this.toOutlineCSS(),      
      // ...this.toTransformCSS(),      
      // ...this.toBorderImageCSS(),
      ...this.toBackgroundImageCSS(isExport),
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS()
    };
  }

  toEmbedCSS(isExport = false) {
    return {
      ...this.toVariableCSS(),      
      ...this.toDefaultCSS(),
      ...this.toClipPathCSS(),
      ...this.toWebkitCSS(),
      ...this.toTextClipCSS(),
      ...this.toBoxModelCSS(),
      ...this.toBorderCSS(),
      ...this.toOutlineCSS(),
      // ...this.toTransformCSS(),
      // ...this.toBorderImageCSS(),
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS(),      
      ...this.toBackgroundImageCSS(isExport)
    };
  }
  
 
  toSelectorString (prefix = '') {
    return this.json.selectors
              .map(selector => selector.toString(prefix))
              .join('\n\n')
  }


  toNestedCSS($prefix) {
    return []
  }

  toNestedBoundCSS($prefix) {
    return []
  }  

  generateEmbed () {
    return {
      css: this.toEmbedCSS(), 
      selectorString: this.toSelectorString()
    }
  }

  generateView (prefix = '', appendCSS = '') {

    //1. 원본 객체의 css 를 생성 
    //2. 원본이 하나의 객체가 아니라 복합 객체일때 중첩 CSS 를 자체 정의해서 생성 
    //3. 이외에 selector 로 생성할 수 있는 css 를 생성 (:hover, :active 등등 )
    var cssString = `
${prefix} {  /* ${this.json.itemType} */
    ${CSS_TO_STRING(this.toCSS(), '\n    ')}; 
    ${appendCSS}
}
${this.toNestedCSS().map(it => {
  return `${prefix} ${it.selector} { 
      ${it.cssText ? it.cssText : CSS_TO_STRING(it.css || {}, '\n\t\t')}; 
  }`
}).join('\n')}
${this.toSelectorString(prefix)}
`  
    return cssString;
  }


  generateViewBoundCSS (prefix = '', appendCSS = '') {
    var cssString = `
${prefix} {  /* ${this.json.itemType} */
    ${CSS_TO_STRING(this.toBoundCSS(), '\n')}; 
}


${this.toNestedBoundCSS().map(it => {
  return `${prefix} ${it.selector} { 
      ${it.cssText ? it.cssText : CSS_TO_STRING(it.css || {}, '\n\t\t')}; 
  }`
}).join('\n')}

`  
    return cssString;
  }


  get html () {
    var {elementType, id, name, layers, itemType} = this.json;

    const tagName = elementType || 'div'

    return /*html*/`<${tagName} class="${OBJECT_TO_CLASS({
      'element-item': true,
      [itemType]: true 
    })}" ${OBJECT_TO_PROPERTY({
      'data-id': id,
      'data-title': name 
    })}>
    ${this.toDefString}
  ${layers.map(it => it.html).join('\n\t')}
</${tagName}>`
  }

  generateSVG (isRoot = false) {
    if (isRoot) {
      var width = this.json.width.value;
      var height = this.json.height.value; 
      return /*html*/`
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">
  ${this.rootSVG}
</svg>`
    }

    return this.svg; 
  }

  get svg () {
    var {x, y} = this.json;    
    x = x.value;
    y = y.value;    
    return this.toSVG(x, y)
  }  

  toSVG (x = 0, y = 0) {
    var {layers, width, height, elementType} = this.json;
    var tagName = elementType || 'div'
    var css = this.toCSS();

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
        height: height.value
      })}>
        <div xmlns="http://www.w3.org/1999/xhtml">
          <${tagName} style="${CSS_TO_STRING(css)}" ></${tagName}>
        </div>
      </foreignObject>    
    </g>
    ${layers.map(it => it.svg).join('\n\t')}
    `
  }

  get rootSVG () {
    return this.toSVG()
  }  


  toBound () {
    var obj = {
      x: this.json.x ? this.json.x.clone() : Length.px(0),
      y: this.json.y ? this.json.y.clone() : Length.px(0),
      width: this.json.width.clone(),
      height: this.json.height.clone(),
    }

    obj.x2 = Length.px(obj.x.value + obj.width.value);
    obj.y2 = Length.px(obj.y.value + obj.height.value);

    return obj
  }




  updateFunction (currentElement, isChangeFragment = true) {

    if (isChangeFragment) {
      var $svg = currentElement.$(`[data-id="${this.innerSVGId}"]`);  

      if ($svg) {
        var $defs = $svg.$('defs');
        $defs.html(this.toDefInnerString)          
      } else {
        var a = Dom.createByHTML(this.toDefString);
        if (a) {
          currentElement.prepend(a);
        }

      }

    }

  }    

  get toDefInnerString () {
    return /*html*/`${this.toClipPath}`
  }

  get toClipPath() {

    var obj = ClipPath.parseStyle(this.json['clip-path']);
    var value = obj.value; 
    switch (obj.type) {
    case 'path':
      return /*html*/`<clipPath id="${this.clipPathId}"><path d="${value}" /></clipPath>`
    case 'svg': 
      return /*html*/`<clipPath id="${this.clipPathId}">${value}</clipPath>`
    }

    return ``
  }

  get innerSVGId() {
    return this.json.id + 'inner-svg'
  }

  get toDefString () {
    var str = this.toDefInnerString.trim()

    return str && /*html*/`
    <svg class='inner-svg-element' data-id="${this.innerSVGId}" width="0" height="0">
      <defs>
        ${str}
      </defs>
    </svg>
    `
  }

  get clipPathId () {
    return this.json.id + 'clip-path'
  }  
}
