
import { Length } from "el/editor/unit/Length";
import { GroupModel } from "./GroupModel";
import { Selector } from "../property-parser/Selector";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import PathParser from "el/editor/parser/PathParser";
import { Pattern } from 'el/editor/property-parser/Pattern';
import { BackgroundImage } from 'el/editor/property-parser/BackgroundImage';
import { STRING_TO_CSS } from "el/utils/func";


const editableList = [
  'appearance',
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
  'border-radius',
  'border',
  'box-shadow',
  'clip-path',
  'color',
  'perspective-origin',
  'transform-origin',
  'transform-style',
  'perspective',
  'mix-blend-mode',
  'overflow',
  'opacity',
  'box-model',
  'layout',
  'flex-layout',
  'grid-layout',
  'animation',
  'transition',
  'pattern',
  'boolean-operation'
]

const editableKeys = {}
editableList.forEach(function (key) {
  editableKeys[key] = true
})

export class DomModel extends GroupModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      'position': 'absolute',
      'x': Length.z(),
      'y': Length.z(),
      'rootVariable': '',
      'variable': '',
      'width': Length.px(300),
      'height': Length.px(300),
      'color': "black",
      // 'font-size': Length.px(13),
      'overflow': 'visible',
      'opacity': 1,
      'z-index': Length.auto,
      'transform-style': 'preserve-3d',
      'layout': 'default',
      'flex-layout': 'display:flex;',
      'grid-layout': 'display:grid;',
      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      // keyframes: [],
      "boolean-operation": 'none',
      "boolean-path": "",
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
        'flex-layout',
        'grid-layout',
        'animation',
        'transition',
        'margin-top',
        'margin-left',
        'margin-right',
        'margin-bottom',
        'padding-top',
        'padding-right',
        'padding-left',
        'padding-bottom',
        'boolean-operation'
      ),

      // 'keyframe': 'sample 0% --aaa 100px | sample 100% width 200px | sample2 0.5% background-image background-image:linear-gradient(to right, black, yellow 100%)',
      // keyframes: json.keyframes.map(keyframe => keyframe.clone()),
      selectors: json.selectors.map(selector => selector.clone()),
      svg: json.svg.map(svg => svg.clone())
    }
  }

  editable(editablePropertyName) {

    if (editablePropertyName == 'border' && this.hasChildren()) {
      return false
    }

    switch (editablePropertyName) {
      case 'svg-item':
      // case 'box-model':
      // case 'transform':
      case 'transform-origin':
      case 'perspective':
      case 'perspective-origin':
        return false;
    }

    return Boolean(editableKeys[editablePropertyName])
  }

  get changedBoxModel() {
    return this.hasChangedField(
      'margin-top', 'margin-left', 'margin-bottom', 'margin-right', 
      'padding-top', 'padding-left', 'padding-right', 'padding-bottom'
    )
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

  reset(obj) {
    const isChanged = super.reset(obj);

    // transform 에 변경이 생기면 미리 캐슁해둔다. 
    if (this.hasChangedField('clip-path')) {
      this.setClipPathCache()
    } else if (this.hasChangedField('width', 'height')) {

      if (this.cacheClipPath) {
        const d = this.cacheClipPath.clone().scale(this.json.width.value / this.cacheClipPathWidth, this.json.height.value / this.cacheClipPathHeight).d;
        this.json['clip-path'] = `path(${d})`;

        this.modelManager.setChanged('reset', this.id, { 'clip-path' : this.json['clip-path'] });
      }

    } else if (this.hasChangedField('background-image', 'pattern')) {
      this.setBackgroundImageCache()
    } else if (this.hasChangedField('changedChildren', 'boolean-operation') || !this.json['boolean-path']) {
      if (this.json.children?.length === 2) {

        if (this.modelManager.editor.pathKitManager.has()) {
          const paths = this.layers.filter(it => it.is('svg-path'))
  
          if (paths.length === 2) {
            const newPath = this['boolean-operation'] != 'none' ?  this.booleanOperation() : "";
    
            this.json['boolean-path'] = newPath;
          }
        }
  
      }
  
    }


    

    return isChanged;
  }

  setBackgroundImageCache() {

    let list = [];

    if (this.json.pattern) {

      const patternList = this.computed('pattern', (pattern) => {
        return Pattern.parseStyle(pattern).map(it => {
          return BackgroundImage.parseStyle(STRING_TO_CSS(it.toCSS()))
        });
      })

      for(var i = 0, len = patternList.length; i < len; i++)   {
        list.push.apply(list, patternList[i]);
      }
    }

    if (this.json['background-image']) {
      const backgroundList = this.computed('background-image', (backgroundImage) => {
        return BackgroundImage.parseStyle(STRING_TO_CSS(backgroundImage))
      })

      list.push.apply(list, backgroundList);
    }

    if (list.length) {
      this.cacheBackgroundImage = BackgroundImage.joinCSS(list);
    } else {
      this.cacheBackgroundImage = {}
    }
  }

  setClipPathCache() {
    var obj = ClipPath.parseStyle(this.json['clip-path'])

    this.cacheClipPathObject = obj;    
    if (obj.type === 'path') {
      this.cacheClipPath = new PathParser(obj.value.trim())
      this.cacheClipPathWidth = this.json.width.value;
      this.cacheClipPathHeight = this.json.height.value;
    }
  }

  setCache() {
    super.setCache();

    this.setClipPathCache();
  }

  get clipPathString() {

    if (!this.cacheClipPath) {
      this.setClipPathCache();
    }

    if (this.cacheClipPath) {
      return this.cacheClipPath.clone().scale(this.json.width.value / this.cacheClipPathWidth, this.json.height.value / this.cacheClipPathHeight).d;
    }

  }

  booleanOperation() {
    const op = this.json['boolean-operation']
    switch(op) {
    case "intersection": return this.intersection();
    case "union": return this.union();
    case "difference": return this.difference();
    case "reverse-difference": return this.reverseDifference();
    case "xor": return this.xor();
    }

    return "";
  }

  intersection() {
    const layers = this.layers; 

    const newPath = this.modelManager.editor.pathKitManager.intersection(
      layers[0].accumulatedPath().d,
      layers[1].accumulatedPath().d
    ) 

    return this.invertPath(newPath).d;
  }

  union() {
    const layers = this.layers; 

    const newPath = this.modelManager.editor.pathKitManager.union(
      layers[0].accumulatedPath().d,
      layers[1].accumulatedPath().d
    ) 

    return this.invertPath(newPath).d;
  }

  difference() {
    const layers = this.layers; 

    const newPath = this.modelManager.editor.pathKitManager.difference(
      layers[0].accumulatedPath().d,
      layers[1].accumulatedPath().d
    ) 

    return this.invertPath(newPath).d;
  }

  reverseDifference() {
    const layers = this.layers; 

    const newPath = this.modelManager.editor.pathKitManager.reverseDifference(
      layers[0].accumulatedPath().d,
      layers[1].accumulatedPath().d
    ) 

    return this.invertPath(newPath).d;
  }  

  xor() {
    const layers = this.layers; 

    const newPath = this.modelManager.editor.pathKitManager.xor(
      layers[0].accumulatedPath().d,
      layers[1].accumulatedPath().d
    ) 

    return this.invertPath(newPath).d;
  }

}
