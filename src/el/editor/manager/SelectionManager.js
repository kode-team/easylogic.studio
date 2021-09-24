import { itemsToRectVerties, polyPoint, polyPoly, rectToVerties, toRectVerties} from "el/utils/collision";
import { Item } from "el/editor/items/Item";
import { Project } from "plugins/default-items/layers/Project";
import { Length } from "el/editor/unit/Length";
import { vec3 } from "gl-matrix";
import { clone, isFunction, isString, isUndefined, isObject } from "el/sapa/functions/func";

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
    // this.items = [];
    this.itemKeys = {} 
    this.hoverId = ''; 
    this.hoverItems = []    
    this.ids = []; 
    this.colorsteps = []
    this.cachedItemMatrices = []    
    this.cachedArtBoardVerties = []
    this.cachedVerties = rectToVerties(0, 0, 0, 0, '50% 50% 0px');

    this.$editor.on('config:bodyEvent', () => {
      this.refreshMousePosition();
    })
  }

  refreshMousePosition() {
    const areaWidth = this.$editor.config.get('area.width');
    const pos = this.$editor.viewport.getWorldPosition();

    this.pos = pos; 
    this.column = Math.ceil(pos[0]/areaWidth); 
    this.row = Math.ceil(pos[1]/areaWidth); 

  }

  get modelManager() {
    return this.$editor.modelManager;
  }

  get items () {
    return this.modelManager.searchLiveItemsById(this.ids);
  }

  /**
   * get first item instance
   */
  get current() {
    return this.modelManager.searchItem(this.ids[0]);
  }

  /**
   * 
   * @returns {Project}
   */
  get currentProject () {

    if (!this.project) {
      this.project = this.modelManager.getProjectByIndex();
    }

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

    // artboard 는 무조건 하나의 선택으로 간주한다. 
    if (this.length === 1 && this.current.is('artboard')) return true;  

    return this.length === 1; 
  }

  /**
   * @returns {boolean}
   */  
  get isMany () {
    return this.length > 1; 
  }  

  get length () {
    return this.ids.length;
  }

  get isLayoutItem() {
    return this.current?.isLayoutItem();
  }

  get allLayers() {
    return this.currentProject.allLayers || []
  }

  /**
   * area position(column, row) 으로 필터링된 객체 중에 
   * position 과 일치하는 layer 리스트 구하기 
   * rendering 레이어에 일치하는 group item 을 구한다. 
   * 
   * hover View 에서 아이템을 hover 아이템을 구할 때 사용된다. 
   * 
   * @returns {Item[]}
   */ 
  get filteredLayers () {

    return this.currentProject.filteredAllLayers((item) => {
      const areaPosition = item.areaPosition;

      if (!areaPosition) {
        return false;
      }

      const {column, row} = areaPosition 

      return (column[0] <= this.column && this.column <= column[1]) && 
             (row[0] <= this.row && this.row <= row[1]);
    }).filter(item => {
      return item.hasPoint(this.pos[0], this.pos[1])
    }).map(item => this.modelManager.findGroupItem(item.id));

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
    if (current && current.parentId) {
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

    if (isString(project) ) {
      project = this.modelManager.get(project);
    }

    this.project = project;
    this.select();
  }

  get isRelative () {
    var item = this.current || { }

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

  filterIds(ids = []) {
    return ids.map(it => it.id || it).filter(Boolean);
  }

  // 보통 drag 이후에 객체를 선택하는 경우에 유용하다. 
  // group 을 선택할 때 사용한다. 
  selectByGroup(...ids) {

    var list = this.modelManager.searchItemsById(this.filterIds(ids || [])).filter(it => !it.lock)

    // 상위 group 이 있다면 group 을 기준으로 selection 을 맞춘다. 
    const newSelectedItems = this.modelManager.convertGroupItems(list);

    return this.select(...newSelectedItems.map(it => it.id));
  }  

  // 직접적은 item 을 selection 하기 위해서 사용한다. 
  select(...ids) {

    var list = this.modelManager.searchItemsById(this.filterIds(ids || [])).filter(it => !it.lock && it.isAbsolute)

    const newSelectedItems = list.filter(it => {
      return it.path.filter(element => list.includes(element)).length < 2;
    }); 

    const newSelectedIds = newSelectedItems.map(it => it.id);

    // 동일한 selection 을 가지고 있으면 더 이상 select 를 진행하지 않는다. 
    if (this.isSameIds(newSelectedIds)) {
      return false; 
    }

    // this.items = newSelectedItems;
    this.itemKeys = {}
    newSelectedItems.forEach(item => {
      this.itemKeys[item.id] = item;
    })
    this.ids = newSelectedIds

    this.setRectCache();

    return true; 
  }

  reload() {
    return this.select(...this.ids);

  }

  reselect () {
    this.setRectCache();
  }

  check (item) {
    return !!this.itemKeys[item.id]
  }

  hasPathOf(item) {
    return this.modelManager.hasPathOf(this.items.filter(it => it.isNot('artboard')), item);
  }

  hasParent(parentId) {
    return this.items.some(it => it.hasParent(parentId));
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

    if (Array.isArray(ids)) {
      itemIdList = ids; 
    } else if (isString(ids) || isObject(ids)) {
      itemIdList = [ids];
    }

    return this.modelManager.searchItemsById(itemIdList);    

  }

  /**
   * id 로 아이템 선택하기 
   * 
   * @param {string} id 
   */
  selectById(id) {
    this.select(id)
  }

  selectAfterCopy () {
    this.select(...this.items.map(it => it.copy()));
  }

  addById(id) {

    if (this.itemKeys[id]) return;

    this.select(...this.ids, id)
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

    const filteredItems = this.ids.filter(id => ids.includes(id) === false)

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
    return this.currentProject.artboards.find(artboard => {
      return polyPoint(artboard.originVerties, ...vec) 
    })
  }

  changeArtBoard () {

    let checkedParentChange = false

    this.each(instance => {

      if (instance.is('artboard') === false) {

        const instanceVerties = instance.originVerties;

        // FIXME: 내가 속한 영역이 객체의 instance 의 artboard 안에 있으면 artboard 를 바꾸지 않는다. 
        if (instance.artboard) {
          const localArtboard = instance.artboard;
          const localArtboardVerties = localArtboard.originVerties;

          const isInArtboard = polyPoint(localArtboardVerties, ...instanceVerties[0]) || polyPoly(instanceVerties, localArtboardVerties) 


          // 내가 여전히 나의 artboard 에 속해 있으면 변경하지 않는다. 
          if (isInArtboard) {
            return false;
          }
        }

  
        const selectedArtBoard = this.cachedArtBoardVerties.find(artboard => {
          const artboardVerties = artboard.matrix.originVerties;
          return polyPoint(artboardVerties, ...instanceVerties[0]) || polyPoly(instanceVerties, artboardVerties) 
        })
  

        if (selectedArtBoard) {
          // 부모 artboard 가 다르면  artboard 를 교체한다.            
          if (selectedArtBoard.item !== instance.artboard) {
            selectedArtBoard.item.appendChild(instance);
            checkedParentChange = true;
          }
        } else {
          if (instance.artboard) {
            this.currentProject.appendChild(instance);       
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
      this.cachedItemMatrices = []
      this.cachedArtBoardVerties = this.currentProject.artboards.map(item => {
        return { item, matrix: item.matrix};
      })
  
      return;
    }

    this.cachedVerties = this.verties;
    this.cachedRectVerties = toRectVerties(this.verties);

    this.cachedItemMatrices = []
    this.cachedChildren = [];
    
    this.items.forEach(it => {

      // artboard 가 선택되어 있을 때는 artboard 만 포함 
      if (it.is('artboard')) {
        this.cachedItemMatrices.push(it.matrix);
      } 
      // artboard 가 아닌데 자식을 가지고 있을 때는 자식을 포함 
      // TODO: layout 을 가지고 있는 경우 어떻게 해야할지 정해야함 
      else if (it.hasChildren()) {
        const list = this.modelManager.getAllLayers(it.id).map(it => it.matrix);

        this.cachedChildren.push(...list.map(it => it.id))
        this.cachedItemMatrices.push(...list);
      } 
      // 그 외는 아트보드처럼 자신만 포함 
      else {
        this.cachedItemMatrices.push(it.matrix);
      }

    })

    // artboard 항목만 따로 캐슁 
    this.cachedArtBoardVerties = this.currentProject.artboards.map(item => {
      return { item, matrix: item.matrix};
    })

    // 현재 객체 matrix 캐쉬 설정 
    this.cachedCurrentItemMatrix = this.current.matrix;

    // 현재 객체 자식 matrix 캐쉬 설정 
    this.cachedCurrentChildrenItemMatrices = this.modelManager.getAllLayers(this.current.id).map(it => it.matrix);
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


  get originVerties () {
    return this.rectVerties.filter((_, index) => index < 4);
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
    let localItems = []
    if (ids === null) {
      localItems = this.items;
    } else if (isString(ids) || Array.isArray(ids)){
      localItems = this.itemsByIds(ids);
    }

    localItems.forEach(item => {
      data[item.id] = {}

      Object.keys(valueObject).forEach(key => {
        data[item.id][key] = isFunction(valueObject[key]) ? valueObject[key].call(valueObject, item) : valueObject[key]
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
  
  /**
   * 특정 위치가 selection 영역에 있는지 여부 체크 
   * 
   * @param {vec3} point 
   * @param {number} y 
   */
  hasPoint (point) {

    if (this.isMany) {
      // 멀티 selection 일 때는  사각형 영역에서 체크 
      return polyPoint(this.originVerties, point[0], point[1]);
    } else {
      return this.current?.hasPoint(point[0], point[1]);
    }
    
  }

  /**
   * 특정 위치가 selection 영역의 자식에게  있는지 여부 체크
   * @param {vec3} point 
   * @returns {boolean}
   */
  hasChildrenPoint (point) {
    return this.cachedChildren.some(it => {
      return this.modelManager.get(it)?.hasPoint(point[0], point[1]);
    });
  }

  checkHover (itemOrId) {
    if (isString(itemOrId)) {
      return this.hoverId === itemOrId; 
    } else {
      return this.hoverItems.findIndex((it) => it.id === itemOrId.id) > -1; 
    }
  }

  /**
   * hover item 이 있는지 체크 
   * 
   * @returns {boolean}
   */
  hasHoverItem() {
    return this.hoverId !== '';
  }

  /**
   * hover 된 item 을 선택한다.
   * 
   */
  selectHoverItem() {
    this.select(this.hoverId);
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
      this.hoverItems = this.itemsByIds([id]).filter(it => it.isNot('artboard'));

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

  is (...args) {
    return this.current?.is(...args);
  }
}
