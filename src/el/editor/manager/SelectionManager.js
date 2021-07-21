import { itemsToRectVerties, polyPoint, polyPoly, rectToVerties, toRectVerties} from "el/base/functions/collision";
import { isFunction, isUndefined, isArray, isObject, isString, clone } from "el/base/functions/func";
import { Item } from "el/editor/items/Item";
import { MovableItem } from "el/editor/items/MovableItem";
import { Project } from "plugins/default-items/layers/Project";
import { Length } from "el/editor/unit/Length";
import { vec3 } from "gl-matrix";

function _traverse(obj, idList) {
  var results = [] 

  obj.layers.length && obj.layers.forEach(it => {
    results.push.apply(results, _traverse(it, idList));
  })

  if (idList.id) {
    results.push(obj);
  } else if (idList.includes(obj.id)) {
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
    this.hoverId = ''; 
    this.hoverItems = []    
    this.ids = [];
    this.idsString = '';    
    this.colorsteps = []
    this.cachedItemVerties = []    
    this.cachedArtBoardVerties = []
    this.cachedVerties = rectToVerties(0, 0, 0, 0, '50% 50% 0px');
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

  /**
   * 
   * @returns {Project}
   */
  get currentProject () {
    return this.project;
  }

  /**
   * @returns {boolean}
   */
  get isEmpty () {
    return !this.length 
  }

  /**
   * @returns {boolean}
   */
  get isOne () {
    return this.length === 1; 
  }

  /**
   * @returns {boolean}
   */  
  get isMany () {
    return this.length > 1; 
  }  

  get length () {
    return this.items.length;
  }

  get isLayoutItem() {
    return this.current?.isLayoutItem();
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

      // 선택된 것은 제외 
      if (this.check(item)) return false; 
      
      // viewport 안에 존재 하는 것만 대상으로 한다. 
      const inViewport = item.verties.some(v => {
        return this.$editor.viewport.checkInViewport(v)
      })

      return inViewport;

    })
  }

  get snapTargetLayersWithSelection () {

    if (!this.currentProject) return [];

    return this.currentProject.allLayers.filter((item) => {
      // project item 은 제외 
      if (item.is('project')) return false; 

      // viewport 안에 존재 하는 것만 대상으로 한다. 
      const inViewport = item.verties.some(v => {
        return this.$editor.viewport.checkInViewport(v)
      })

      return inViewport;
    });
  }

  get selectedArtboards () {
    return [...new Set(this.items.map(it => it.artboard))]
  }

  /**
   * 
   * @param {string[]] args
   */
  hasChangedField(...args) {
    if (this.current) {
      return this.current.hasChangedField(...args);
    }
    return false; 
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

  isSameIds (newIds) {

    if (this.ids.length != newIds.length) {
      return false; 
    }

    // 동일한 selection 을 가지고 있으면 더 이상 select 를 진행하지 않는다. 
    if (this.ids.filter(id => newIds.includes(id)).length === this.ids.length) {
      return true; 
    }

    return false; 
  }

  select(...args) {

    var list = (args || []).filter(it => !it.lock && it.isAbsolute)

    // 부모, 자식간에 동시에 selection 이 되어 있으면 
    // 자식은 제외한다. 
    const newSelectedItems = list.filter(it => {
      return it.path.filter(element => list.includes(element)).length < 2;
    }); 

    const newSelectedIds = newSelectedItems.map(it => it.id);

    // 동일한 selection 을 가지고 있으면 더 이상 select 를 진행하지 않는다. 
    if (this.isSameIds(newSelectedIds)) {
      return false; 
    }

    this.items = newSelectedItems;
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

  reload() {
    return this.select(...this.itemsByIds(this.ids));

  }

  reselect () {
    this.setRectCache();
  }

  check (item) {
    return !!this.itemKeys[item.id]
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

    let itemIdList = [];

    if (isArray(ids)) {
      itemIdList = ids; 
    } else if (isString(ids) || isObject(ids)) {
      itemIdList = [ids];
    }

    /**
     * 주어진 id 리스트가 있을 때 project 에 캐쉬된 item 을 먼저 조회 하도록 한다. 
     */
    if (itemIdList.length) {

      const project = this.project;
      const newItems = []
      const expectIdList = []

      itemIdList.forEach(id => {
        if (project.hasIndexItem(id)) {
          newItems.push(project.getIndexItem(id));
        } else {
          expectIdList.push(id);
        }
      })

      const searchItems = _traverse(this.project, expectIdList);

      searchItems.forEach(it => {
        project.addIndexItem(it);
      })

       newItems.push.apply(newItems, searchItems);

       return newItems;
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
   * id 로 아이템 선택하기 
   * 
   * @param {string} id 
   */
  selectById(id) {
    if (id) {
      this.select(... _traverse(this.project, id))
    }

  }

  selectAfterCopy () {
    this.select(...this.items.map(it => it.copy()));
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

  getArtboardByPoint (vec) {
    const selectedArtBoard = this.currentProject.artboards.find(artboard => {
      const artboardVerties = artboard.matrix.verties.filter((_, index) => index < 4);
      return polyPoint(artboardVerties, vec[0], vec[1]) 
    })

    return selectedArtBoard;
  }

  changeArtBoard () {

    let checkedParentChange = false

    this.each(instance => {

      if (instance.is('artboard') === false) {

        const instanceVerties = instance.rectVerties();

        // FIXME: 내가 속한 영역이 객체의 instance 의 artboard 안에 있으면 artboard 를 바꾸지 않는다. 
        if (instance.artboard) {
          const localArtboard = instance.artboard;
          const localArtboardVerties = localArtboard.rectVerties();
          const isInArtboard = polyPoint(localArtboardVerties, instanceVerties[0][0],instanceVerties[0][1]) || polyPoly(instanceVerties, localArtboardVerties) 

          // 내가 여전히 나의 artboard 에 속해 있으면 변경하지 않는다. 
          if (isInArtboard) {
            return false;
          }
        }

  
        const selectedArtBoard = this.cachedArtBoardVerties.find(artboard => {
          const artboardVerties = artboard.matrix.verties.filter((_, index) => index < 4);
          return polyPoint(artboardVerties, instanceVerties[0][0],instanceVerties[0][1]) || polyPoly(instanceVerties, artboardVerties) 
        })
  

        if (selectedArtBoard) {
          // 부모 artboard 가 다르면  artboard 를 교체한다.            
          if (selectedArtBoard.item !== instance.artboard) {
            selectedArtBoard.item.appendChildItem(instance);
            checkedParentChange = true;
          }
        } else {
          if (instance.artboard) {
            this.currentProject.appendChildItem(instance);       
            checkedParentChange = true;
          }

        }
      }
    })

    return checkedParentChange;
  }

  setRectCache () {

    if (this.isEmpty) {
      this.cachedVerties = [];
      this.cachedRectVerties = [];
      this.cachedItemVerties = []
      this.cachedArtBoardVerties = this.currentProject.artboards.map(item => {
        return { item, matrix: item.matrix};
      })
  
      return;
    }

    this.cachedVerties = this.verties;
    this.cachedRectVerties = toRectVerties(this.verties);

    this.cachedItemVerties = this.items.map(it => {
      it.fakeParent = undefined;
      return it.matrix;
    })

    this.cachedArtBoardVerties = this.currentProject.artboards.map(item => {
      return { item, matrix: item.matrix};
    })
    
    // TODO:  select 를 캐쉬한 이후에 refreshSelection 메세지를 보낸다. 
    // TODO: history.refreshSelection 을 사용해서 항상 history 에 저장한다. 
  }

  get verties () {

    if (this.isOne) {    // 하나 일 때랑 
      return this.current.verties;
    } else {
      return this.rectVerties;
    }
  }

  get selectionVerties () {

    if (this.isOne) {    // 하나 일 때랑 
      return this.current.selectionVerties();
    } else {
      return this.rectVerties;
    }
  }


  get rectVerties () {
    if (this.isEmpty) {
      return [];
    }
    return itemsToRectVerties(this.items)
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

  /**
   * 선택된 객체의 값을 패키징 한다. 
   * 
   * @param {string[]} keys
   *  @returns {Object}
  */
  pack (...keys) {
    let data = {};

    this.each(item => {

      data[item.id] = {}

      keys.forEach(key => {     
        data[item.id][key] = item[key];
      })
    })

    return data; 
  }

  /**
   * 특정 영역의 값에 대한 패키징 한다. 
   * 
   * @param {object} valueObject
   * @returns {Object} 
   */
  packByValue (valueObject, ids = null) {
    let data = {};

    if (ids === null) {
      this.each(item => {
        data[item.id] = isFunction(valueObject) ? valueObject(item) : valueObject;
      });

    } else if (isString(ids) || isArray(ids)){
      this.itemsByIds(ids).forEach(item => {
          data[item.id] = isFunction(valueObject) ? valueObject(item) : valueObject;
      })
    }

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
        return callback (item, index);
      })
    }

    return this.items; 
  }

  reset (obj) {

    Object.entries(obj).forEach(([id, attrs]) => {
      this.get(id)?.reset(attrs);
    })
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
    this.select(...this.copyItems.map(item => item.copy(10)));
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
  
  /**
   * 특정 위치가 selection 영역에 있는지 여부 체크 
   * 
   * @param {vec3} point 
   * @param {number} y 
   */
  hasPoint (point) {

    if (this.isMany) {
      // 멀티 selection 일 때는  사각형 영역에서 체크 
      return polyPoint(this.rectVerties, point[0], point[1]);
    } else {
      return this.cachedItemVerties.some((it) => {
        return polyPoint(it.verties, point[0], point[1]);
      })  
    }
    
  }

  checkHover (itemOrId) {
    if (isString(itemOrId)) {
      return this.hoverId === itemOrId; 
    } else {
      return this.hoverItems.findIndex((it) => it.id === itemOrId.id) > -1; 
    }
  }

  setHoverId (id) {
    let isChanged = false; 
    if (!id || this.itemKeys[id]) {

      if (this.hoverId != '') {
        isChanged = true; 
      }

      this.hoverId = ''; 
      this.hoverItems = []      
    } else if (this.cachedArtBoardVerties.find(it => it.item.id === id)) {
      if (this.hoverId != '') {
        isChanged = true; 
      }
      this.hoverId = ''; 
      this.hoverItems = []
    } else {
      if (this.hoverId != id) {
        isChanged = true; 
      }      
      this.hoverId = id; 
      this.hoverItems = this.itemsByIds([id]).filter(it => it.is('artboard') === false);

      if (this.hoverItems.length === 0) {
        this.hoverId = ''; 
        isChanged = true; 
      }
    }

    if (isChanged) {
      this.$editor.emit('changeHoverItem');
    }

    return isChanged;
  }
}
