import { polyPoint, polyPoly, rectToVerties } from "@core/functions/collision";
import { isFunction, isUndefined, isArray, isObject, isString, clone } from "@core/functions/func";
import { ArtBoard } from "@items/ArtBoard";
import { Item } from "@items/Item";
import { MovableItem } from "@items/MovableItem";
import { Length } from "@unit/Length";
import { vec3 } from "gl-matrix";

function _traverse(obj, id) {
  var results = [] 

  obj.layers.length && obj.layers.forEach(it => {
    results.push(..._traverse(it, id));
  })

  if (id.id) {
    results.push(obj);
  } else if (id.includes(obj.id)) {
    results.push(obj);
  }

  return results; 
}

export class SelectionManager {
  constructor(editor) {

    /**
     * @property {Editor} $editor Editor
     */    
    this.$editor = editor; 

    /**
     * @property {Project} project Project Item 
     */
    this.project = null;
    /**
     * @property {Item[]} items Item List
     */
    this.items = [];
    this.itemKeys = {} 
    this.ids = [];
    this.idsString = '';    
    this.colorsteps = []
    this.cachedItemVerties = {}    
    this.selectionCamera = new MovableItem({
      parent: this.currentProject,
      x: Length.px(0), 
      y: Length.px(0),
      width: Length.px(0),
      height: Length.px(0)
    });
  }

  initialize() {
    // this.colorsteps = []    
    this.items = [];
    this.itemKeys = {} 
    this.ids = []; 
    this.idsString = '';   
    this.cachedItemVerties = {}    
  }

  // snapshot() {
  //   const selection = new SelectionManager(this.$editor);
  //   selection.select(this.cachedItems);

  //   this.$editor.history.add('selection', 'selection', { selection })
  // }


  /**
   * get first item instance
   */
  get current() {
    return this.items[0]
  }

  get currentProject () {
    return this.project;
  }

  get isEmpty () {
    return !this.length 
  }

  get isOne () {
    return this.length === 1; 
  }

  get isMany () {
    return this.length > 1; 
  }  

  get length () {
    return this.items.length;
  }

  /**
   * snap to object 에 사용될 target item 리스트 
   * 
   * @returns {Item[]}
   */
  get snapTargetLayers () {

    if (!this.currentProject) return [];

    return this.currentProject.allLayers.filter((item) => {
      // project item 은 제외 
      if (item.is('project')) return false; 

      return !this.check(item); 
    });
  }

  get snapTargetLayersWithSelection () {

    if (!this.currentProject) return [];

    return this.currentProject.allLayers.filter((item) => {
      // project item 은 제외 
      if (item.is('project')) return false; 

      return true; 
    });
  }

  getRootItem (current) {
    var rootItem = current;
    if (current && current.parent) {
        rootItem = current.parent; 
    }

    return rootItem;
  }

  selectColorStep (...args) {
    this.colorsteps = args; 
  }

  isSelectedColorStep (id) {
    return this.colorsteps.includes(id);
  }

  selectProject (project) {
    this.project = project;
  }

  get isRelative () {
    var item = this.items[0] || { }

    return item.position === 'relative'
  }

  select(...args) {

    var list = (args || []).filter(it => !it.lock && it.isAbsolute)

    // 부모, 자식간에 동시에 selection 이 되어 있으면 
    // 자식은 제외한다. 
    this.items = list.filter(it => {
      return it.path.filter(element => list.includes(element)).length < 2;
    }); 

    this.itemKeys = {}
    this.items.forEach(it => {
      this.itemKeys[it.id] = it; 
    })
    this.ids = Object.keys(this.itemKeys)
    this.ids.sort();
    this.idsString = this.ids.join(',');

    this.setRectCache();

    return true; 
  }

  reselect () {
    this.setRectCache();
  }

  check (item) {
    return this.itemKeys[item.id]
  }

  get (id) {
    return this.itemKeys[id];
  }

  /**
   * selection 상태를 비운다. 
   */
  empty () {
    this.select()
  }

  /**
   * id 기반으로 객체를 검색한다. 
   * id 가 없으면 현재 선택된 객체 리스트를 반환한다. 
   * 
   * @param {string[]|null} ids 
   * @returns {Item[]}
   */
  itemsByIds(ids = null) {
    if (isArray(ids)) {
      return _traverse(this.project, ids)
    } else if (isString(ids) || isObject(ids)) {
      return _traverse(this.project, [ids]);
    } else {
      return this.items;
    }
  }

  makeItemMap (attrs) {
    let itemMap = {} 
    this.ids.forEach(id => {
      itemMap[id] = clone(attrs)
    })

    return itemMap;
  }

  /**
   * 
   * @param {Item|Item[]} id 
   */
  selectById(id) {
    this.select(... _traverse(this.project, id))
  }

  addById(id) {

    if (this.itemKeys[id]) return;

    this.select(...this.items, ... _traverse(this.project, id))
  }  

  /**
   * 
   * id 로 선택된 객체 지우기 
   * 
   * @param {string|string[]} id 
   */
  removeById(id) {

    let ids = id; 

    if (isString(id)) {
      ids = [id];
    }

    const filteredItems = this.items.filter(it => ids.includes(it.id) === false)

    this.select(...filteredItems)
  }    

  toggleById (id) {
    if (this.itemKeys[id]) {
      this.removeById(id);
    } else {
      this.addById(id);
    }
  }

  changeArtBoard () {

    this.each(instance => {

      if (instance.is('artboard') === false) {

        const instanceVerties = instance.verties().filter((_, index) => index < 4);
  
        const selectedArtBoard = this.cachedArtBoardVerties.find(artboard => {
          const artboardVerties = artboard.matrix.verties.filter((_, index) => index < 4);
          return polyPoint(artboardVerties, instanceVerties[0][0],instanceVerties[0][1]) || polyPoly(instanceVerties, artboardVerties) 
        })
  
        // artboard 가 있고 artboard 가 나의 부모가 아니면 
        if (selectedArtBoard) {
          if (selectedArtBoard.item !== instance.parent) {
            selectedArtBoard.item.appendChildItem(instance);
          } else {
            // 동일한 artboard 를 부모로 가지고 있으면 
            // 아무것도 하지 않는다. 
          }
        } else {
            this.currentProject.appendChildItem(instance);        
        }
      }
    })

  }

  doCache () {
    this.items.forEach(item => {
      item.setCache();
    })
  }

  setRectCache () {
    
    // this.cachedItems = this.items.map(it => {
    //   return it.toCloneObject()
    // })

    this.cachedItemVerties = this.items.map(it => {
      it.fakeParent = undefined;
      return it.matrix;
    })

    this.cachedArtBoardVerties = this.currentProject.artboards.map(item => {
      return { item, matrix: item.matrix};
    })

    // this.setAllRectCache();
  }

  get verties () {

    if (this.isOne) {    // 하나 일 때랑 
      return this.current.verties()
    } else {
      let minX = Number.MAX_SAFE_INTEGER;
      let minY = Number.MAX_SAFE_INTEGER;
      let maxX = Number.MIN_SAFE_INTEGER;
      let maxY = Number.MIN_SAFE_INTEGER;

      this.each(item => {
          item.verties().filter((it, index) => index < 4).forEach(vector => {
              minX = Math.min(minX, vector[0]);
              minY = Math.min(minY, vector[1]);
              maxX = Math.max(maxX, vector[0]);
              maxY = Math.max(maxY, vector[1]);
          });

      })

      return rectToVerties(minX, minY, maxX - minX, maxY - minY);
    }
  }

  /**
   * Item Rect 만들기 
   * 멀티 selection 일 때만 사용하자 
   * 
   * @returns {ItemRect} 
   */
  get itemRect () {
    const verties = this.verties;
    return {
      x: Length.px(verties[0][0]),
      y: Length.px(verties[0][1]),
      width: Length.px(vec3.distance(verties[0], verties[1])),
      height: Length.px(vec3.distance(verties[0], verties[3])),      
    }
  } 

  // 객체 속성만 클론 
  // 부모, 자식은 클론하지 않음. 
  // 부모 자식은, 객체가 추가 삭제시만 필요 
  toCloneObject () {
    let data = {};

    this.each(item => {
      data[item.id] = item.toCloneObject(false);
    })

    return data;     
  }

  cloneValue (...keys) {
    let data = {};

    this.each(item => {

      data[item.id] = {}

      keys.forEach(key => {     
        data[item.id][key] = item[key];
      })
    })

    return data; 
  }

  each (callback) {

    if ( isFunction(callback)) {
      this.items.forEach( (item, index) => {
        callback (item);
      })
    }

  }

  map (callback) {

    if (isFunction (callback)) {
      return this.items.map( (item, index) => {
        return callback (item);
      })
    }

    return this.items; 
  }

  reset (obj) {
    this.each(item => item.reset(obj))
  }

  resetCallback (callback) {
    this.each(item => item.reset(callback(item)))
  }

  resize () {
    this.each(item => item.resize());
  }

  remove () {
    this.each(item => item.remove())
    this.empty();
  }

  copy () {
    this.copyItems = this.items.map(item => item)
  }  

  paste() {
    this.select(...this.copyItems.map(item => item.copy()));
    this.copy()
  }

  isInParent (item, parentItems = []) {

    var prevItem = item; 
    var parent = prevItem.parent; 
    var hasParent = parentItems.includes(parent); 

    while(!hasParent) {
      if (isUndefined(parent)) break; 
      prevItem = parent; 
      parent = parent.parent; 
      hasParent = parentItems.includes(parent); 
    }

    return hasParent; 
  }
  
}
