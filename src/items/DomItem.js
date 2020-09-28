
import { Length } from "@unit/Length";
import { GroupItem } from "./GroupItem";
import { Selector } from "../property-parser/Selector";


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
      'overflow': json['overflow'],
      'opacity': json.opacity || 1,
      'rotate': json.rotate,
      'flex-layout': json['flex-layout'],      
      'grid-layout': json['grid-layout'],         
      'animation': json['animation'],      
      'transition': json['transition'],               
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

}
