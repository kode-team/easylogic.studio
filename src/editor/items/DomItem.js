import { NEW_LINE_2, NEW_LINE, EMPTY_STRING } from "../../util/css/types";
import { CSS_TO_STRING, CSS_SORTING } from "../../util/css/make";
import { Length } from "../unit/Length";
import { Display } from "../css-property/Display";
import { GroupItem } from "./GroupItem";
import {
  keyEach,
  combineKeyArray,
  isUndefined,
  isNotUndefined
} from "../../util/functions/func";
import { BorderImage } from "../css-property/BorderImage";
import { Animation } from "../css-property/Animation";
import { Transition } from "../css-property/Transition";
import { Keyframe } from "../css-property/Keyframe";
import { Selector } from "../css-property/Selector";
import icon from "../../csseditor/ui/icon/icon";
import Dom from "../../util/Dom";

function filterSVGClipPath (str = '', isFit = false, maxWidth, maxHeight) {
  var $div = new Dom('div');
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
      'width': Length.px(300),
      'height': Length.px(300),
      'rootVariable': '',
      'variable': '',
      'transform': '',
      'filter': '',
      'backdrop-filter': '',
      'background-color': 'rgba(255, 255, 255, 1)',      
      'background-image': '',      
      'border-radius': '',      
      'box-shadow': '',
      'text-shadow': '',
      'clip-path': '',
      'color': "",
      'font-size': '',
      'line-height': '',
      'text-align': '',
      'text-transform': '',
      'text-decoration': '',
      'letter-spacing': '', 
      'word-spacing': '', 
      'text-indent': '',      
      'perspective-origin': '',
      'transform-origin': '',
      'perspective': '',
      'mix-blend-mode': '',
      'opacity': '',
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
      content: "",
      ...obj
    });
  }

  convert(json) {
    json = super.convert(json);

    json.width = Length.parse(json.width);
    json.height = Length.parse(json.height);

    if (json.display) json.display = Display.parse(json.display);

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
    var obj = {}
    this.json[field].split(';').forEach(it => {
      var [key, value]  = it.split(':').map(it => it.trim())

      // if (value) {
      //   value = value.replace('to top', 'var(--ang)'); 
      // }
      obj[key] = value
    })

    return obj;
  }

  toBackgroundImageCSS(isExport = false) {
    return this.toStringPropertyCSS('background-image')
  }

  getBorderString(data) {
    return `${data.width} ${data.style} ${data.color}`;
  }

  toSizeCSS() {
    return {
      width: this.json.width,
      height: this.json.height
    };
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

  // 0 데이타는 화면에 표시하지 않는다.
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
  

  toFilterCSS() {
    return this.toKeyCSS('filter');
  }

  toPerspectiveOriginCSS() {
    return this.toKeyCSS('perspective-origin')
  }

  toClipPathCSS() {
    return this.toKeyCSS('clip-path');
  }  

  toTransformCSS() {
    return this.toKeyCSS('transform');
  }

  toBackdropFilterCSS() {
    return this.toKeyCSS('backdrop-filter');
  }

  toBoxShadowCSS() {
    return this.toKeyCSS('box-shadow');
  }

  toTextShadowCSS() {
    return this.toKeyCSS('text-shadow');
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
      'font-size', 'line-height', 'font-weight', 'font-family', 'font-style',
      'text-align', 'text-transform', 'text-decoration',
      'letter-spacing', 'word-spacing', 'text-indent'
    )
  }

  toDefaultCSS(isExport = false) {
    return this.toKeyListCSS(
      'background-color', 'color', 
      'opacity', 'mix-blend-mode', 
      'transform-origin',
      'perspective', 'perspective-origin'
    )

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

  toCSS(isExport = false) {

    return CSS_SORTING({
      ...this.toVariableCSS(),
      ...this.toDefaultCSS(isExport),
      ...this.toFontCSS(),
      ...this.toBoxModelCSS(),
      ...this.toSizeCSS(),
      ...this.toBorderCSS(),
      ...this.toOutlineCSS(),      
      ...this.toBorderRadiusCSS(),
      ...this.toBorderImageCSS(),
      ...this.toAnimationCSS(),
      ...this.toClipPathCSS(),
      ...this.toFilterCSS(),
      ...this.toTransformCSS(),
      ...this.toBackdropFilterCSS(),      
      ...this.toBackgroundImageCSS(isExport),
      ...this.toBoxShadowCSS(),
      ...this.toTextShadowCSS(),
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS()
    });
  }

  toEmbedCSS(isExport = false) {
    var json = this.json;
    var css = {
      content: json.content
    };

    return CSS_SORTING({
      ...this.toVariableCSS(),      
      ...css,
      ...this.toDefaultCSS(),
      ...this.toFontCSS(),
      ...this.toBoxModelCSS(),
      ...this.toSizeCSS(),
      ...this.toBorderCSS(),
      ...this.toOutlineCSS(),
      ...this.toBorderRadiusCSS(),
      ...this.toBorderImageCSS(),
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS(),      
      ...this.toClipPathCSS(),
      ...this.toFilterCSS(),
      ...this.toTransformCSS(),      
      ...this.toBackdropFilterCSS(),
      ...this.toBackgroundImageCSS(isExport),
      ...this.toBoxShadowCSS(),
      ...this.toTextShadowCSS()
    });
  }
  /**
   * `@keyframes` 문자열만 따로 생성 
   */
  toKeyframeString (isAnimate = false) {
    return this.json.keyframes
              .map(keyframe => keyframe.toString(isAnimate))
              .join(NEW_LINE_2)
  }
 
  toSelectorString (prefix = '') {
    return this.json.selectors
              .map(selector => selector.toString(prefix))
              .join(NEW_LINE_2)
  }
 
  toSVGString () {
    return this.json.svg.map(s => {

      if (s.type === 'filter') {
        return `
        <${s.type} id='${s.name}'>
          ${s.value.join(NEW_LINE)}
        </${s.type}>`
      } else if (s.type === 'clip-path') {
        var obj = filterSVGClipPath(icon[s.value.icon], s.value.fit, this.json.width, this.json.height)
        return `
        <clipPath id='${s.name}' ${obj.transform}>
          ${obj.paths}
        </clipPath>`
      }
    }).join(NEW_LINE_2)
  }




  generateEmbed () {
    return {
      css: this.toEmbedCSS(), 
      keyframeString: this.toKeyframeString(), 
      rootVariable: this.toRootVariableCSS(), 
      content: this.json.content,
      SVGString: this.toSVGString(),
      selectorString: this.toSelectorString()
    }
  }

  generateView (prefix = '') {
    return {
      css: this.toCSS(), 
      keyframeString: this.toKeyframeString(), 
      rootVariable: this.toRootVariableCSS(), 
      content: this.json.content,
      SVGString: this.toSVGString(),
      selectorString: this.toSelectorString(prefix)
    }
  }
}
