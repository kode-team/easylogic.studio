
import { Length } from "el/editor/unit/Length";
import { GroupItem } from "./GroupItem";
import { Selector } from "../property-parser/Selector";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import PathParser from "el/editor/parser/PathParser";


export class DomItem extends GroupItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      'position': 'absolute',
      'x': Length.z(),
      'y': Length.z(),
      'right': '',
      'bottom': '',
      'rootVariable': '',
      'variable': '',      
      'width': Length.px(300),
      'height': Length.px(300),
      'color': "black",
      'font-size': Length.px(13),
      'overflow': 'visible',
      'rotate': Length.deg(0),
      'opacity': 1,
      'z-index': Length.auto,
      'transform-style': 'preserve-3d',
      'layout': 'default',
      'flex-layout': 'display:flex;',
      'grid-layout': 'display:grid;',
      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      // keyframes: [],
      selectors: [],
      svg: [],
      ...obj
    });
  }

  toCloneObject() {

    var json = this.json; 

    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'position',
        'right',
        'bottom',
        'rootVariable',
        'variable',
        'transform',
        'filter',
        'backdrop-filter',
        'background-color',      
        'background-image',      
        'text-clip',
        'border-radius',      
        'border',
        'box-shadow',
        'text-shadow',
        'clip-path',
        'color',
        'font-size',
        'font-stretch',
        'line-height',
        'text-align',
        'text-transform',
        'text-decoration',
        'letter-spacing',
        'word-spacing',
        'text-indent',      
        'perspective-origin',
        'transform-origin',
        'transform-style',      
        'perspective',
        'mix-blend-mode',
        'overflow',
        'opacity',
        'rotate',
        'flex-layout',      
        'grid-layout',         
        'animation',      
        'transition',  
      ),
        
      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      // keyframes: json.keyframes.map(keyframe => keyframe.clone()),
      selectors: json.selectors.map(selector => selector.clone()),
      svg: json.svg.map(svg => svg.clone())
    }
  }

  addSelector(selector) {
    this.json.selectors.push(selector);
    return selector;
  }      

  createSelector(data = {}) {
    return this.addSelector(
      new Selector({
        checked: true,
        ...data
      })
    );
  }    

  removePropertyList(arr, removeIndex) {
    arr.splice(removeIndex, 1);
  }
  
  removeSelector(removeIndex) {
    this.removePropertyList(this.json.selectors, removeIndex);
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

  updateSelector(index, data = {}) {
    this.json.selectors[+index].reset(data);
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
  
  // export animation keyframe
  toAnimationKeyframes (properties) {
    return [
      { selector: `[data-id="${this.json.id}"]`, properties }
    ] 
  }

  toBound () {
    var obj = {
      x: this.json.x ? this.json.x.clone() : Length.z(),
      y: this.json.y ? this.json.y.clone() : Length.z(),
      width: this.json.width.clone(),
      height: this.json.height.clone(),
    }

    obj.x2 = Length.px(obj.x.value + obj.width.value);
    obj.y2 = Length.px(obj.y.value + obj.height.value);

    return obj
  }


  setCache () {

    var obj = ClipPath.parseStyle(this.json['clip-path'])

    if (obj.type === 'path') {
      // 캐쉬 할 때는  0~1 사이 값으로 가지고 있다가 
      this.cacheClipPath = new PathParser(obj.value.trim())
      this.cacheClipPath.scale(1/this.json.width.value, 1/this.json.height.value)
    } else {
      this.cacheClipPath = undefined;
    }

  }

  recover () {

    if (this.cacheClipPath) {
      var sx = this.json.width.value
      var sy = this.json.height.value
  
      // 마지막 크기(width, height) 기준으로 다시 확대한다. 
      this.reset({
        'clip-path': `path(${this.cacheClipPath.clone().scaleTo(sx, sy)})`
      })
    }


  }

}
