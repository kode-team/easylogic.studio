import { isFunction, isUndefined, isArray } from "../../util/functions/func";
import { Length } from "../unit/Length";
import AreaItem from "../items/AreaItem";


const roundedLength = (px, fixedRound = 1) => {
  return Length.px(px).round(fixedRound);
}

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
  constructor() {

    this.project = null;
    this.artboard = null;
    this.items = [];
    this.itemKeys = {} 
    this.colorsteps = []
  }

  initialize() {
    this.colorsteps = []    
    this.items = [];
    this.itemKeys = {} 
  }

  /**
   * get first item instance
   */
  get current() {
    return this.items[0]
  }

  get currentProject () {
    return this.project;
  }

  get currentArtboard () {
    return this.artboard;
  }

  get isEmpty () {
    return !this.length 
  }

  get length () {
    return this.items.length;
  }

  getRootItem (current) {
    var rootItem = current || this.currentArtboard;
    if (current) {
      if (current.is('artboard')) {
        rootItem = current; 
      } else if (current.parent) {
        rootItem = current.parent; 
      }
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
    this.artboard = null;
    if (this.project.artboards.length) {
      this.selectArtboard(this.project.artboards[0]);
    }
  }

  selectArtboard (artboard) {
    this.artboard = artboard;

    this.items = [];
    if (this.artboard.layers.length) {
      this.select(this.artboard.layers[0]);
    }

  }

  get isRelative () {
    var item = this.items[0] || { }

    return item.position === 'relative'
  }

  hasDifference (list) {

    if (list.length != this.items.length) {
      return true; 
    }

    var setA = new Set(list);
    var setB = new Set(this.items);

    var equalCount = 0; 
    for (var elem of setB) {
        if (setA.has(elem)) {
          equalCount++;
        }
    }

    return setB.size != equalCount;    
  }

  select(...args) {

    var list = (args || []).filter(it => !it.lock && it.isAbsolute)


    // 차이가 없다면 selection 을 다시 하지 않는다. 
    if (this.hasDifference(list) === false) {
      return false; 
    }

    this.items = list; 

    this.itemKeys = {}
    this.items.forEach(it => {
      this.itemKeys[it.id] = it; 
    })

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

  isArtBoard () {
    return this.items.length ?  this.current.is('artboard') : false;
  }

  empty () {
    this.select()
  }

  itemsByIds(ids = null) {
    if (isArray(ids)) {
      return _traverse(this.artboard, ids)
    } else {
      return this.items;
    }
  }

  selectById(id) {
    this.select(... _traverse(this.artboard, id))
  }

  addById(id) {

    if (this.itemKeys[id]) return;

    this.select(...this.items, ... _traverse(this.artboard, id))
  }  

  removeById(id) {
    this.select(...this.items.filter(it => it.id != id))
  }    

  toggleById (id) {
    if (this.itemKeys[id]) {
      this.removeById(id);
    } else {
      this.addById(id);
    }
  }

  setRectCache (isCache = true) {
    
    this.cachedItems = this.items.map(it => {
      // Layer 마다 캐쉬 할게 있으면 캐쉬 하고 
      if (isCache) it.setCache();
      // 최종 결과물을 clone 한다. 
      // 이렇게 하는 이유는 복합 객체의 넓이 , 높이르 바꿀 때 실제 path 의 각각의 point 도 바뀌어야 하기 때문이다. 
      return it.clone()
    })

    this.setAllRectCache();
  }

  setAllRectCache () {

    var minX = Number.MAX_SAFE_INTEGER;
    var minY = Number.MAX_SAFE_INTEGER;

    var maxX = Number.MIN_SAFE_INTEGER;    
    var maxY = Number.MIN_SAFE_INTEGER;

    this.cachedItems.forEach(it => {
      minX = Math.min(it.screenX.value, minX);
      minY = Math.min(it.screenY.value, minY);

      maxX = Math.max(it.screenX2.value, maxX);
      maxY = Math.max(it.screenY2.value, maxY);      
    })

    if (minX === Number.MAX_SAFE_INTEGER) minX = 0;
    if (minY === Number.MAX_SAFE_INTEGER) minY = 0;
    if (maxX === Number.MIN_SAFE_INTEGER) maxX = 0;
    if (maxY === Number.MIN_SAFE_INTEGER) maxY = 0;

    this.allRect = new AreaItem({
      x: Length.px(minX),
      y: Length.px(minY),
      width: Length.px(maxX - minX),
      height: Length.px(maxY - minY)
    })

  }

  each (callback) {

    if ( isFunction(callback)) {
      this.items.forEach( (item, index) => {
        callback (item, this.cachedItems[index]);
      })
    }

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
    var hasParent = !prevItem.is('artboard') && parentItems.includes(parent); 

    while(!hasParent) {
      if (isUndefined(parent)) break; 
      prevItem = parent; 
      parent = parent.parent; 
      hasParent = !prevItem.is('artboard') && parentItems.includes(parent); 
    }

    return hasParent; 
  }
  
  move (dx, dy) {
    this.each ((item, cachedItem, ) => {

      if (this.isInParent(item, this.items)) {
        // noop 
        // 부모가 있을 때는 dx, dy 로 위치를 옮기지 않는다. 
        // 왜냐하면 이미부모로 부터 위치가 모두 옮겨졌기 때문에. 
      } else {
        item.move( 
          roundedLength(cachedItem.x.value + dx),
          roundedLength(cachedItem.y.value + dy)
        )
      }

    })

    this.reselect()
  }

  moveRight (dx) {
    this.each ((item, cachedItem, ) => {
      item.resizeWidth(roundedLength(cachedItem.width.value + dx))
    })
  }

  moveLeft (dx) {
    this.each ((item, cachedItem, ) => {
      if (cachedItem.width.value - dx >= 0) {
          item.moveX( roundedLength(cachedItem.x.value + dx) )
          item.resizeWidth( roundedLength(cachedItem.width.value - dx) )
      }
    })    
  }

  moveBottom (dy) {
    this.each ((item, cachedItem, ) => {
      item.resizeHeight( roundedLength(cachedItem.height.value + dy) )
    })    
  }

  moveTop (dy) {
    this.each ((item, cachedItem, ) => {
      if ( cachedItem.height.value - dy >= 0 ) {
          item.moveY( roundedLength(cachedItem.y.value + dy) )                                
          item.resizeHeight( roundedLength(cachedItem.height.value - dy) )    
      }
    })
  }
}
