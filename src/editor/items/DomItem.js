
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
  clone
} from "../../util/functions/func";
import { BorderImage } from "../css-property/BorderImage";
import { Animation } from "../css-property/Animation";
import { Transition } from "../css-property/Transition";
import { Keyframe } from "../css-property/Keyframe";
import { Selector } from "../css-property/Selector";
import icon from "../../csseditor/ui/icon/icon";
import Dom from "../../util/Dom";

function filterSVGClipPath (str = '', isFit = false, maxWidth, maxHeight) {
  var $div = Dom.create('div');
  var $svg = $div.html(str).$('svg');

  if (!$svg) { 
    return {
      paths: '',
      transform: ''
    } 
  }

  var paths = $svg.html();
  var width = Length.parse($svg.attr('width'))
  var height = Length.parse($svg.attr('height'))

  var transform = '' 
  if (isFit) {
    var scaleX = maxWidth.value / width.value 
    var scaleY = maxHeight.value / height.value 

    transform = `transform="scale(${scaleX} ${scaleY})"`
  }

  return { paths, transform };
}

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
      'border-radius': '',      
      'box-shadow': '',
      'text-shadow': '',
      'text-clip': '',      
      'clip-path': '',
      'color': "",
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
      border: {},
      outline: {},
      borderRadius: {},
      borderImage: new BorderImage(),
      applyBorderImage: false,
      animations: [],
      transitions: [],
      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      keyframes: [],
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
      border: clone(json.border),
      outline: clone(json.outline),
      borderRadius: clone(json.borderRadius),
      borderImage: json.borderImage.clone(),
      applyBorderImage: json.applyBorderImage,
      animations: json.animations.map(animation => animation.clone()),
      transitions: json.transitions.map(transition => transition.clone()),
      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      keyframes: json.keyframes.map(keyframe => keyframe.clone()),
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

  addKeyframe(keyframe) {
    this.json.keyframes.push(keyframe);
    return keyframe;
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

  createKeyframe(data = {}) {
    return this.addKeyframe(
      new Keyframe({
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

  removeKeyframe(removeIndex) {
    this.removePropertyList(this.json.keyframes, removeIndex);
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

  sortKeyframe(startIndex, targetIndex) {
    this.sortItem(this.json.keyframes, startIndex, targetIndex);
  }  
  
  updateAnimation(index, data = {}) {
    this.json.animations[+index].reset(data);
  }  

  updateTransition(index, data = {}) {
    this.json.transitions[+index].reset(data);
  }    


  updateKeyframe(index, data = {}) {
    this.json.keyframes[+index].reset(data);
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

  setBorderImageOffset(type, data) {
    this.json.borderImageOffset = data;
  }  

  setBorderImage(data) {
    this.json.borderImage = data;
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

  getBorderString(data) {
    return `${data.width} ${data.style} ${data.color}`;
  }

  toBorderCSS() {
    var results = {};
    var border = this.json.border;

    if (border.all) {
      results = {
        border: this.getBorderString(border.all)
      };
    } else {
      keyEach(border, (type, data) => {
        results[`border-${type}`] = this.getBorderString(data);
      });
    }

    return results;
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

  toBorderRadiusCSS() {
    return this.toStringPropertyCSS('border-radius')
  }

  toBorderImageCSS() {

    if (!this.json.borderImage) return {} 
    if (!this.json.applyBorderImage) return {} 

    return this.json.borderImage.toCSS();
  }

  toKeyCSS (key) {
    if (!this.json[key]) return {} 
    return {
      [key] : this.json[key]
    };
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

        'transform-origin', 'transform-style', 'perspective', 'perspective-origin',

        'font-size', 'font-stretch', 'line-height', 'font-weight', 'font-family', 'font-style',
        'text-align', 'text-transform', 'text-decoration',
        'letter-spacing', 'word-spacing', 'text-indent',

        'filter', 'clip-path', 'backdrop-filter', 'box-shadow', 'text-shadow',

        'offset-path'
      )
    }

  }

  toTransformCSS() {

    if (this.json.rotate && this.json.transform  &&  this.json.transform.indexOf('rotate') === -1) {
      var transform = this.json.transform;

      return {
        transform: [transform, `rotate(${this.json.rotate})` ].join(' ')
      }
    } else if (!this.json.rotate) {
      return this.toKeyListCSS('transform')
    }

    return {
      transform : `rotate(${this.json.rotate})`
    }
  }

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

  toCSS(isExport = false) {

    return {
      ...this.toVariableCSS(),
      ...this.toDefaultCSS(isExport),
      ...this.toWebkitCSS(),
      ...this.toTextClipCSS(),      
      ...this.toBoxModelCSS(),
      ...this.toBorderCSS(),
      ...this.toOutlineCSS(),      
      ...this.toTransformCSS(),      
      ...this.toBorderRadiusCSS(),
      ...this.toBorderImageCSS(),
      ...this.toBackgroundImageCSS(isExport),
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS()
    };
  }

  toEmbedCSS(isExport = false) {
    return {
      ...this.toVariableCSS(),      
      ...this.toDefaultCSS(),
      ...this.toWebkitCSS(),
      ...this.toTextClipCSS(),
      ...this.toBoxModelCSS(),
      ...this.toBorderCSS(),
      ...this.toOutlineCSS(),
      ...this.toTransformCSS(),
      ...this.toBorderRadiusCSS(),
      ...this.toBorderImageCSS(),
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS(),      
      ...this.toBackgroundImageCSS(isExport)
    };
  }
  /**
   * `@keyframes` 문자열만 따로 생성 
   */
  toKeyframeString (isAnimate = false) {
    return this.json.keyframes
              .map(keyframe => keyframe.toString(isAnimate))
              .join('\n\n')
  }
 
  toSelectorString (prefix = '') {
    return this.json.selectors
              .map(selector => selector.toString(prefix))
              .join('\n\n')
  }

  
 
  toSVGString () {
    return this.json.svg.map(s => {

      if (s.type === 'filter') {
        return `
<${s.type} id='${s.name}'>
  ${s.value.join('\n')}
</${s.type}>`
      } else if (s.type === 'clip-path') {
        var obj = filterSVGClipPath(icon[s.value.icon], s.value.fit, this.json.width, this.json.height)
        return `
<clipPath id='${s.name}' ${obj.transform}>
  ${obj.paths}
</clipPath>`
      }
    }).join('\n\n')
  }


  toNestedCSS($prefix) {
    return []
  }

  generateEmbed () {
    return {
      css: this.toEmbedCSS(), 
      selectorString: this.toSelectorString()
    }
  }

  generateView (prefix = '') {

    //1. 원본 객체의 css 를 생성 
    //2. 원본이 하나의 객체가 아니라 복합 객체일때 중첩 CSS 를 자체 정의해서 생성 
    //3. 이외에 selector 로 생성할 수 있는 css 를 생성 (:hover, :active 등등 )
    var cssString = `
${prefix} {  /* ${this.json.itemType} */
    ${CSS_TO_STRING(this.toCSS(), '\n')}; 
}

${this.toNestedCSS().map(it => {
  return `${prefix} ${it.selector} { 
      ${it.cssText ? it.cssText : CSS_TO_STRING(it.css || {}, '\n')}; 
  }`
}).join('\n')}

${this.toSelectorString(prefix)}
`  
    return cssString;
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
}
