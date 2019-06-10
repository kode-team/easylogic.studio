import { NEW_LINE_2 } from "../../util/css/types";
import { CSS_TO_STRING, CSS_SORTING } from "../../util/css/make";
import { Length } from "../unit/Length";
import { Display } from "../css-property/Display";
import { GroupItem } from "./GroupItem";
import {
  keyEach,
  combineKeyArray,
  isUndefined
} from "../../util/functions/func";
import { BorderImage } from "../css-property/BorderImage";
import { Animation } from "../css-property/Animation";
import { Transition } from "../css-property/Transition";
import { Keyframe } from "../css-property/Keyframe";


export class DomItem extends GroupItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      'width': Length.px(300),
      'height': Length.px(400),
      'rootVariable': '',
      'variable': '',
      'transform': '',
      'filter': '',
      'backdrop-filter': '',
      'background-color': 'white',      
      'background-image': '',      
      'border-radius': '',      
      'box-shadow': '',
      'text-shadow': '',
      'clip-path': '',
      'color': "black",
      'font-size': '',
      'line-height': '',
      'text-align': '',
      'text-transform': '',
      'text-decoration': '',
      'letter-spacing': '', 
      'word-spacing': '', 
      'text-indent': '',      
      x: Length.px(100),
      y: Length.px(100),
      // filters: [],      // deprecated 
      border: {},
      outline: {
        color: 'currentcolor',
        style: 'none',
        width: Length.px(3)  /* medium */
      },
      
      borderRadius: {},
      borderImage: new BorderImage(),
      applyBorderImage: false,
      animations: [],
      transitions: [],
      keyframes: [],
      perspectiveOriginPositionX: Length.percent(0),
      perspectiveOriginPositionY: Length.percent(0),
      display: Display.parse({ display: "block" }),
      marginTop: Length.px(0),
      marginBottom: Length.px(0),
      marginRight: Length.px(0),
      marginLeft: Length.px(0),
      paddingTop: Length.px(0),
      paddingBottom: Length.px(0),
      paddingRight: Length.px(0),
      paddingLeft: Length.px(0),
      content: "",
      ...obj
    });
  }

  convert(json) {
    json = super.convert(json);

    json.width = Length.parse(json.width);
    json.height = Length.parse(json.height);
    json.x = Length.parse(json.x);
    json.y = Length.parse(json.y);
    json.perspectiveOriginPositionX = Length.parse(
      json.perspectiveOriginPositionX
    );
    json.perspectiveOriginPositionY = Length.parse(
      json.perspectiveOriginPositionY
    );

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
    var results = {};
    var outline = this.json.outline;

    if (!outline) return {} ;

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
    if (
      json.marginTop.value === json.marginBottom.value &&
      json.marginLeft.value === json.marginRight.value &&
      json.marginTop.value === json.marginRight.value
    ) {
      obj.margin = json.marginTop;
    } else {
      obj["margin-top"] = json.marginTop;
      obj["margin-bottom"] = json.marginBottom;
      obj["margin-left"] = json.marginLeft;
      obj["margin-right"] = json.marginRight;
    }

    if (
      json.paddingTop.value === json.paddingBottom.value &&
      json.paddingLeft.value === json.paddingRight.value &&
      json.paddingTop.value === json.paddingRight.value
    ) {
      obj.padding = json.paddingTop;
    } else {
      obj["padding-top"] = json.paddingTop;
      obj["padding-bottom"] = json.paddingBottom;
      obj["padding-left"] = json.paddingLeft;
      obj["padding-right"] = json.paddingRight;
    }

    return obj;
  }

  toKeyListCSS (...args) {
    var json = this.json;
    var obj = {};

    args.forEach( it => {
      if (json[it]) {
        obj[it] = json[it]
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
    var json = this.json;
    var css = {
      "background-color": json['background-color'],
      color: json.color
    };

    return CSS_SORTING({
      ...this.toVariableCSS(),
      ...css,
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
      "background-color": json['background-color'],
      color: json.color,
      content: json.content
    };

    return CSS_SORTING({
      ...this.toVariableCSS(),      
      ...css,
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
    return this.json.keyframes.map(keyframe => keyframe.toString(isAnimate)).join(NEW_LINE_2)
  }
}
